import { FacebookAdsApi } from 'facebook-nodejs-business-sdk';

// Simple logger implementation to replace NestJS logger
const consoleLogger = {
  log: (message: string) => console.log(message),
  error: (message: string, trace?: string) => console.error(message, trace),
  warn: (message: string) => console.warn(message),
  debug: (message: string) => console.debug(message),
}

export interface FacebookPostOptions {
  message: string;
  link?: string;
  imageUrl?: string;
  videoUrl?: string;
  scheduledTime?: Date;
  targetAudience?: {
    ageMin?: number;
    ageMax?: number;
    genders?: number[];
    countries?: string[];
    interests?: string[];
  };
}

export interface FacebookPostResult {
  id: string;
  success: boolean;
  message?: string;
  error?: string;
  scheduledTime?: Date;
}

export class FacebookIntegrationService {
  private readonly logger = consoleLogger;
  private facebookApi: FacebookAdsApi;

  constructor(accessToken: string, appId?: string, appSecret?: string) {
    this.facebookApi = FacebookAdsApi.init(accessToken);
    this.logger.log('API Facebook initialisée');
  }

  async publishPost(
    pageId: string,
    options: FacebookPostOptions
  ): Promise<FacebookPostResult> {
    try {
      if (!this.facebookApi) {
        throw new Error('API Facebook non configurée');
      }

      const postData: any = {
        message: options.message,
      };

      if (options.link) {
        postData.link = options.link;
      }

      if (options.imageUrl) {
        postData.url = options.imageUrl;
      }

      if (options.videoUrl) {
        postData.video_url = options.videoUrl;
      }

      if (options.scheduledTime) {
        postData.scheduled_publish_time = Math.floor(options.scheduledTime.getTime() / 1000);
        postData.published = false;
      }

      if (options.targetAudience) {
        postData.targeting = this.buildTargeting(options.targetAudience);
      }

      const response: any = await this.facebookApi.call(
        'POST',
        `/${pageId}/feed`,
        postData
      );

      return {
        id: response.id,
        success: true,
        message: 'Post publié avec succès',
        scheduledTime: options.scheduledTime,
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Erreur lors de la publication Facebook: ${errorMessage}`);
      return {
        id: '',
        success: false,
        error: errorMessage,
      };
    }
  }

  async publishVideo(
    pageId: string,
    videoUrl: string,
    options: Partial<FacebookPostOptions>
  ): Promise<FacebookPostResult> {
    try {
      if (!this.facebookApi) {
        throw new Error('API Facebook non configurée');
      }

      const videoData: any = {
        file_url: videoUrl,
        description: options.message || '',
      };

      if (options.scheduledTime) {
        videoData.scheduled_publish_time = Math.floor(options.scheduledTime.getTime() / 1000);
        videoData.published = false;
      }

      const response: any = await this.facebookApi.call(
        'POST',
        `/${pageId}/videos`,
        videoData
      );

      return {
        id: response.id,
        success: true,
        message: 'Vidéo publiée avec succès',
        scheduledTime: options.scheduledTime,
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Erreur lors de la publication vidéo Facebook: ${errorMessage}`);
      return {
        id: '',
        success: false,
        error: errorMessage,
      };
    }
  }

  async getPageInsights(pageId: string, period: string = 'day'): Promise<any> {
    try {
      if (!this.facebookApi) {
        throw new Error('API Facebook non configurée');
      }

      const response: any = await this.facebookApi.call(
        'GET',
        `/${pageId}/insights`,
        {
          metric: 'page_impressions,page_reach,page_engaged_users,page_video_views',
          period: period,
        }
      );

      return response.data;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Erreur lors de la récupération des insights Facebook: ${errorMessage}`);
      throw error;
    }
  }

  async getPostInsights(postId: string): Promise<any> {
    try {
      if (!this.facebookApi) {
        throw new Error('API Facebook non configurée');
      }

      const response: any = await this.facebookApi.call(
        'GET',
        `/${postId}/insights`,
        {
          metric: 'post_impressions,post_reach,post_engaged_users,post_video_views',
        }
      );

      return response.data;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Erreur lors de la récupération des insights de post: ${errorMessage}`);
      throw error;
    }
  }

  async schedulePost(
    pageId: string,
    options: FacebookPostOptions,
    scheduledTime: Date
  ): Promise<FacebookPostResult> {
    return this.publishPost(pageId, {
      ...options,
      scheduledTime,
    });
  }

  async deletePost(postId: string): Promise<boolean> {
    try {
      if (!this.facebookApi) {
        throw new Error('API Facebook non configurée');
      }

      const response: any = await this.facebookApi.call('DELETE', `/${postId}`);
      return !!response.id;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Erreur lors de la suppression du post: ${errorMessage}`);
      return false;
    }
  }

  private buildTargeting(audience: FacebookPostOptions['targetAudience']): any {
    const targeting: any = {};

    if (audience) {
      if (audience.ageMin || audience.ageMax) {
        targeting.age_min = audience.ageMin;
        targeting.age_max = audience.ageMax;
      }

      if (audience.genders && audience.genders.length > 0) {
        targeting.genders = audience.genders;
      }

      if (audience.countries && audience.countries.length > 0) {
        targeting.geo_locations = {
          countries: audience.countries,
        };
      }

      if (audience.interests && audience.interests.length > 0) {
        targeting.interests = audience.interests;
      }
    }

    return targeting;
  }

  async validateAccessToken(): Promise<boolean> {
    try {
      if (!this.facebookApi) {
        return false;
      }

      const response: any = await this.facebookApi.call('GET', '/me');
      return !!response.id;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Token d'accès Facebook invalide: ${errorMessage}`);
      return false;
    }
  }

  async getPageInfo(pageId: string): Promise<any> {
    try {
      if (!this.facebookApi) {
        throw new Error('API Facebook non configurée');
      }

      const response: any = await this.facebookApi.call(
        'GET',
        `/${pageId}`,
        {
          fields: 'id,name,about,fan_count,website,phone,emails',
        }
      );

      return response;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Erreur lors de la récupération des infos de page: ${errorMessage}`);
      throw error;
    }
  }
}



