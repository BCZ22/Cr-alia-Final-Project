// =============================================================================
// SERVICE PRISMA - CONNEXION BASE DE DONNÉES
// =============================================================================

import { PrismaClient } from '@prisma/client';

export class PrismaService extends PrismaClient {
  constructor() {
    super();
  }
}
