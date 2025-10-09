// import { PrismaService } from '../prisma/prisma.service';
// import { z } from 'zod';
// import { 
//   User, 
//   Project, 
//   Comment, 
//   Version, 
//   ProjectCollaboration,
//   Notification,
//   NotificationType,
//   NotificationPriority,
//   LiveSession
// } from '@prisma/client';
// import { RealTimeService } from '../real-time/real-time.service';

// // Schémas de validation
// const CommentSchema = z.object({
//   id: z.string(),
//   content: z.string(),
//   userId: z.string(),
//   projectId: z.string(),
//   parentId: z.string().optional(),
//   createdAt: z.date(),
//   updatedAt: z.date(),
// });

// const VersionSchema = z.object({
//   id: z.string(),
//   projectId: z.string(),
//   userId: z.string(),
//   data: z.record(z.any()),
//   message: z.string().optional(),
//   createdAt: z.date(),
// });

// const CollaborationSchema = z.object({
//   id: z.string(),
//   projectId: z.string(),
//   userId: z.string(),
//   role: z.enum(['owner', 'editor', 'viewer', 'commenter']),
// });

// const NotificationSchema = z.object({
//   id: z.string(),
//   userId: z.string(),
//   type: z.nativeEnum(NotificationType),
//   title: z.string(),
//   message: z.string(),
//   isRead: z.boolean(),
//   priority: z.nativeEnum(NotificationPriority),
//   createdAt: z.date(),
//   actionUrl: z.string().url().optional(),
// });

// export type CommentType = z.infer<typeof CommentSchema>;
// export type VersionType = z.infer<typeof VersionSchema>;
// export type CollaborationType = z.infer<typeof CollaborationSchema>;
// export type NotificationType = z.infer<typeof NotificationSchema>;

// export class CollaborationService {
//   constructor(
//     private prisma: PrismaService,
//     private realTimeService: RealTimeService
//   ) {}

//   // =============================================================================
//   // Gestion des collaborateurs
//   // =============================================================================

//   async addCollaborator(projectId: string, userId: string, role: 'owner' | 'editor' | 'viewer' | 'commenter'): Promise<ProjectCollaboration> {
//     const collaboration = await this.prisma.projectCollaboration.create({
//       data: { projectId, userId, role },
//     });
//     this.realTimeService.emitToProject(projectId, 'collaborator:added', collaboration);
//     await this.createNotification({
//       userId: userId,
//       type: 'INVITATION',
//       title: 'Nouvelle collaboration',
//       message: `Vous avez été ajouté au projet.`,
//       priority: 'MEDIUM',
//     });
//     return collaboration;
//   }

//   async removeCollaborator(projectId: string, userId: string): Promise<void> {
//     await this.prisma.projectCollaboration.delete({
//       where: { projectId_userId: { projectId, userId } },
//     });
//     this.realTimeService.emitToProject(projectId, 'collaborator:removed', { userId });
//   }

//   async updateCollaboratorRole(projectId: string, userId: string, role: 'owner' | 'editor' | 'viewer' | 'commenter'): Promise<ProjectCollaboration> {
//     const collaboration = await this.prisma.projectCollaboration.update({
//       where: { projectId_userId: { projectId, userId } },
//       data: { role },
//     });
//     this.realTimeService.emitToProject(projectId, 'collaborator:updated', collaboration);
//     return collaboration;
//   }

//   async getCollaborators(projectId: string): Promise<ProjectCollaboration[]> {
//     return this.prisma.projectCollaboration.findMany({ where: { projectId } });
//   }

//   // =============================================================================
//   // Gestion des commentaires
//   // =============================================================================

//   async addComment(projectId: string, userId: string, content: string, parentId?: string): Promise<Comment> {
//     const comment = await this.prisma.comment.create({
//       data: {
//         projectId,
//         userId,
//         content,
//         parentId,
//       },
//     });
//     this.realTimeService.emitToProject(projectId, 'comment:added', comment);
    
//     // Notifier les autres collaborateurs
//     const collaborators = await this.getCollaborators(projectId);
//     for (const collaborator of collaborators) {
//       if (collaborator.userId !== userId) {
//         await this.createNotification({
//           userId: collaborator.userId,
//           type: 'COMMENT',
//           title: 'Nouveau commentaire',
//           message: `Un nouveau commentaire a été ajouté au projet.`,
//           priority: 'LOW',
//           actionUrl: `/projects/${projectId}?comment=${comment.id}`,
//         });
//       }
//     }
    
//     return comment;
//   }

//   async getComments(projectId: string): Promise<Comment[]> {
//     return this.prisma.comment.findMany({
//       where: { projectId },
//       orderBy: { createdAt: 'asc' },
//     });
//   }

//   async updateComment(commentId: string, content: string): Promise<Comment> {
//     const comment = await this.prisma.comment.update({
//       where: { id: commentId },
//       data: { content },
//     });
//     this.realTimeService.emitToProject(comment.projectId, 'comment:updated', comment);
//     return comment;
//   }

//   async deleteComment(commentId: string): Promise<void> {
//     const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });
//     if (comment) {
//       await this.prisma.comment.delete({ where: { id: commentId } });
//       this.realTimeService.emitToProject(comment.projectId, 'comment:deleted', { commentId });
//     }
//   }

//   // =============================================================================
//   // Gestion des versions
//   // =============================================================================

//   async createVersion(projectId: string, userId: string, data: any, message?: string): Promise<Version> {
//     const version = await this.prisma.version.create({
//       data: {
//         projectId,
//         userId,
//         data,
//         message,
//       },
//     });
//     this.realTimeService.emitToProject(projectId, 'version:created', version);
//     return version;
//   }

//   async getVersions(projectId: string): Promise<Version[]> {
//     return this.prisma.version.findMany({
//       where: { projectId },
//       orderBy: { createdAt: 'desc' },
//     });
//   }

//   async restoreVersion(versionId: string): Promise<Project> {
//     const version = await this.prisma.version.findUnique({
//       where: { id: versionId },
//     });

//     if (!version) {
//       throw new Error('Version not found');
//     }

//     const project = await this.prisma.project.update({
//       where: { id: version.projectId },
//       data: {
//         // Logique de restauration des données du projet
//         // Par exemple: data: version.data
//       },
//     });
    
//     this.realTimeService.emitToProject(project.id, 'project:restored', { versionId });
    
//     return project;
//   }

//   // =============================================================================
//   // Sessions collaboratives en temps réel (Live Sessions)
//   // =============================================================================

//   async startLiveSession(projectId: string, userId: string): Promise<LiveSession> {
//     let session = await this.prisma.liveSession.findUnique({ where: { projectId } });

//     if (session) {
//       // Si une session existe, ajouter l'utilisateur s'il n'y est pas déjà
//       if (!session.participants.includes(userId)) {
//         session = await this.prisma.liveSession.update({
//           where: { projectId },
//           data: { participants: { push: userId } },
//         });
//       }
//     } else {
//       // Créer une nouvelle session
//       session = await this.prisma.liveSession.create({
//         data: {
//           projectId,
//           participants: [userId],
//           data: {}, // Initial data
//         },
//       });
//     }

//     this.realTimeService.emitToProject(projectId, 'session:started', session);
//     this.realTimeService.joinProject(userId, projectId);
    
//     return session;
//   }

//   async endLiveSession(projectId: string): Promise<void> {
//     await this.prisma.liveSession.delete({ where: { projectId } });
//     this.realTimeService.emitToProject(projectId, 'session:ended', {});
//   }

//   async updateLiveSessionData(projectId: string, data: any): Promise<void> {
//     await this.prisma.liveSession.update({
//       where: { projectId },
//       data: { data },
//     });
//     this.realTimeService.emitToProject(projectId, 'session:data_updated', data);
//   }
  
//   async leaveLiveSession(projectId: string, userId: string): Promise<void> {
//     const session = await this.prisma.liveSession.findUnique({ where: { projectId } });
    
//     if (session) {
//       const participants = session.participants.filter(id => id !== userId);
//       await this.prisma.liveSession.update({
//         where: { projectId },
//         data: { participants },
//       });
//       this.realTimeService.emitToProject(projectId, 'session:participant_left', { userId });
//       this.realTimeService.leaveProject(userId, projectId);
//     }
//   }
  
//   // =============================================================================
//   // Notifications
//   // =============================================================================
  
//   async createNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>): Promise<NotificationType> {
//     const newNotification = await this.prisma.notification.create({
//       data: {
//         userId: notification.userId,
//         type: notification.type,
//         title: notification.title,
//         message: notification.message,
//         priority: notification.priority || 'MEDIUM',
//         actionUrl: notification.actionUrl,
//       },
//     });
    
//     this.realTimeService.emitToUser(notification.userId, 'notification:new', {
//       id: newNotification.id,
//       type: newNotification.type,
//       title: newNotification.title,
//       message: newNotification.message,
//       isRead: newNotification.isRead,
//       priority: newNotification.priority,
//       createdAt: newNotification.createdAt,
//       actionUrl: newNotification.actionUrl || undefined,
//     });
    
//     return newNotification;
//   }
  
//   async getUserNotifications(userId: string): Promise<NotificationType[]> {
//     const notifications = await this.prisma.notification.findMany({
//       where: { userId },
//       orderBy: { createdAt: 'desc' },
//     });
    
//     return notifications.map(notification => ({
//       id: notification.id,
//       userId: notification.userId,
//       type: notification.type,
//       title: notification.title,
//       message: notification.message,
//       isRead: notification.isRead,
//       priority: notification.priority,
//       createdAt: notification.createdAt,
//       actionUrl: notification.actionUrl || undefined,
//     }));
//   }
  
//   async markNotificationsAsRead(userId: string, notificationIds: string[]): Promise<void> {
//     await this.prisma.notification.updateMany({
//       where: {
//         id: { in: notificationIds },
//         userId: userId,
//       },
//       data: { isRead: true },
//     });
//     this.realTimeService.emitToUser(userId, 'notification:marked_as_read', { notificationIds });
//   }
// }
