/**
 * Instagram Service
 * Service de publication sur Instagram via Graph API
 */

import axios from 'axios';
import pino from 'pino';

const logger = pino({ name: 'instagram-service' });

const INSTAGRAM_API_URL = 'https://graph.facebook.com/v18.0';
const APP_ID = process.env.INSTAGRAM_APP_ID;
const APP_SECRET = process.env.INSTAGRAM_APP_SECRET;
const REDIRECT_URI = process.env.INSTAGRAM_REDIRECT_URI || 'http://localhost:3000/api/social/instagram/callback';

// ═══════════════════════════════════════════════════════════════════════════
// AUTHENTICATION
// ═══════════════════════════════════════════════════════════════════════════

export interface InstagramAuthResult {
  accessToken: string;
  userId: string;
  expiresIn: number;
}

export function getAuthorizationUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: APP_ID!,
    redirect_uri: REDIRECT_URI,
    scope: 'instagram_basic,instagram_content_publish',
    response_type: 'code',
    state
  });
  
  return `https://api.instagram.com/oauth/authorize?${params.toString()}`;
}

export async function exchangeCodeForToken(code: string): Promise<InstagramAuthResult> {
  logger.info({ code }, 'Exchanging code for access token');
  
  try {
    // Exchange code for short-lived token
    const response = await axios.post('https://api.instagram.com/oauth/access_token', {
      client_id: APP_ID,
      client_secret: APP_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: REDIRECT_URI,
      code
    });
    
    const { access_token, user_id } = response.data;
    
    // Exchange for long-lived token (60 days)
    const longLivedResponse = await axios.get(`${INSTAGRAM_API_URL}/access_token`, {
      params: {
        grant_type: 'ig_exchange_token',
        client_secret: APP_SECRET,
        access_token
      }
    });
    
    return {
      accessToken: longLivedResponse.data.access_token,
      userId: user_id,
      expiresIn: longLivedResponse.data.expires_in
    };
    
  } catch (error: any) {
    logger.error({ error: error.response?.data || error.message }, 'Failed to exchange code');
    throw new Error(`Instagram authentication failed: ${error.response?.data?.error_message || error.message}`);
  }
}

export async function refreshAccessToken(accessToken: string): Promise<InstagramAuthResult> {
  logger.info('Refreshing access token');
  
  try {
    const response = await axios.get(`${INSTAGRAM_API_URL}/refresh_access_token`, {
      params: {
        grant_type: 'ig_refresh_token',
        access_token: accessToken
      }
    });
    
    return {
      accessToken: response.data.access_token,
      userId: '', // Not returned on refresh
      expiresIn: response.data.expires_in
    };
    
  } catch (error: any) {
    logger.error({ error: error.response?.data }, 'Failed to refresh token');
    throw new Error('Token refresh failed');
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// REELS PUBLISHING
// ═══════════════════════════════════════════════════════════════════════════

export interface PublishReelOptions {
  videoUrl: string;
  caption: string;
  coverUrl?: string;
  shareToFeed?: boolean;
  locationId?: string;
  collaborators?: string[];
}

export interface PublishReelResult {
  id: string;
  permalink?: string;
  status: 'in_progress' | 'published' | 'error';
}

export async function publishReel(
  igUserId: string,
  accessToken: string,
  options: PublishReelOptions
): Promise<PublishReelResult> {
  logger.info({ igUserId, options }, 'Publishing reel to Instagram');
  
  try {
    // Step 1: Create media container
    const containerParams: any = {
      access_token: accessToken,
      media_type: 'REELS',
      video_url: options.videoUrl,
      caption: options.caption,
      share_to_feed: options.shareToFeed || false
    };
    
    if (options.coverUrl) {
      containerParams.cover_url = options.coverUrl;
    }
    
    if (options.locationId) {
      containerParams.location_id = options.locationId;
    }
    
    const containerResponse = await axios.post(
      `${INSTAGRAM_API_URL}/${igUserId}/media`,
      null,
      { params: containerParams }
    );
    
    const creationId = containerResponse.data.id;
    logger.info({ creationId }, 'Media container created');
    
    // Step 2: Check status (polling)
    let status = 'IN_PROGRESS';
    let attempts = 0;
    const maxAttempts = 20;
    
    while (status === 'IN_PROGRESS' && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      
      const statusResponse = await axios.get(
        `${INSTAGRAM_API_URL}/${creationId}`,
        {
          params: {
            access_token: accessToken,
            fields: 'status_code'
          }
        }
      );
      
      status = statusResponse.data.status_code;
      attempts++;
      
      logger.debug({ creationId, status, attempts }, 'Checking upload status');
    }
    
    if (status !== 'FINISHED') {
      throw new Error(`Upload failed with status: ${status}`);
    }
    
    // Step 3: Publish
    const publishResponse = await axios.post(
      `${INSTAGRAM_API_URL}/${igUserId}/media_publish`,
      null,
      {
        params: {
          access_token: accessToken,
          creation_id: creationId
        }
      }
    );
    
    const mediaId = publishResponse.data.id;
    logger.info({ mediaId }, 'Reel published successfully');
    
    // Step 4: Get permalink
    const mediaResponse = await axios.get(
      `${INSTAGRAM_API_URL}/${mediaId}`,
      {
        params: {
          access_token: accessToken,
          fields: 'permalink'
        }
      }
    );
    
    return {
      id: mediaId,
      permalink: mediaResponse.data.permalink,
      status: 'published'
    };
    
  } catch (error: any) {
    logger.error({ error: error.response?.data || error.message }, 'Failed to publish reel');
    throw new Error(`Instagram publish failed: ${error.response?.data?.error?.message || error.message}`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// ACCOUNT MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════

export interface InstagramAccount {
  id: string;
  username: string;
  accountType: string;
  mediaCount: number;
}

export async function getAccountInfo(igUserId: string, accessToken: string): Promise<InstagramAccount> {
  try {
    const response = await axios.get(
      `${INSTAGRAM_API_URL}/${igUserId}`,
      {
        params: {
          access_token: accessToken,
          fields: 'id,username,account_type,media_count'
        }
      }
    );
    
    return {
      id: response.data.id,
      username: response.data.username,
      accountType: response.data.account_type,
      mediaCount: response.data.media_count
    };
    
  } catch (error: any) {
    logger.error({ error: error.response?.data }, 'Failed to get account info');
    throw error;
  }
}

export interface InstagramMetrics {
  followerCount: number;
  followsCount: number;
  mediaCount: number;
  impressions?: number;
  reach?: number;
}

export async function getAccountMetrics(igUserId: string, accessToken: string): Promise<InstagramMetrics> {
  try {
    const response = await axios.get(
      `${INSTAGRAM_API_URL}/${igUserId}`,
      {
        params: {
          access_token: accessToken,
          fields: 'followers_count,follows_count,media_count'
        }
      }
    );
    
    return {
      followerCount: response.data.followers_count,
      followsCount: response.data.follows_count,
      mediaCount: response.data.media_count
    };
    
  } catch (error: any) {
    logger.error({ error: error.response?.data }, 'Failed to get metrics');
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export default {
  getAuthorizationUrl,
  exchangeCodeForToken,
  refreshAccessToken,
  publishReel,
  getAccountInfo,
  getAccountMetrics
};
