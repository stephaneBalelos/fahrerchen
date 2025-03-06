import * as Sentry from "@sentry/nuxt";
 
Sentry.init({
  dsn: "https://837b8f09bb2826a3c65985bf99e45a09@o4508930785017856.ingest.de.sentry.io/4508930786787408",

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
  
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
