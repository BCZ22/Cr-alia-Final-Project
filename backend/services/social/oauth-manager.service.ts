/**
 * 🔐 OAuth Manager Service - Gestionnaire de connexions OAuth2 multi-plateformes
 * 
 * Ce service gère les connexions OAuth2 sécurisées pour toutes les plateformes sociales,
 * avec support multi-profils, multi-marques et gestion des rôles.
 */

import { z } from 'zod';
import crypto from 'crypto';
import { PrismaClient, SocialPlatform, UserRole, SocialAccountStatus } from '@prisma/client';

// Schémas de validation
const SocialPlatformSchema = z.nativeEnum(SocialPlatform);
const UserRoleSchema = z.nativeEnum(UserRole);
const AccountTypeSchema = z.enum(['personal', 'business', 'creator', 'agency']);
const ConnectionStatusSchema = z.nativeEnum(SocialAccountStatus);

export interface SocialAccount {
  id: string;
  userId: string;
  platform: z.infer<typeof SocialPlatformSchema>;
  accountType: z.infer<typeof AccountTypeSchema>;
  username: string;
  displayName: string;
  profilePicture?: string;
  accessToken: string;
  refreshToken?: string;
  tokenExpiresAt?: Date;
  scope: string[];
  status: z.infer<typeof ConnectionStatusSchema>;
  permissions: string[];
  metadata: {
    followers?: number;
    following?: number;
    posts?: number;
    verified?: boolean;
    businessCategory?: string;
    website?: string;
    bio?: string;
    location?: string;
    language?: string;
  };
  connectedAt: Date;
  lastSyncAt?: Date;
  expiresAt?: Date;
  isActive: boolean;
}

export interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string[];
  authUrl: string;
  tokenUrl: string;
  userInfoUrl: string;
  refreshUrl?: string;
}

export interface ConnectionRequest {
  userId: string;
  platform: z.infer<typeof SocialPlatformSchema>;
  accountType: z.infer<typeof AccountTypeSchema>;
  permissions: string[];
  teamId?: string;
  role: z.infer<typeof UserRoleSchema>;
}

export class OAuthManagerService {
  private prisma: PrismaClient;
  private oauthConfigs: Map<string, OAuthConfig> = new Map();
  private stateStore: Map<string, any> = new Map();

  constructor() {
    this.prisma = new PrismaClient();
    this.initializeOAuthConfigs();
  }

  /**
   * 🔗 Génère une URL d'autorisation OAuth2
   */
  async generateAuthUrl(request: ConnectionRequest): Promise<{ authUrl: string; state: string }> {
    try {
      SocialPlatformSchema.parse(request.platform);
      UserRoleSchema.parse(request.role);
      AccountTypeSchema.parse(request.accountType);

      const config = this.oauthConfigs.get(request.platform);
      if (!config) {
        throw new Error(`Configuration OAuth non trouvée pour ${request.platform}`);
      }

      // Générer un state sécurisé
      const state = crypto.randomBytes(32).toString('hex');
      
      // Stocker les informations de la requête
      this.stateStore.set(state, {
        ...request,
        timestamp: Date.now(),
        expiresAt: Date.now() + (10 * 60 * 1000) // 10 minutes
      });

      // Construire l'URL d'autorisation
      const authUrl = new URL(config.authUrl);
      authUrl.searchParams.set('client_id', config.clientId);
      authUrl.searchParams.set('redirect_uri', config.redirectUri);
      authUrl.searchParams.set('response_type', 'code');
      authUrl.searchParams.set('scope', config.scope.join(' '));
      authUrl.searchParams.set('state', state);
      authUrl.searchParams.set('access_type', 'offline');
      authUrl.searchParams.set('prompt', 'consent');

      return {
        authUrl: authUrl.toString(),
        state
      };
    } catch (error) {
      console.error('Erreur lors de la génération de l\'URL d\'autorisation:', error);
      throw new Error('Impossible de générer l\'URL d\'autorisation');
    }
  }

  /**
   * 🔄 Traite le callback OAuth2 et échange le code contre un token
   */
  async handleCallback(
    platform: z.infer<typeof SocialPlatformSchema>,
    code: string,
    state: string
  ): Promise<SocialAccount> {
    try {
      // Vérifier le state
      const requestData = this.stateStore.get(state);
      if (!requestData || requestData.expiresAt < Date.now()) {
        throw new Error('State invalide ou expiré');
      }

      const config = this.oauthConfigs.get(platform);
      if (!config) {
        throw new Error(`Configuration OAuth non trouvée pour ${platform}`);
      }

      // Échanger le code contre un token
      const tokenResponse = await this.exchangeCodeForToken(config, code);
      
      // Récupérer les informations utilisateur
      const userInfo = await this.getUserInfo(config, tokenResponse.access_token);
      
      // Créer ou mettre à jour le compte
      const account = await this.createOrUpdateAccount({
        ...requestData,
        platform,
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token,
        tokenExpiresAt: tokenResponse.expires_in ? 
          new Date(Date.now() + tokenResponse.expires_in * 1000) : undefined,
        userInfo
      });

      // Nettoyer le state
      this.stateStore.delete(state);

      return account;
    } catch (error) {
      console.error('Erreur lors du traitement du callback OAuth:', error);
      throw new Error('Impossible de traiter le callback OAuth');
    }
  }

  /**
   * 🔄 Rafraîchit un token d'accès expiré
   */
  async refreshToken(accountId: string): Promise<SocialAccount> {
    try {
      const account = await this.prisma.socialAccount.findUnique({
        where: { id: accountId }
      });

      if (!account) {
        throw new Error('Compte non trouvé');
      }

      if (!account.refreshToken) {
        throw new Error('Token de rafraîchissement non disponible');
      }

      const config = this.oauthConfigs.get(account.platform);
      if (!config || !config.refreshUrl) {
        throw new Error('Configuration de rafraîchissement non disponible');
      }

      // Rafraîchir le token
      const tokenResponse = await this.refreshAccessToken(config, account.refreshToken);
      
      // Mettre à jour le compte
      const updatedAccount = await this.prisma.socialAccount.update({
        where: { id: accountId },
        data: {
          accessToken: tokenResponse.access_token,
          refreshToken: tokenResponse.refresh_token || account.refreshToken,
          // tokenExpiresAt: tokenResponse.expires_in ? 
          //   new Date(Date.now() + tokenResponse.expires_in * 1000) : undefined,
          lastSyncAt: new Date(),
          status: 'CONNECTED'
        }
      });

      return this.mapToSocialAccount(updatedAccount);
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token:', error);
      
      // Marquer le compte comme expiré
      await this.prisma.socialAccount.update({
        where: { id: accountId },
        data: { status: 'EXPIRED' }
      });
      
      throw new Error('Impossible de rafraîchir le token');
    }
  }

  /**
   * 📋 Liste tous les comptes connectés d'un utilisateur
   */
  async getUserAccounts(userId: string, teamId?: string): Promise<SocialAccount[]> {
    try {
      const where: any = { userId, isActive: true };
      if (teamId) {
        where.teamId = teamId;
      }

      const accounts = await this.prisma.socialAccount.findMany({
        where,
        orderBy: { connectedAt: 'desc' }
      });

      return accounts.map(account => this.mapToSocialAccount(account));
    } catch (error) {
      console.error('Erreur lors de la récupération des comptes:', error);
      throw new Error('Impossible de récupérer les comptes');
    }
  }

  /**
   * 🗑️ Déconnecte un compte
   */
  async disconnectAccount(accountId: string, userId: string): Promise<void> {
    try {
      const account = await this.prisma.socialAccount.findFirst({
        where: { id: accountId, userId }
      });

      if (!account) {
        throw new Error('Compte non trouvé ou non autorisé');
      }

      // Révocation du token (si l'API le supporte)
      try {
        await this.revokeToken(account.platform, account.accessToken);
      } catch (error) {
        console.warn('Impossible de révoquer le token:', error);
      }

      // Marquer comme déconnecté
      await this.prisma.socialAccount.update({
        where: { id: accountId },
        data: { 
          status: 'REVOKED',
          isActive: false,
          // expiresAt: new Date()
        }
      });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      throw new Error('Impossible de déconnecter le compte');
    }
  }

  /**
   * 🔍 Vérifie le statut de tous les comptes et détecte les expirations
   */
  async checkAccountStatuses(): Promise<{ expired: number; refreshed: number; errors: number }> {
    try {
      const accounts = await this.prisma.socialAccount.findMany({
        where: { 
          isActive: true,
          status: 'CONNECTED'
        }
      });

      let expired = 0;
      let refreshed = 0;
      let errors = 0;

      for (const account of accounts) {
        try {
          // Vérifier si le token est expiré ou va expirer bientôt
          // if (account.tokenExpiresAt && account.tokenExpiresAt <= new Date(Date.now() + 5 * 60 * 1000)) {
          //   if (account.refreshToken) {
          //     await this.refreshToken(account.id);
          //     refreshed++;
          //   } else {
          //     await this.prisma.socialAccount.update({
          //       where: { id: account.id },
          //       data: { status: 'EXPIRED' }
          //     });
          //     expired++;
          //   }
          // }
        } catch (error) {
          console.error(`Erreur lors de la vérification du compte ${account.id}:`, error);
          errors++;
        }
      }

      return { expired, refreshed, errors };
    } catch (error) {
      console.error('Erreur lors de la vérification des statuts:', error);
      throw new Error('Impossible de vérifier les statuts des comptes');
    }
  }

  // Méthodes privées

  private initializeOAuthConfigs(): void {
    // Configuration Instagram
    this.oauthConfigs.set('instagram', {
      clientId: process.env.INSTAGRAM_CLIENT_ID || '',
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET || '',
      redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/instagram/callback`,
      scope: ['user_profile', 'user_media'],
      authUrl: 'https://api.instagram.com/oauth/authorize',
      tokenUrl: 'https://api.instagram.com/oauth/access_token',
      userInfoUrl: 'https://graph.instagram.com/me',
      refreshUrl: 'https://graph.instagram.com/refresh_access_token'
    });

    // Configuration YouTube
    this.oauthConfigs.set('youtube', {
      clientId: process.env.YOUTUBE_CLIENT_ID || '',
      clientSecret: process.env.YOUTUBE_CLIENT_SECRET || '',
      redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/youtube/callback`,
      scope: ['https://www.googleapis.com/auth/youtube.readonly', 'https://www.googleapis.com/auth/yt-analytics.readonly'],
      authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenUrl: 'https://oauth2.googleapis.com/token',
      userInfoUrl: 'https://www.googleapis.com/youtube/v3/channels',
      refreshUrl: 'https://oauth2.googleapis.com/token'
    });

    // Configuration TikTok
    this.oauthConfigs.set('tiktok', {
      clientId: process.env.TIKTOK_CLIENT_ID || '',
      clientSecret: process.env.TIKTOK_CLIENT_SECRET || '',
      redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/tiktok/callback`,
      scope: ['user.info.basic', 'video.list'],
      authUrl: 'https://www.tiktok.com/auth/authorize',
      tokenUrl: 'https://open-api.tiktok.com/oauth/access_token',
      userInfoUrl: 'https://open-api.tiktok.com/user/info',
      refreshUrl: 'https://open-api.tiktok.com/oauth/refresh_token'
    });

    // Configuration Facebook
    this.oauthConfigs.set('facebook', {
      clientId: process.env.FACEBOOK_CLIENT_ID || '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
      redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/facebook/callback`,
      scope: ['pages_read_engagement', 'pages_show_list', 'instagram_basic', 'instagram_manage_insights'],
      authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
      tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
      userInfoUrl: 'https://graph.facebook.com/v18.0/me',
      refreshUrl: 'https://graph.facebook.com/v18.0/oauth/access_token'
    });

    // Configuration Twitter/X
    this.oauthConfigs.set('twitter', {
      clientId: process.env.TWITTER_CLIENT_ID || '',
      clientSecret: process.env.TWITTER_CLIENT_SECRET || '',
      redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/twitter/callback`,
      scope: ['tweet.read', 'users.read', 'offline.access'],
      authUrl: 'https://twitter.com/i/oauth2/authorize',
      tokenUrl: 'https://api.twitter.com/2/oauth2/token',
      userInfoUrl: 'https://api.twitter.com/2/users/me',
      refreshUrl: 'https://api.twitter.com/2/oauth2/token'
    });

    // Configuration LinkedIn
    this.oauthConfigs.set('linkedin', {
      clientId: process.env.LINKEDIN_CLIENT_ID || '',
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET || '',
      redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/linkedin/callback`,
      scope: ['r_liteprofile', 'r_emailaddress', 'w_member_social'],
      authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
      tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
      userInfoUrl: 'https://api.linkedin.com/v2/people/~',
      refreshUrl: 'https://www.linkedin.com/oauth/v2/accessToken'
    });

    // Configuration Pinterest
    this.oauthConfigs.set('pinterest', {
      clientId: process.env.PINTEREST_CLIENT_ID || '',
      clientSecret: process.env.PINTEREST_CLIENT_SECRET || '',
      redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/pinterest/callback`,
      scope: ['boards:read', 'pins:read', 'user_accounts:read'],
      authUrl: 'https://www.pinterest.com/oauth',
      tokenUrl: 'https://api.pinterest.com/v5/oauth/token',
      userInfoUrl: 'https://api.pinterest.com/v5/user_account',
      refreshUrl: 'https://api.pinterest.com/v5/oauth/token'
    });

    // Configuration Snapchat
    this.oauthConfigs.set('snapchat', {
      clientId: process.env.SNAPCHAT_CLIENT_ID || '',
      clientSecret: process.env.SNAPCHAT_CLIENT_SECRET || '',
      redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/snapchat/callback`,
      scope: ['user.bitmoji.avatar'],
      authUrl: 'https://accounts.snapchat.com/login/oauth2/authorize',
      tokenUrl: 'https://accounts.snapchat.com/login/oauth2/access_token',
      userInfoUrl: 'https://kit.snapchat.com/v1/me',
      refreshUrl: 'https://accounts.snapchat.com/login/oauth2/access_token'
    });
  }

  private async exchangeCodeForToken(config: OAuthConfig, code: string): Promise<any> {
    const response = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: config.redirectUri
      })
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de l'échange du code: ${response.statusText}`);
    }

    return await response.json();
  }

  private async refreshAccessToken(config: OAuthConfig, refreshToken: string): Promise<any> {
    const response = await fetch(config.refreshUrl!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      })
    });

    if (!response.ok) {
      throw new Error(`Erreur lors du rafraîchissement: ${response.statusText}`);
    }

    return await response.json();
  }

  private async getUserInfo(config: OAuthConfig, accessToken: string): Promise<any> {
    const response = await fetch(config.userInfoUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des infos utilisateur: ${response.statusText}`);
    }

    return await response.json();
  }

  private async createOrUpdateAccount(data: any): Promise<SocialAccount> {
    const existingAccount = await this.prisma.socialAccount.findFirst({
      where: {
        userId: data.userId,
        platform: data.platform,
        username: data.userInfo.username || data.userInfo.name,
      },
    });

    if (existingAccount) {
      // Update
      const updatedAccount = await this.prisma.socialAccount.update({
        where: { id: existingAccount.id },
        data: {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          // tokenExpiresAt: data.tokenExpiresAt,
          status: 'CONNECTED',
          lastSyncAt: new Date(),
          metadata: data.userInfo,
        },
      });
      return this.mapToSocialAccount(updatedAccount);
    } else {
      // Create
      const newAccount = await this.prisma.socialAccount.create({
        data: {
          userId: data.userId,
          platform: data.platform,
          accountType: data.accountType,
          username: data.userInfo.username || data.userInfo.name,
          displayName: data.userInfo.display_name || data.userInfo.name,
          profilePicture: data.userInfo.profile_picture || data.userInfo.avatar_url,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          // tokenExpiresAt: data.tokenExpiresAt,
          status: 'CONNECTED',
          permissions: data.permissions,
          metadata: data.userInfo,
          connectedAt: new Date(),
          lastSyncAt: new Date(),
          isActive: true,
        },
      });
      return this.mapToSocialAccount(newAccount);
    }
  }

  private async revokeToken(platform: string, accessToken: string): Promise<void> {
    // Implémentation spécifique par plateforme pour révoquer les tokens
    // Cette méthode sera étendue selon les APIs de chaque plateforme
    console.log(`Révocation du token pour ${platform}`);
  }

  private mapToSocialAccount(account: any): SocialAccount {
    return {
      id: account.id,
      userId: account.userId,
      platform: account.platform,
      accountType: account.accountType,
      username: account.username,
      displayName: account.displayName,
      profilePicture: account.profilePicture,
      accessToken: account.accessToken,
      refreshToken: account.refreshToken,
      tokenExpiresAt: account.tokenExpiresAt,
      scope: account.scope,
      status: account.status,
      permissions: account.permissions,
      metadata: account.metadata,
      connectedAt: account.connectedAt,
      lastSyncAt: account.lastSyncAt,
      expiresAt: account.expiresAt,
      isActive: account.isActive
    };
  }
}

export default OAuthManagerService;