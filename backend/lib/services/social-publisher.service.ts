import { TwitterApi } from "twitter-api-v2";
import { google } from "googleapis";
import axios from "axios";

export interface PublishContentParams {
  content: string;
  platform: string;
  userId: string;
  contentId: string;
  scheduledAt?: Date;
  metadata?: any;
}

export interface SocialMediaToken {
  platform: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  scope?: string[];
  userId: string;
}

export class SocialPublisherService {
  private tokens: Map<string, SocialMediaToken> = new Map();

  async publishContent(params: PublishContentParams) {
    try {
      const { platform, content, userId, contentId, scheduledAt, metadata } = params;

      switch (platform.toLowerCase()) {
        case "twitter":
          return await this.publishToTwitter(content, userId, contentId, scheduledAt, metadata);
        case "linkedin":
          return await this.publishToLinkedIn(content, userId, contentId, scheduledAt, metadata);
        case "instagram":
          return await this.publishToInstagram(content, userId, contentId, scheduledAt, metadata);
        case "youtube":
          return await this.publishToYouTube(content, userId, contentId, scheduledAt, metadata);
        case "tiktok":
          return await this.publishToTikTok(content, userId, contentId, scheduledAt, metadata);
        case "facebook":
          return await this.publishToFacebook(content, userId, contentId, scheduledAt, metadata);
        default:
          return { success: false, error: `Plateforme non supportée: ${platform}` };
      }
    } catch (error) {
      console.error("Erreur lors de la publication:", error);
      return { success: false, error: error instanceof Error ? error.message : "Erreur inconnue" };
    }
  }

  private async publishToTwitter(content: string, userId: string, contentId: string, scheduledAt?: Date, metadata?: any) {
    try {
      const token = this.getAccessToken("twitter", userId);
      if (!token) {
        return { success: false, error: "Token Twitter non trouvé" };
      }

      const twitterClient = new TwitterApi(token.accessToken);

      if (scheduledAt && scheduledAt > new Date()) {
        // Publication programmée (nécessite Twitter API v2 avec fonctionnalités avancées)
        return { success: false, error: "Publication programmée non implémentée pour Twitter" };
      }

      const tweet = await twitterClient.v2.tweet(content);
      
      return {
        success: true,
        publishedAt: new Date(),
        platformPostId: tweet.data.id,
        url: `https://twitter.com/user/status/${tweet.data.id}`,
        metadata: {
          platform: "twitter",
          contentId,
          userId,
          ...metadata,
        },
      };
    } catch (error) {
      console.error("Erreur publication Twitter:", error);
      return { success: false, error: error instanceof Error ? error.message : "Erreur Twitter" };
    }
  }

  private async publishToLinkedIn(content: string, userId: string, contentId: string, scheduledAt?: Date, metadata?: any) {
    try {
      const token = this.getAccessToken("linkedin", userId);
      if (!token) {
        return { success: false, error: "Token LinkedIn non trouvé" };
      }

      // LinkedIn API v2 pour les posts
      const response = await axios.post(
        "https://api.linkedin.com/v2/ugcPosts",
        {
          author: `urn:li:person:${metadata?.linkedinUserId}`,
          lifecycleState: "PUBLISHED",
          specificContent: {
            "com.linkedin.ugc.ShareContent": {
              shareCommentary: {
                text: content,
              },
              shareMediaCategory: "NONE",
            },
          },
          visibility: {
            "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
            "Content-Type": "application/json",
            "X-Restli-Protocol-Version": "2.0.0",
          },
        }
      );

      return {
        success: true,
        publishedAt: new Date(),
        platformPostId: response.data.id,
        url: `https://www.linkedin.com/feed/update/${response.data.id}`,
        metadata: {
          platform: "linkedin",
          contentId,
          userId,
          ...metadata,
        },
      };
    } catch (error) {
      console.error("Erreur publication LinkedIn:", error);
      return { success: false, error: error instanceof Error ? error.message : "Erreur LinkedIn" };
    }
  }

  private async publishToInstagram(content: string, userId: string, contentId: string, scheduledAt?: Date, metadata?: any) {
    try {
      const token = this.getAccessToken("instagram", userId);
      if (!token) {
        return { success: false, error: "Token Instagram non trouvé" };
      }

      // Instagram Basic Display API
      const response = await axios.post(
        `https://graph.instagram.com/me/media`,
        {
          image_url: metadata?.imageUrl,
          caption: content,
          access_token: token.accessToken,
        }
      );

      return {
        success: true,
        publishedAt: new Date(),
        platformPostId: response.data.id,
        url: `https://www.instagram.com/p/${response.data.id}`,
        metadata: {
          platform: "instagram",
          contentId,
          userId,
          ...metadata,
        },
      };
    } catch (error) {
      console.error("Erreur publication Instagram:", error);
      return { success: false, error: error instanceof Error ? error.message : "Erreur Instagram" };
    }
  }

  private async publishToYouTube(content: string, userId: string, contentId: string, scheduledAt?: Date, metadata?: any) {
    try {
      const token = this.getAccessToken("youtube", userId);
      if (!token) {
        return { success: false, error: "Token YouTube non trouvé" };
      }

      const youtube = google.youtube({
        version: "v3",
        auth: token.accessToken,
      });

      const response = await youtube.videos.insert({
        part: ["snippet", "status"],
        requestBody: {
          snippet: {
            title: metadata?.title || "Contenu généré",
            description: content,
            tags: metadata?.tags || [],
          },
          status: {
            privacyStatus: "public",
            ...(scheduledAt && { publishAt: scheduledAt.toISOString() }),
          },
        },
        media: {
          body: metadata?.videoFile,
        },
      });

      return {
        success: true,
        publishedAt: new Date(),
        platformPostId: response.data.id,
        url: `https://www.youtube.com/watch?v=${response.data.id}`,
        metadata: {
          platform: "youtube",
          contentId,
          userId,
          ...metadata,
        },
      };
    } catch (error) {
      console.error("Erreur publication YouTube:", error);
      return { success: false, error: error instanceof Error ? error.message : "Erreur YouTube" };
    }
  }

  private async publishToTikTok(content: string, userId: string, contentId: string, scheduledAt?: Date, metadata?: any) {
    try {
      const token = this.getAccessToken("tiktok", userId);
      if (!token) {
        return { success: false, error: "Token TikTok non trouvé" };
      }

      // TikTok API (nécessite une implémentation spécifique)
      const response = await axios.post(
        "https://open-api.tiktok.com/share/video/upload/",
        {
          video: metadata?.videoFile,
          description: content,
          access_token: token.accessToken,
        }
      );

      return {
        success: true,
        publishedAt: new Date(),
        platformPostId: response.data.share_id,
        url: `https://www.tiktok.com/@user/video/${response.data.share_id}`,
        metadata: {
          platform: "tiktok",
          contentId,
          userId,
          ...metadata,
        },
      };
    } catch (error) {
      console.error("Erreur publication TikTok:", error);
      return { success: false, error: error instanceof Error ? error.message : "Erreur TikTok" };
    }
  }

  private async publishToFacebook(content: string, userId: string, contentId: string, scheduledAt?: Date, metadata?: any) {
    try {
      const token = this.getAccessToken("facebook", userId);
      if (!token) {
        return { success: false, error: "Token Facebook non trouvé" };
      }

      const response = await axios.post(
        `https://graph.facebook.com/v18.0/me/feed`,
        {
          message: content,
          access_token: token.accessToken,
          ...(scheduledAt && { scheduled_publish_time: Math.floor(scheduledAt.getTime() / 1000) }),
        }
      );

      return {
        success: true,
        publishedAt: new Date(),
        platformPostId: response.data.id,
        url: `https://www.facebook.com/permalink.php?story_fbid=${response.data.id}`,
        metadata: {
          platform: "facebook",
          contentId,
          userId,
          ...metadata,
        },
      };
    } catch (error) {
      console.error("Erreur publication Facebook:", error);
      return { success: false, error: error instanceof Error ? error.message : "Erreur Facebook" };
    }
  }

  async refreshAccessToken(platform: string, userId: string) {
    try {
      const token = this.getAccessToken(platform, userId);
      if (!token || !token.refreshToken) {
        return { success: false, error: "Token de rafraîchissement non trouvé" };
      }

      // Implémentation spécifique selon la plateforme
      switch (platform.toLowerCase()) {
        case "twitter":
          return await this.refreshTwitterToken(token);
        case "linkedin":
          return await this.refreshLinkedInToken(token);
        case "youtube":
          return await this.refreshYouTubeToken(token);
        default:
          return { success: false, error: "Rafraîchissement non supporté pour cette plateforme" };
      }
    } catch (error) {
      console.error("Erreur lors du rafraîchissement du token:", error);
      return { success: false, error: error instanceof Error ? error.message : "Erreur inconnue" };
    }
  }

  private async refreshTwitterToken(token: SocialMediaToken) {
    // Twitter ne supporte pas le rafraîchissement de tokens
    return { success: false, error: "Twitter ne supporte pas le rafraîchissement de tokens" };
  }

  private async refreshLinkedInToken(token: SocialMediaToken) {
    try {
      const response = await axios.post("https://www.linkedin.com/oauth/v2/accessToken", {
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
      });

      const newToken: SocialMediaToken = {
        platform: "linkedin",
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresAt: new Date(Date.now() + response.data.expires_in * 1000),
        userId: token.userId,
      };

      this.storeAccessToken(newToken);
      return { success: true, token: newToken };
    } catch (error) {
      return { success: false, error: "Erreur lors du rafraîchissement LinkedIn" };
    }
  }

  private async refreshYouTubeToken(token: SocialMediaToken) {
    try {
      const oauth2Client = new google.auth.OAuth2(
        process.env.YOUTUBE_CLIENT_ID,
        process.env.YOUTUBE_CLIENT_SECRET
      );

      oauth2Client.setCredentials({
        refresh_token: token.refreshToken,
      });

      const { credentials } = await oauth2Client.refreshAccessToken();

      const newToken: SocialMediaToken = {
        platform: "youtube",
        accessToken: credentials.access_token!,
        refreshToken: credentials.refresh_token || token.refreshToken,
        expiresAt: credentials.expiry_date ? new Date(credentials.expiry_date) : undefined,
        userId: token.userId,
      };

      this.storeAccessToken(newToken);
      return { success: true, token: newToken };
    } catch (error) {
      return { success: false, error: "Erreur lors du rafraîchissement YouTube" };
    }
  }

  private getAccessToken(platform: string, userId: string): SocialMediaToken | null {
    const key = `${platform}:${userId}`;
    return this.tokens.get(key) || null;
  }

  private storeAccessToken(token: SocialMediaToken) {
    const key = `${token.platform}:${token.userId}`;
    this.tokens.set(key, token);
  }

  async schedulePublication(params: PublishContentParams) {
    try {
      const { scheduledAt } = params;
      
      if (!scheduledAt || scheduledAt <= new Date()) {
        return { success: false, error: "Date de publication invalide" };
      }

      // Ici, vous pourriez intégrer avec un système de queue (Bull, Agenda, etc.)
      // Pour l'instant, on simule la programmation
      
      return {
        success: true,
        scheduledAt,
        message: "Publication programmée avec succès",
        metadata: {
          platform: params.platform,
          contentId: params.contentId,
          userId: params.userId,
        },
      };
    } catch (error) {
      console.error("Erreur lors de la programmation de la publication:", error);
      return { success: false, error: error instanceof Error ? error.message : "Erreur inconnue" };
    }
  }
}