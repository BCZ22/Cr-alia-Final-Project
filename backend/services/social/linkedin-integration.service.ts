import axios from 'axios';

// Simple logger implementation to replace NestJS logger
const consoleLogger = {
  log: (message: string) => console.log(message),
  error: (message: string, trace?: string) => console.error(message, trace),
  warn: (message: string) => console.warn(message),
  debug: (message: string) => console.debug(message),
}

export interface LinkedInPostOptions {
  text: string;
  imageUrl?: string;
  videoUrl?: string;
  linkUrl?: string;
  linkTitle?: string;
  linkDescription?: string;
  scheduledTime?: Date;
  visibility?: 'PUBLIC' | 'CONNECTIONS';
}

export interface LinkedInPostResult {
  id: string;
  success: boolean;
  message?: string;
  error?: string;
  scheduledTime?: Date;
}

export class LinkedInIntegrationService {
  private readonly logger = consoleLogger;
  private accessToken: string;
  private baseUrl = 'https://api.linkedin.com/v2';

  constructor() {
    this.accessToken = process.env.LINKEDIN_ACCESS_TOKEN || '';
    if (!this.accessToken) {
      this.logger.warn('Token d\'accès LinkedIn manquant');
    }
  }

  async publishPost(options: LinkedInPostOptions): Promise<LinkedInPostResult> {
    try {
      if (!this.accessToken) {
        throw new Error('Token d\'accès LinkedIn manquant');
      }

      const postData = this.buildPostData(options);
      
      const response = await axios.post(
        `${this.baseUrl}/ugcPosts`,
        postData,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
            'X-Restli-Protocol-Version': '2.0.0',
          },
        }
      );

      return {
        id: response.data.id,
        success: true,
        message: 'Post LinkedIn publié avec succès',
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Erreur lors de la publication LinkedIn: ${errorMessage}`);
      return {
        id: '',
        success: false,
        error: errorMessage,
      };
    }
  }

  async publishVideo(
    videoUrl: string,
    options: Partial<LinkedInPostOptions>
  ): Promise<LinkedInPostResult> {
    try {
      if (!this.accessToken) {
        throw new Error('Token d\'accès LinkedIn manquant');
      }

      // Étape 1: Upload de la vidéo
      const uploadResponse = await this.uploadVideo(videoUrl);
      
      // Étape 2: Publication du post avec la vidéo
      const postData = {
        author: `urn:li:person:${process.env.LINKEDIN_USER_ID}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: options.text || '',
            },
            shareMediaCategory: 'VIDEO',
            media: [
              {
                status: 'READY',
                description: {
                  text: options.text || '',
                },
                media: uploadResponse.urn,
                title: {
                  text: options.linkTitle || 'Vidéo',
                },
              },
            ],
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': options.visibility || 'PUBLIC',
        },
      };

      const response = await axios.post(
        `${this.baseUrl}/ugcPosts`,
        postData,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
            'X-Restli-Protocol-Version': '2.0.0',
          },
        }
      );

      return {
        id: response.data.id,
        success: true,
        message: 'Vidéo LinkedIn publiée avec succès',
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Erreur lors de la publication vidéo LinkedIn: ${errorMessage}`);
      return {
        id: '',
        success: false,
        error: errorMessage,
      };
    }
  }

  async uploadVideo(videoUrl: string): Promise<{ urn: string }> {
    try {
      // Étape 1: Initialiser l'upload
      const initializeResponse = await axios.post(
        `${this.baseUrl}/assets?action=registerUpload`,
        {
          registerUploadRequest: {
            recipes: ['urn:li:digitalmediaRecipe:feedshare-video'],
            owner: `urn:li:person:${process.env.LINKEDIN_USER_ID}`,
            serviceRelationships: [
              {
                relationshipType: 'OWNER',
                identifier: 'urn:li:userGeneratedContent',
              },
            ],
          },
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
            'X-Restli-Protocol-Version': '2.0.0',
          },
        }
      );

      const uploadUrl = initializeResponse.data.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
      const asset = initializeResponse.data.value.asset;

      // Étape 2: Upload du fichier vidéo
      const videoBuffer = await this.downloadVideo(videoUrl);
      
      await axios.put(uploadUrl, videoBuffer, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/octet-stream',
        },
      });

      return { urn: asset };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Erreur lors de l'upload vidéo LinkedIn: ${errorMessage}`);
      throw error;
    }
  }

  async getPostMetrics(postId: string): Promise<any> {
    try {
      if (!this.accessToken) {
        throw new Error('Token d\'accès LinkedIn manquant');
      }

      const response = await axios.get(
        `${this.baseUrl}/socialActions/${postId}/statistics`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'X-Restli-Protocol-Version': '2.0.0',
          },
        }
      );

      return response.data;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Erreur lors de la récupération des métriques: ${errorMessage}`);
      throw error;
    }
  }

  async getUserProfile(): Promise<any> {
    try {
      if (!this.accessToken) {
        throw new Error('Token d\'accès LinkedIn manquant');
      }

      const response = await axios.get(
        `${this.baseUrl}/people/~`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'X-Restli-Protocol-Version': '2.0.0',
          },
        }
      );

      return response.data;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Erreur lors de la récupération du profil: ${errorMessage}`);
      throw error;
    }
  }

  async getCompanyPage(companyId: string): Promise<any> {
    try {
      if (!this.accessToken) {
        throw new Error('Token d\'accès LinkedIn manquant');
      }

      const response = await axios.get(
        `${this.baseUrl}/organizations/${companyId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'X-Restli-Protocol-Version': '2.0.0',
          },
        }
      );

      return response.data;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Erreur lors de la récupération de la page entreprise: ${errorMessage}`);
      throw error;
    }
  }

  async deletePost(postId: string): Promise<boolean> {
    try {
      if (!this.accessToken) {
        throw new Error('Token d\'accès LinkedIn manquant');
      }

      await axios.delete(
        `${this.baseUrl}/ugcPosts/${postId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'X-Restli-Protocol-Version': '2.0.0',
          },
        }
      );

      return true;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Erreur lors de la suppression du post: ${errorMessage}`);
      return false;
    }
  }

  async validateAccessToken(): Promise<boolean> {
    try {
      if (!this.accessToken) {
        return false;
      }

      await this.getUserProfile();
      return true;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Token d'accès LinkedIn invalide: ${errorMessage}`);
      return false;
    }
  }

  private buildPostData(options: LinkedInPostOptions): any {
    const postData: any = {
      author: `urn:li:person:${process.env.LINKEDIN_USER_ID}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: options.text,
          },
          shareMediaCategory: 'NONE',
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': options.visibility || 'PUBLIC',
      },
    };

    // Ajout d'une image
    if (options.imageUrl) {
      postData.specificContent['com.linkedin.ugc.ShareContent'].shareMediaCategory = 'IMAGE';
      postData.specificContent['com.linkedin.ugc.ShareContent'].media = [
        {
          status: 'READY',
          description: {
            text: options.text,
          },
          media: options.imageUrl,
          title: {
            text: options.linkTitle || 'Image',
          },
        },
      ];
    }

    // Ajout d'un lien
    if (options.linkUrl) {
      postData.specificContent['com.linkedin.ugc.ShareContent'].shareMediaCategory = 'ARTICLE';
      postData.specificContent['com.linkedin.ugc.ShareContent'].media = [
        {
          status: 'READY',
          description: {
            text: options.linkDescription || '',
          },
          originalUrl: options.linkUrl,
          title: {
            text: options.linkTitle || 'Lien',
          },
        },
      ];
    }

    return postData;
  }

  private async downloadVideo(videoUrl: string): Promise<Buffer> {
    try {
      const response = await axios.get(videoUrl, {
        responseType: 'arraybuffer',
      });
      return Buffer.from(response.data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Erreur lors du téléchargement de la vidéo: ${errorMessage}`);
      throw error;
    }
  }
}



