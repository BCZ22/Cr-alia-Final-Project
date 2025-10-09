// import { PrismaService } from '../prisma/prisma.service';
// import { z } from 'zod';
// import { User, Project } from '@prisma/client';

// // Schémas de validation
// const AuditLogSchema = z.object({
//   id: z.string(),
//   userId: z.string(),
//   action: z.string(),
//   entity: z.string(),
//   entityId: z.string(),
//   timestamp: z.date(),
//   details: z.record(z.any()).optional(),
//   ipAddress: z.string().optional(),
// });

// const SecurityAlertSchema = z.object({
//   id: z.string(),
//   type: z.string(),
//   message: z.string(),
//   priority: z.enum(['low', 'medium', 'high', 'critical']),
//   timestamp: z.date(),
//   resolved: z.boolean(),
//   details: z.record(z.any()).optional(),
// });

// export type AuditLog = z.infer<typeof AuditLogSchema>;
// export type SecurityAlert = z.infer<typeof SecurityAlertSchema>;

// export class AuditService {
//   constructor(private prisma: PrismaService) {}

//   /**
//    * ✍️ Enregistre un événement d'audit
//    */
//   async log(
//     userId: string,
//     action: string,
//     entity: string,
//     entityId: string,
//     details?: Record<string, any>,
//     ipAddress?: string
//   ): Promise<AuditLog> {
//     try {
//       const logEntry = await this.prisma.auditLog.create({
//         data: {
//           userId,
//           action,
//           entity,
//           entityId,
//           details: details ? JSON.stringify(details) : null,
//           ipAddress,
//         },
//       });
      
//       // Déclencher une analyse de sécurité en arrière-plan
//       this.analyzeSecurity(logEntry);

//       return {
//         ...logEntry,
//         details: logEntry.details ? JSON.parse(logEntry.details as string) : undefined,
//       };
//     } catch (error) {
//       console.error("Erreur lors de l'enregistrement de l'audit:", error);
//       throw new Error("Impossible d'enregistrer l'événement d'audit");
//     }
//   }

//   /**
//    * 🛡️ Analyse un événement d'audit pour détecter des menaces potentielles
//    */
//   private async analyzeSecurity(log: AuditLog): Promise<void> {
//     try {
//       // Exemples de règles de détection simples
//       if (log.action.includes('delete') && log.entity === 'Project') {
//         await this.checkForMassDeletion(log.userId, log.timestamp);
//       }

//       if (log.action.includes('login') && log.details?.status === 'failed') {
//         await this.checkForBruteForce(log.userId, log.ipAddress, log.timestamp);
//       }
      
//       if (log.action.includes('update') && log.entity === 'UserRole') {
//         await this.checkForPrivilegeEscalation(log);
//       }
      
//       if (log.action.includes('read') && log.entity === 'Project' && log.details?.sensitive) {
//         await this.checkForDataAccessAnomalies(log.userId, log.timestamp);
//       }
      
//     } catch (error) {
//       console.error("Erreur lors de l'analyse de sécurité:", error);
//     }
//   }

//   /**
//    * 🔐 Vérifie si un utilisateur a le droit d'effectuer une action
//    */
//   async can(userId: string, action: string, entity: string, entityId: string): Promise<boolean> {
//     try {
//       // Implémenter la logique de permissions (ex: RBAC)
//       // Exemple simple : vérifier si l'utilisateur est collaborateur sur un projet
//       if (entity === 'Project') {
//         const canAccess = await this.prisma.projectCollaboration.findFirst({
//           where: {
//             projectId: entityId,
//             userId: userId,
//             // Vérifier si le rôle autorise l'action (simplifié ici)
//             role: { in: ['owner', 'editor'] },
//           },
//         });
//         return !!canAccess;
//       }
      
//       // Logique par défaut
//       return true;
      
//     } catch (error) {
//       console.error("Erreur lors de la vérification des permissions:", error);
//       return false;
//     }
//   }

//   /**
//    * 🚨 Détecte les tentatives de suppression massive
//    */
//   private async checkForMassDeletion(userId: string, timestamp: Date): Promise<void> {
//     const timeframe = new Date(timestamp.getTime() - 60000); // 1 minute
//     const deletionCount = await this.prisma.auditLog.count({
//       where: {
//         userId,
//         action: { contains: 'delete' },
//         timestamp: { gte: timeframe },
//       },
//     });

//     if (deletionCount > 5) { // Seuil
//       await this.createAlert(
//         'mass_deletion_attempt',
//         `Tentative de suppression massive détectée pour l'utilisateur ${userId}`,
//         'high',
//         { userId, count: deletionCount }
//       );
//     }
//   }
  
//   /**
//    * 🛡️ Détecte les tentatives de force brute
//    */
//   private async checkForBruteForce(userId: string, ipAddress: string, timestamp: Date): Promise<void> {
//     const timeframe = new Date(timestamp.getTime() - 5 * 60000); // 5 minutes
//     const failedLogins = await this.prisma.auditLog.count({
//       where: {
//         userId,
//         ipAddress,
//         action: 'login',
//         details: { path: ['status'], string_contains: 'failed' },
//         timestamp: { gte: timeframe },
//       },
//     });

//     if (failedLogins > 10) { // Seuil
//       await this.createAlert(
//         'brute_force_attempt',
//         `Tentative de force brute détectée pour l'utilisateur ${userId} depuis l'IP ${ipAddress}`,
//         'critical',
//         { userId, ipAddress, count: failedLogins }
//       );
//       // Optionnel: bloquer l'IP ou le compte utilisateur
//     }
//   }

//   /**
//    * 📈 Détecte les tentatives d'escalade de privilèges
//    */
//   private async checkForPrivilegeEscalation(log: AuditLog): Promise<void> {
//     const user = await this.prisma.user.findUnique({ where: { id: log.userId } });
//     const targetUser = await this.prisma.user.findUnique({ where: { id: log.entityId } });

//     if (user.role !== 'admin' && log.details?.newRole === 'admin') {
//       await this.createAlert(
//         'privilege_escalation',
//         `Tentative d'escalade de privilèges de ${user.email} vers ${targetUser.email}`,
//         'critical',
//         { sourceUserId: user.id, targetUserId: targetUser.id }
//       );
//     }
//   }

//   /**
//    * 📂 Détecte les anomalies d'accès aux données
//    */
//   private async checkForDataAccessAnomalies(userId: string, timestamp: Date): Promise<void> {
//     const timeframe = new Date(timestamp.getTime() - 10 * 60000); // 10 minutes
//     const recentDataAccess = await this.prisma.auditLog.count({
//       where: {
//         userId,
//         action: 'read',
//         details: { path: ['sensitive'], equals: true },
//         timestamp: { gte: timeframe },
//       },
//     });

//     if (recentDataAccess > 20) { // Seuil
//       await this.createAlert(
//         'data_access_anomaly',
//         `Anomalie d'accès aux données sensibles détectée pour l'utilisateur ${userId}`,
//         'medium',
//         { userId, count: recentDataAccess }
//       );
//     }
//   }

//   /**
//    * 🚨 Crée une alerte de sécurité
//    */
//   async createAlert(
//     type: string,
//     message: string,
//     priority: 'low' | 'medium' | 'high' | 'critical',
//     details?: Record<string, any>
//   ): Promise<SecurityAlert> {
//     const alert = await this.prisma.securityAlert.create({
//       data: {
//         type,
//         message,
//         priority,
//         details: details ? JSON.stringify(details) : null,
//       },
//     });
    
//     // Envoyer une notification (ex: email, Slack)
//     // this.sendNotification(alert);
    
//     return {
//       ...alert,
//       details: alert.details ? JSON.parse(alert.details as string) : undefined,
//     };
//   }
  
//   /**
//    * ✅ Résout une alerte de sécurité
//    */
//   async resolveAlerts(alertIds: string[]): Promise<void> {
//     await this.prisma.securityAlert.updateMany({
//       where: { id: { in: alertIds } },
//       data: { resolved: true },
//     });
//   }

//   /**
//    * 📊 Récupère les journaux d'audit avec pagination et filtres
//    */
//   async getAuditLogs(
//     page: number = 1,
//     limit: number = 20,
//     filters?: { userId?: string; action?: string; entity?: string }
//   ): Promise<AuditLog[]> {
//     const logs = await this.prisma.auditLog.findMany({
//       skip: (page - 1) * limit,
//       take: limit,
//       where: filters,
//       orderBy: { timestamp: 'desc' },
//     });
//     return logs.map(log => ({
//       ...log,
//       details: log.details ? JSON.parse(log.details as string) : undefined,
//     }));
//   }

//   /**
//    * 📈 Génère un rapport de sécurité
//    */
//   async generateSecurityReport(dateRange: { start: Date; end: Date }): Promise<any> {
//     const totalEvents = await this.prisma.auditLog.count({
//       where: { timestamp: { gte: dateRange.start, lte: dateRange.end } },
//     });

//     const suspiciousEvents = await this.prisma.auditLog.count({
//       where: {
//         timestamp: { gte: dateRange.start, lte: dateRange.end },
//         // Logique pour identifier les événements suspects
//       },
//     });
    
//     const blockedActions = await this.prisma.auditLog.count({
//       where: {
//         action: 'blocked',
//         timestamp: { gte: dateRange.start, lte: dateRange.end },
//       },
//     });

//     const permissionViolations = await this.prisma.auditLog.count({
//       where: {
//         action: 'permission_denied',
//         timestamp: { gte: dateRange.start, lte: dateRange.end },
//       },
//     });

//     const dataAccess = await this.prisma.auditLog.count({
//       where: {
//         action: 'read',
//         details: { path: ['sensitive'], equals: true },
//         timestamp: { gte: dateRange.start, lte: dateRange.end },
//       },
//     });

//     return {
//       period: dateRange,
//       totalEvents,
//       suspiciousEvents,
//       blockedActions,
//       permissionViolations,
//       dataAccessAnomalies: dataAccess,
//     };
//   }
// }
