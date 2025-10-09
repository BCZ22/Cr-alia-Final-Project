# Feature ↔ Endpoint Mapping Table

This table maps frontend features to backend endpoints, validates their contracts, and tracks their integration readiness.

| Feature ID | Feature Description | Frontend Caller | Endpoint Expected (METHOD Path) | Backend Found? | Contract Match? (Static) | Runtime Test | Severity | Notes & Action Recommended |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Social Accounts** |
| SA-01 | Get all social accounts for a user | `components/social-accounts/SocialAccountManager.tsx:141` | `GET /api/social-accounts` | Yes (`/app/api/social-accounts/route.ts`) | ✅ Match | 🟡 Static Analysis Only | Info | The contract seems correct. The backend returns an object `{ accounts: [] }`. |
| SA-02 | Connect a social account | `components/social-accounts/SocialAccountManager.tsx:158` | `GET /api/oauth/:platform/authorize` | Yes (`/app.old/api/oauth/[platform]/authorize/route.ts`) | ✅ Match | 🟡 Static Analysis Only | Info | The backend expects `userId`, `accountType`, `permissions`, and `role` as query parameters and returns an `{ authUrl: string }` object. This matches the frontend implementation. |
| SA-03 | Disconnect a social account | `components/social-accounts/SocialAccountManager.tsx:175` | `DELETE /api/social-accounts` | Yes (`/app/api/social-accounts/route.ts`) | ✅ Match | 🟡 Static Analysis Only | Info | The contract seems correct. The backend expects `accountId` and `userId` as query params. |
| SA-04 | Refresh an expired token | `components/social-accounts/SocialAccountManager.tsx:191` | `POST /api/social-accounts/refresh` | Yes (`/app.old/api/social-accounts/refresh/route.ts`) | ✅ Match | 🟡 Static Analysis Only | Medium | Backend expects `{ accountId: string }` in the body. Frontend sends this. Backend returns `{ message, accessToken, refreshToken }`. |
| **Social Analytics** |
| SAN-01 | Extract performance data | `components/social-analytics/SocialAnalyticsDashboard.tsx:167` | `POST /api/social-analytics/extract` | Yes (`/app.old/api/social-analytics/extract/route.ts`) | ⚠️ Mismatch | 🟡 Static Analysis Only | High | **Payload Mismatch**: Frontend sends `{ userId, platform }`. Backend expects `{ userId, platform, dateRange }`. The `dateRange` is missing from the frontend call. The UI should be updated to include a date range selector. |
| SAN-02 | Analyze content trends | `components/social-analytics/SocialAnalyticsDashboard.tsx:193` | `POST /api/social-analytics/trends` | Yes (`/app.old/api/social-analytics/trends/route.ts`) | ✅ Match | 🟡 Static Analysis Only | High | The contract seems correct. Backend expects `{ userId, platform }`. |
| SAN-03 | Generate strategic recommendations | `components/social-analytics/SocialAnalyticsDashboard.tsx:219` | `POST /api/social-analytics/recommendations` | Yes (`/app.old/api/social-analytics/recommendations/route.ts`) | ✅ Match | 🟡 Static Analysis Only | High | The contract seems correct. Backend expects `{ userId, objective, platform }`. |
