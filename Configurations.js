export const extreme = {};

/**
 * @typedef {Object}
 * @property {boolean} headless - Whether to run Puppeteer in headless mode.
 * @property {boolean} ignoreHTTPSErrors - Whether to ignore HTTPS errors.
 * @property {null} defaultViewport - The default viewport dimensions.
 * @property {string} userDataDir - The directory for user data.
 * @property {string[]} args - Additional command-line arguments.
 */
export const medium = {
  headless: "new",
  ignoreHTTPSErrors: true, // Ignore HTTPS errors
  defaultViewport: null, // Set your custom viewport dimensions if needed
  userDataDir: "../static/puppeteer",
  args: [
    "--autoplay-policy=user-gesture-required",
    "--disable-background-networking",
    "--disable-background-timer-throttling",
    "--disable-backgrounding-occluded-windows",
    "--disable-breakpad",
    "--disable-client-side-phishing-detection",
    "--disable-component-update",
    "--disable-default-apps",
    "--disable-dev-shm-usage",
    "--disable-domain-reliability",
    "--disable-extensions",
    "--disable-features=AudioServiceOutOfProcess",
    "--disable-hang-monitor",
    "--disable-ipc-flooding-protection",
    "--disable-notifications",
    "--disable-offer-store-unmasked-wallet-cards",
    "--disable-popup-blocking",
    "--disable-print-preview",
    "--disable-prompt-on-repost",
    "--disable-renderer-backgrounding",
    "--disable-setuid-sandbox",
    "--disable-speech-api",
    "--disable-sync",
    "--hide-scrollbars",
    "--ignore-gpu-blacklist",
    "--metrics-recording-only",
    "--mute-audio",
    "--no-default-browser-check",
    "--no-first-run",
    "--no-pings",
    "--no-sandbox",
    "--no-zygote",
    "--password-store=basic",
    "--use-gl=swiftshader",
    "--use-mock-keychain",
    "--disable-gpu",
    "--memory-pressure-off",
  ],
};
