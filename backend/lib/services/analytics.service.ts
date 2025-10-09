// import { PrismaService } from './prisma.service';
// import { subDays, startOfDay, endOfDay } from 'date-fns';

// export class AnalyticsService {
//   constructor(private prisma: PrismaService) {}

//   async getDashboardAnalytics(userId: string) {
//     const projects = await this.prisma.project.count({ where: { userId } });
//     const contents = await this.prisma.content.count({ where: { project: { userId } } });
//     const recentContents = await this.prisma.content.count({
//       where: {
//         project: { userId },
//         createdAt: { gte: subDays(new Date(), 30) },
//       },
//     });

//     return {
//       projects,
//       contents,
//       recentContents,
//     };
//   }

//   async getContentAnalytics(contentId: string) {
//     const content = await this.prisma.content.findUnique({
//       where: { id: contentId },
//       include: {
//         analytics: true,
//       },
//     });

//     return content?.analytics;
//   }

//   async getProjectAnalytics(projectId: string) {
//     const project = await this.prisma.project.findUnique({
//       where: { id: projectId },
//       include: {
//         contents: {
//           include: {
//             analytics: true,
//           },
//         },
//       },
//     });

//     if (!project) return null;

//     const totalViews = project.contents.reduce((sum, content) => sum + (content.analytics?.views || 0), 0);
//     const totalLikes = project.contents.reduce((sum, content) => sum + (content.analytics?.likes || 0), 0);
//     const totalShares = project.contents.reduce((sum, content) => sum + (content.analytics?.shares || 0), 0);

//     return {
//       totalViews,
//       totalLikes,
//       totalShares,
//       contentCount: project.contents.length,
//     };
//   }

//   async getAdvancedAnalytics(userId: string, period: '7d' | '30d' | '90d') {
//     const endDate = endOfDay(new Date());
//     const startDate = startOfDay(subDays(endDate, parseInt(period)));

//     const [content, social, audience] = await Promise.all([
//       this.getContentPerformance(userId, startDate, endDate),
//       this.getSocialPerformance(userId, startDate, endDate),
//       this.getAudienceGrowth(userId, startDate, endDate),
//     ]);

//     return { content, social, audience };
//   }

//   private async getContentPerformance(userId: string, startDate: Date, endDate: Date) {
//     const topContents = await this.prisma.content.findMany({
//       where: {
//         project: { userId },
//         createdAt: { gte: startDate, lte: endDate },
//       },
//       orderBy: { analytics: { views: 'desc' } },
//       take: 5,
//       include: { analytics: true },
//     });

//     const performanceOverTime = await this.prisma.contentAnalytics.groupBy({
//       by: ['createdAt'],
//       where: {
//         content: {
//           project: { userId },
//         },
//         createdAt: { gte: startDate, lte: endDate },
//       },
//       _sum: {
//         views: true,
//         likes: true,
//       },
//     });

//     return { topContents, performanceOverTime };
//   }

//   private async getSocialPerformance(userId: string, startDate: Date, endDate: Date) {
//     const engagementByPlatform = await this.prisma.socialPost.groupBy({
//       by: ['platform'],
//       where: {
//         userId,
//         postedAt: { gte: startDate, lte: endDate },
//       },
//       _sum: {
//         likes: true,
//         comments: true,
//         shares: true,
//       },
//     });

//     return { engagementByPlatform };
//   }

//   private async getAudienceGrowth(userId: string, startDate: Date, endDate: Date) {
//     const audienceGrowth = await this.prisma.audienceMetric.findMany({
//       where: {
//         userId,
//         date: { gte: startDate, lte: endDate },
//       },
//       orderBy: {
//         date: 'asc',
//       },
//     });

//     return { audienceGrowth };
//   }

//   async getAIAssistantInsights(userId: string) {
//     // Simulating AI analysis
//     const { content } = await this.getAdvancedAnalytics(userId, '30d');
//     const insights = [];

//     if (content.topContents.length > 0) {
//       const bestContent = content.topContents[0];
//       insights.push({
//         type: 'highlight',
//         message: `Your content "${bestContent.title}" is performing exceptionally well with ${bestContent.analytics.views} views.`,
//         recommendation: 'Consider creating similar content to engage your audience further.',
//       });
//     }

//     const recentPerformance = content.performanceOverTime.slice(-7);
//     const recentViews = recentPerformance.reduce((sum, day) => sum + (day._sum.views || 0), 0);
//     if (recentViews < 100) {
//       insights.push({
//         type: 'alert',
//         message: `Your content views have been low in the past week (${recentViews} views).`,
//         recommendation: 'Try promoting your content on different platforms or experiment with new topics.',
//       });
//     }

//     return insights;
//   }
// }