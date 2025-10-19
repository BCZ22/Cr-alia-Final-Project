/**
 * GDPR Consent Management
 * Track and manage user consent
 */

import { prisma } from '@/lib/db/client'

export type ConsentType = 'necessary' | 'analytics' | 'marketing' | 'preferences'

export interface ConsentPreferences {
  necessary: boolean // Always true (required)
  analytics: boolean
  marketing: boolean
  preferences: boolean
}

/**
 * Get user consent preferences
 */
export async function getUserConsent(userId: string): Promise<ConsentPreferences | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { consentData: true },
    })

    if (!user || !user.consentData) {
      return null
    }

    return user.consentData as ConsentPreferences
  } catch (error) {
    console.error('Failed to get user consent:', error)
    return null
  }
}

/**
 * Update user consent preferences
 */
export async function updateUserConsent(
  userId: string,
  preferences: Partial<ConsentPreferences>
): Promise<void> {
  try {
    // Get current consent
    const current = await getUserConsent(userId)

    // Merge with new preferences (necessary always true)
    const updated: ConsentPreferences = {
      necessary: true,
      analytics: preferences.analytics ?? current?.analytics ?? false,
      marketing: preferences.marketing ?? current?.marketing ?? false,
      preferences: preferences.preferences ?? current?.preferences ?? false,
    }

    // Update in database
    await prisma.user.update({
      where: { id: userId },
      data: {
        consentData: updated,
        consentDate: new Date(),
      },
    })
  } catch (error) {
    console.error('Failed to update user consent:', error)
    throw new Error('Failed to update consent preferences')
  }
}

/**
 * Check if user has given consent for specific type
 */
export async function hasConsent(userId: string, type: ConsentType): Promise<boolean> {
  const consent = await getUserConsent(userId)

  if (!consent) {
    // No consent recorded - only necessary cookies allowed
    return type === 'necessary'
  }

  return consent[type] === true
}

/**
 * Record consent withdrawal
 */
export async function withdrawConsent(userId: string, types: ConsentType[]): Promise<void> {
  const current = await getUserConsent(userId)

  if (!current) return

  const updated: ConsentPreferences = { ...current }

  for (const type of types) {
    if (type !== 'necessary') {
      updated[type] = false
    }
  }

  await updateUserConsent(userId, updated)
}

