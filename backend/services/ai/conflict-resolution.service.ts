// import { PrismaService } from '../prisma/prisma.service';
// import { z } from 'zod';
// import { Conflict, ResolutionStrategy, MergeStrategy } from '@prisma/client';
// import { OpenAIService } from '../ai/openai.service';
// import { diff_match_patch as DiffMatchPatch } from 'diff-match-patch';

// const ConflictSchema = z.object({
//   id: z.string(),
//   projectId: z.string(),
//   type: z.string(),
//   elementId: z.string(),
//   baseVersion: z.number(),
//   user1Changes: z.record(z.any()),
//   user2Changes: z.record(z.any()),
//   isResolved: z.boolean(),
//   resolution: z.string().optional(),
//   resolvedBy: z.string().optional(),
//   resolvedAt: z.date().optional(),
// });

// export type ConflictType = z.infer<typeof ConflictSchema>;

// export class ConflictResolutionService {
//   private dmp: DiffMatchPatch;

//   constructor(
//     private prisma: PrismaService,
//     private aiService: OpenAIService
//   ) {
//     this.dmp = new DiffMatchPatch();
//   }

//   /**
//    * 
//    * @param projectId ID du projet
//    * @param elementId ID de l'élément (clip, piste, etc.)
//    * @param baseVersion Version de base commune
//    * @param user1Changes Modifications de l'utilisateur 1
//    * @param user2Changes Modifications de l'utilisateur 2
//    * @returns Le conflit créé
//    */
//   async createConflict(
//     projectId: string,
//     type: string,
//     elementId: string,
//     baseVersion: number,
//     user1Changes: any,
//     user2Changes: any
//   ): Promise<Conflict> {
//     return this.prisma.conflict.create({
//       data: {
//         projectId,
//         type,
//         elementId,
//         baseVersion,
//         user1Changes,
//         user2Changes,
//       },
//     });
//   }

//   /**
//    * 
//    * @param conflictId ID du conflit
//    * @param strategy Stratégie de résolution (manuelle, user1, user2, ai)
//    * @param resolvedBy ID de l'utilisateur qui résout
//    * @param customResolution Résolution personnalisée (si manuelle)
//    * @returns Le conflit résolu
//    */
//   async resolveConflict(
//     conflictId: string,
//     strategy: ResolutionStrategy,
//     resolvedBy: string,
//     customResolution?: any
//   ): Promise<Conflict> {
//     const conflict = await this.prisma.conflict.findUnique({ where: { id: conflictId } });
//     if (!conflict) throw new Error('Conflict not found');

//     let resolution;
//     switch (strategy) {
//       case 'ACCEPT_USER1':
//         resolution = conflict.user1Changes;
//         break;
//       case 'ACCEPT_USER2':
//         resolution = conflict.user2Changes;
//         break;
//       case 'MANUAL':
//         if (!customResolution) throw new Error('Manual resolution requires custom data');
//         resolution = customResolution;
//         break;
//       case 'AI_MERGE':
//         resolution = await this.generateAIResolution(conflict);
//         break;
//       default:
//         throw new Error('Invalid resolution strategy');
//     }

//     // Appliquer la résolution au projet
//     await this.applyResolution(conflict.projectId, conflict.elementId, resolution);

//     return this.prisma.conflict.update({
//       where: { id: conflictId },
//       data: {
//         isResolved: true,
//         resolution: JSON.stringify(resolution),
//         resolvedBy,
//         resolvedAt: new Date(),
//         strategy,
//       },
//     });
//   }
  
//   /**
//    * 
//    * @param projectId ID du projet
//    * @param elementId ID de l'élément
//    * @param resolution Résolution à appliquer
//    */
//   private async applyResolution(projectId: string, elementId: string, resolution: any) {
//     // Implémenter la logique pour mettre à jour l'élément du projet
//     // ex: this.prisma.clip.update({ where: { id: elementId }, data: resolution });
//   }

//   /**
//    * 
//    * @param conflict Conflit à résoudre par l'IA
//    * @returns Résolution générée par l'IA
//    */
//   private async generateAIResolution(conflict: Conflict): Promise<any> {
//     const prompt = `
//       Resolve a conflict for a video editing project.
//       Base version: ${JSON.stringify(conflict.baseVersion)}
//       User 1 changes: ${JSON.stringify(conflict.user1Changes)}
//       User 2 changes: ${JSON.stringify(conflict.user2Changes)}
//       Provide a merged JSON object.
//     `;
//     const result = await this.aiService.generateContent({ prompt, type: 'json' });
//     return JSON.parse(result.content);
//   }

//   /**
//    * 
//    * @param original Texte original
//    * @param text1 Texte modifié par l'utilisateur 1
//    * @param text2 Texte modifié par l'utilisateur 2
//    * @returns Texte fusionné
//    */
//   public mergeText(original: string, text1: string, text2: string): string {
//     const diff1 = this.dmp.diff_main(original, text1);
//     const diff2 = this.dmp.diff_main(original, text2);

//     const patch1 = this.dmp.patch_make(original, diff1);
//     const patch2 = this.dmp.patch_make(original, diff2);
    
//     const [mergedText] = this.dmp.patch_apply(patch1.concat(patch2), original);
//     return mergedText;
//   }

//   /**
//    * Fusionne deux objets JSON en se basant sur une version originale
//    */
//   public mergeObjects(original: any, obj1: any, obj2: any, strategy: MergeStrategy = 'LAST_WRITE_WINS'): any {
//     let merged = { ...original };

//     const allKeys = new Set([...Object.keys(original), ...Object.keys(obj1), ...Object.keys(obj2)]);

//     for (const key of allKeys) {
//       const originalValue = original[key];
//       const value1 = obj1[key];
//       const value2 = obj2[key];

//       const hasChanged1 = value1 !== originalValue;
//       const hasChanged2 = value2 !== originalValue;

//       if (hasChanged1 && !hasChanged2) {
//         merged[key] = value1;
//       } else if (!hasChanged1 && hasChanged2) {
//         merged[key] = value2;
//       } else if (hasChanged1 && hasChanged2) {
//         if (value1 === value2) {
//           merged[key] = value1;
//         } else {
//           // Conflit
//           switch (strategy) {
//             case 'USER1_WINS':
//               merged[key] = value1;
//               break;
//             case 'USER2_WINS':
//               merged[key] = value2;
//               break;
//             case 'LAST_WRITE_WINS':
//               // Suppose que obj2 est le plus récent
//               merged[key] = value2;
//               break;
//             case 'AI_MERGE':
//               // Logique de fusion IA plus complexe
//               merged[key] = value2; // Fallback
//               break;
//           }
//         }
//       }
//     }
//     return merged;
//   }

//   /**
//    * Analyse un conflit pour fournir des suggestions de résolution
//    */
//   async analyzeConflict(conflict: Conflict): Promise<any> {
//     const analysis = {
//       type: conflict.type,
//       conflictingFields: [],
//       suggestions: [],
//     };

//     // Comparaison des champs
//     //...

//     return analysis;
//   }

//   /**
//    * Génère une résolution automatique ou semi-automatique
//    */
//   private async generateResolution(conflict: Conflict, analysis: any): Promise<any> {
//     if (conflict.type === 'simple_property') {
//       // Appliquer une stratégie simple (ex: dernière modification)
//     } else if (conflict.type === 'text_merge') {
//       // Utiliser la fusion de texte
//     }
    
//     // Pour les cas complexes, utiliser l'IA
//     return this.generateAIResolution(conflict);
//   }

//   /**
//    * Propose une résolution manuelle avec une interface utilisateur
//    */
//   async presentManualResolution(conflict: Conflict, analysis: any): Promise<any> {
//     // Cette fonction préparerait les données pour une UI de résolution de conflit
//     const suggestions = await this.generateManualResolution(conflict, analysis);
//     return {
//       conflict,
//       analysis,
//       suggestions,
//     };
//   }
  
//   private mergeGenericChanges(changes: any[]): any {
//     if (changes.length === 0) return {};
//     if (changes.length === 1) return changes[0];
    
//     const merged = { ...changes[0] };
//     for (let i = 1; i < changes.length; i++) {
//       for (const key in changes[i]) {
//         // Stratégie "dernière écriture gagne"
//         merged[key] = changes[i][key];
//       }
//     }
//     return merged;
//   }

//   /**
//    * 
//    * @param projectId ID du projet
//    * @returns Liste des conflits non résolus pour le projet
//    */
//   async getUnresolvedConflicts(projectId: string): Promise<Conflict[]> {
//     return this.prisma.conflict.findMany({
//       where: {
//         projectId,
//         isResolved: false,
//       },
//     });
//   }
  
//   /**
//    * Détecte les conflits potentiels pour une opération donnée
//    */
//   async detectPotentialConflicts(projectId: string, elementId: string, userVersion: number) {
//     const currentVersion = await this.getLatestVersion(elementId);
//     if (userVersion < currentVersion) {
//       // Conflit détecté
//       const baseVersionData = await this.getVersionData(elementId, userVersion);
//       const serverChanges = await this.getChangesSince(elementId, userVersion);
      
//       // Créer un conflit pour que l'utilisateur puisse le résoudre
//     }
//   }

//   private async getLatestVersion(elementId: string): Promise<number> {
//     // Implémenter la logique pour obtenir la version la plus récente de l'élément
//     return 0;
//   }

//   private async getVersionData(elementId: string, version: number): Promise<any> {
//     // Implémenter la logique pour obtenir les données d'une version spécifique
//     return {};
//   }

//   private async getChangesSince(elementId: string, version: number): Promise<any> {
//     // Implémenter la logique pour obtenir les changements depuis une version
//     return {};
//   }
  
//   /**
//    * Notifie les utilisateurs des conflits détectés
//    */
//   async notifyUsersOfConflict(projectId: string, conflict: Conflict) {
//     const project = await this.prisma.videoProject.findUnique({
//       where: { id: projectId },
//       include: {
//         collaborations: {
//           select: {
//             userId: true,
//           },
//         },
//       },
//     });
    
//     if (project?.collaborations) {
//       project.collaborations.forEach(collab => {
//         // Envoyer une notification WebSocket
//         console.log(`Notifying user ${collab.userId} of conflict ${conflict.id}`);
//       });
//     }
//   }
// }
