import { BrowserTracing } from '@sentry/tracing';
import * as Sentry from '@sentry/vue';
import { boot } from 'quasar/wrappers';

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app, router }) => {
  Sentry.init({
    app,
    dsn: process.env.SENTRY_DSN,
    integrations: [
      new BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
        tracePropagationTargets: [
          'localhost',
          'eso-raider.onrender.com',
          /^\//,
        ],
      }),
    ],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: <number>(<unknown>process.env.SENTRY_TRACES_SAMPLE_RATE),
  });
});
