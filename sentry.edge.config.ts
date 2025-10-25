// This file configures the initialization of Sentry for edge features (middleware, etc.).
// The config you add here will be used whenever one of your edge features is run.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import { initSentry } from './lib/monitoring/sentry';

initSentry();
