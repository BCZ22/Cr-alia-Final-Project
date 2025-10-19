/**
 * Discord Integration
 * Utilities for Discord community integration
 */

export interface DiscordConfig {
  botToken?: string
  guildId?: string
  inviteUrl: string
}

/**
 * Get Discord configuration from environment
 */
export function getDiscordConfig(): DiscordConfig {
  return {
    botToken: process.env.DISCORD_BOT_TOKEN,
    guildId: process.env.DISCORD_GUILD_ID,
    inviteUrl: process.env.NEXT_PUBLIC_DISCORD_INVITE_URL || 'https://discord.gg/crealia',
  }
}

/**
 * Check if Discord integration is enabled
 */
export function isDiscordEnabled(): boolean {
  const config = getDiscordConfig()
  return !!config.botToken && !!config.guildId
}

/**
 * Generate Discord invite link
 */
export function getDiscordInviteLink(): string {
  const config = getDiscordConfig()
  return config.inviteUrl
}

/**
 * Future: Create Discord invite via bot API
 * This would require discord.js and bot permissions
 */
export async function createDiscordInvite(userId: string): Promise<string> {
  // For now, return static invite URL
  // In future, this could create user-specific invites via Discord API
  return getDiscordInviteLink()
}

