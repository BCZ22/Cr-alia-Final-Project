// import { Injectable, Logger } from '@nestjs/common';
// import { PrismaService } from '../prisma/prisma.service';
// import * as prometheus from 'prom-client';
// import { SchedulerRegistry } from '@nestjs/schedule';

// @Injectable()
// export class AdvancedMonitoringService {
//   private readonly logger = new Logger(AdvancedMonitoringService.name);

//   private httpRequestDuration: prometheus.Histogram<string>;
//   private dbQueryDuration: prometheus.Histogram<string>;
//   private userRegistrations: prometheus.Counter<string>;
//   private contentGenerated: prometheus.Counter<string>;
//   private activeUsers: prometheus.Gauge<string>;
//   private errorRate: prometheus.Counter<string>;

//   constructor(
//     private prisma: PrismaService,
//     private schedulerRegistry: SchedulerRegistry,
//   ) {
//     this.initializeMetrics();
//     this.startMonitoringJobs();
//   }

//   private initializeMetrics() {
//     prometheus.collectDefaultMetrics();
    
//     this.httpRequestDuration = new prometheus.Histogram({
//       name: 'http_request_duration_seconds',
//       help: 'Duration of HTTP requests in seconds',
//       labelNames: ['method', 'route', 'status_code'],
//       buckets: [0.1, 0.5, 1, 1.5, 2, 5],
//     });

//     this.dbQueryDuration = new prometheus.Histogram({
//       name: 'db_query_duration_seconds',
//       help: 'Duration of database queries in seconds',
//       labelNames: ['query_type'],
//       buckets: [0.05, 0.1, 0.2, 0.5, 1],
//     });

//     this.userRegistrations = new prometheus.Counter({
//       name: 'user_registrations_total',
//       help: 'Total number of user registrations',
//       labelNames: ['provider'],
//     });

//     this.contentGenerated = new prometheus.Counter({
//       name: 'content_generated_total',
//       help: 'Total number of generated content pieces',
//       labelNames: ['type', 'is_premium'],
//     });
    
//     this.activeUsers = new prometheus.Gauge({
//       name: 'active_users',
//       help: 'Number of active users',
//       labelNames: ['time_window'],
//     });

//     this.errorRate = new prometheus.Counter({
//       name: 'error_rate_total',
//       help: 'Total number of errors',
//       labelNames: ['type'],
//     });
//   }

//   private startMonitoringJobs() {
//     // Tâche pour mettre à jour les utilisateurs actifs toutes les 5 minutes
//     const activeUsersJob = setInterval(() => this.updateActiveUsers(), 5 * 60 * 1000);
//     this.schedulerRegistry.addInterval('updateActiveUsers', activeUsersJob);

//     // Tâche pour vérifier les alertes toutes les minutes
//     const checkAlertsJob = setInterval(() => this.checkForAlerts(), 60 * 1000);
//     this.schedulerRegistry.addInterval('checkAlerts', checkAlertsJob);

//     // Tâche de nettoyage des vieilles métriques une fois par jour
//     const cleanupJob = setInterval(() => this.cleanupOldMetrics(), 24 * 60 * 60 * 1000);
//     this.schedulerRegistry.addInterval('cleanupOldMetrics', cleanupJob);
//   }
  
//   /**
//    * 📈 Exporte les métriques au format Prometheus
//    */
//   async getMetrics(): Promise<string> {
//     try {
//       // Collecter les métriques personnalisées avant de les retourner
//       await this.collectCustomMetrics();
//       return await prometheus.register.metrics();
//     } catch (error) {
//       this.logger.error(`Erreur lors de la collecte des métriques: ${error.message}`);
//       return '';
//     }
//   }

//   /**
//    * 📊 Collecte les métriques personnalisées
//    */
//   private async collectCustomMetrics() {
//     const [
//       totalCarouselTemplates,
//       totalCarousels
//     ] = await Promise.all([
//       this.prisma.carouselTemplate.count(),
//       this.prisma.carousel.count(),
//       this.updateActiveUsers(),
//       this.updateContentMetrics(),
//       this.updateExportMetrics()
//     ]);

//     // Exemples de métriques à collecter
//     // (ces métriques pourraient être définies comme des Gauge)
//   }

//   /**
//    * 🔄 Met à jour le nombre d'utilisateurs actifs
//    */
//   async updateActiveUsers() {
//     const now = new Date();
//     const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
//     const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

//     const activeLast24h = await this.prisma.user.count({
//       where: { lastLogin: { gte: last24h } },
//     });
//     const activeLast7d = await this.prisma.user.count({
//       where: { lastLogin: { gte: last7d } },
//     });

//     this.activeUsers.labels('24h').set(activeLast24h);
//     this.activeUsers.labels('7d').set(activeLast7d);
//   }

//   /**
//    * 📝 Met à jour les métriques de contenu
//    */
//   async updateContentMetrics() {
//     // Cette fonction pourrait être appelée périodiquement
//     // pour mettre à jour les compteurs de contenu généré.
//   }

//   /**
//    * 📤 Met à jour les métriques d'export
//    */
//   async updateExportMetrics() {
//     const exportStats = await this.prisma.exportJob.aggregate({
//       _count: {
//         status: true,
//       },
//       where: {
//         status: { in: ['completed', 'failed'] }
//       }
//     });

//     const completedExports = await this.prisma.exportJob.count({
//       where: { status: 'completed' }
//     });
//   }

//   /**
//    * 🩺 Génère un rapport de santé du système
//    */
//   async getHealthReport(): Promise<any> {
//     try {
//       const dbStatus = await this.prisma.$queryRaw`SELECT 1`;
//       const queueStatus = {}; // TODO: Obtenir le statut de la file d'attente
//       const redisStatus = {}; // TODO: Obtenir le statut de Redis
//       const metrics = this.getSystemMetrics();

//       return {
//         status: 'ok',
//         timestamp: new Date(),
//         dependencies: {
//           database: dbStatus ? 'ok' : 'error',
//           queue: queueStatus ? 'ok' : 'error',
//           redis: redisStatus ? 'ok' : 'error',
//         },
//         metrics,
//       };
//     } catch (error) {
//       this.logger.error(`Erreur lors de la génération du rapport de santé: ${error.message}`);
//       return {
//         status: 'error',
//         timestamp: new Date(),
//         error: error.message,
//       };
//     }
//   }

//   private getSystemMetrics() {
//     const memoryUsage = process.memoryUsage();
//     const cpuUsage = process.cpuUsage();
//     const uptime = process.uptime();
//     const avgResponseTime = this.httpRequestDuration.get().values.reduce((sum, val) => sum + val.value, 0) / this.httpRequestDuration.get().values.length;

//     return {
//       memoryUsage,
//       cpuUsage,
//       uptime,
//       avgResponseTime,
//       // ... autres métriques système
//     };
//   }

//   private analyzeMetricsForReport(metrics: prometheus.Gauge<string>) {
//     const completed = metrics.values.find(v => v.labels.status === 'completed')?.value || 0;
//     const failed = metrics.values.find(v => v.labels.status === 'failed')?.value || 0;
//     const total = completed + failed;
//     const successRate = total > 0 ? (completed / total) * 100 : 100;
//     return { completed, failed, total, successRate };
//   }

//   private analyzeCounterForReport(metrics: prometheus.Counter<string>) {
//     const total = metrics.values.reduce((sum, val) => sum + val.value, 0);
//     const premium = metrics.values.filter(v => v.labels.is_premium === 'true').reduce((sum, val) => sum + val.value, 0);
//     const premiumPercentage = total > 0 ? (premium / total) * 100 : 0;
//     return { total, premium, premiumPercentage };
//   }

//   /**
//    * 🚨 Vérifie les seuils d'alerte
//    */
//   async checkForAlerts() {
//     try {
//       // Exemple d'alerte : taux d'erreur élevé
//       const errorMetrics = this.errorRate.get();
//       const totalErrors = errorMetrics.values.reduce((sum, val) => sum + val.value, 0);
//       if (totalErrors > 100) { // Seuil
//         this.triggerAlert('high_error_rate', `Taux d'erreur élevé détecté: ${totalErrors} erreurs`, 'high');
//       }

//       // Exemple d'alerte : temps de réponse DB élevé
//       const dbMetrics = this.dbQueryDuration.get();
//       const avgDbQueryTime = dbMetrics.values.reduce((sum, val) => sum + val.value, 0) / dbMetrics.values.length;
//       if (avgDbQueryTime > 0.5) { // 500ms
//         this.triggerAlert('high_db_query_time', `Temps de réponse de la base de données élevé: ${avgDbQueryTime.toFixed(2)}s`, 'medium');
//       }

//       // ... autres alertes
//     } catch (error) {
//       this.logger.error(`Erreur lors de la vérification des alertes: ${error.message}`);
//     }
//   }

//   /**
//    * 📣 Déclenche une alerte
//    */
//   private triggerAlert(type: string, message: string, severity: 'low' | 'medium' | 'high') {
//     this.logger.warn(`ALERTE [${severity.toUpperCase()}] (${type}): ${message}`);
//     // Intégration avec un système d'alerte (ex: PagerDuty, Slack)
//   }

//   /**
//    * 🧹 Nettoie les anciennes métriques
//    */
//   async cleanupOldMetrics() {
//     try {
//       const cutoffDate = new Date();
//       cutoffDate.setDate(cutoffDate.getDate() - 30); // 30 jours

//       // Nettoyer les anciens jobs d'export
//       await this.prisma.exportJob.deleteMany({
//         where: {
//           createdAt: { lt: cutoffDate }
//         }
//       });
      
//       // ... autre logique de nettoyage
      
//       this.logger.log('Nettoyage des anciennes métriques terminé.');
//     } catch (error) {
//       this.logger.error(`Erreur lors du nettoyage des métriques: ${error.message}`);
//     }
//   }

//   // Méthodes pour incrémenter les compteurs
//   incrementUserRegistrations(provider: string) {
//     this.userRegistrations.labels(provider).inc();
//   }

//   incrementContentGenerated(type: string, isPremium: boolean) {
//     this.contentGenerated.labels(type, isPremium.toString()).inc();
//   }

//   incrementErrorRate(type: string) {
//     this.errorRate.labels(type).inc();
//   }
  
//   // Méthodes pour observer les durées
//   observeHttpRequest(method: string, route: string, statusCode: number, durationInSeconds: number) {
//     this.httpRequestDuration.labels(method, route, statusCode.toString()).observe(durationInSeconds);
//   }

//   observeDbQuery(queryType: string, durationInSeconds: number) {
//     this.dbQueryDuration.labels(queryType).observe(durationInSeconds);
//   }
// }



