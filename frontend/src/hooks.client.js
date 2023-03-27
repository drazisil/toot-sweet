import * as Sentry from '@sentry/svelte';
import { BrowserTracing } from "@sentry/tracing";

// Initialize the Sentry SDK here
Sentry.init({
  dsn: "https://92f8e46fa8fc4ceaa113b6c57a70eb99@o1413557.ingest.sentry.io/4504277664661504",
  integrations: [new BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

/** @type {import('@sveltejs/kit').HandleClientError} */
export function handleError({ error, event }) {
  const errorId = crypto.randomUUID();
  // example integration with https://sentry.io/
  Sentry.captureException(error, { event, errorId });

  return {
    message: 'Whoops!',
    errorId
  };
}
