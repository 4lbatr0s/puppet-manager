import puppeteer from 'puppeteer';

/**
 * A Puppeteer Manager to handle concurrent puppeteer pages with a single browser instance.
 */
class PuppeteerManager {
  /**
   * Creates a new PuppeteerManager instance with the specified concurrency level.
   * @param {number} [concurrency=3] - The maximum number of concurrent pages to manage.
   * @param {Object} [puppeteerOptions={}] - Puppeteer launch options.
   */
  constructor(concurrency = 3, puppeteerOptions = {}) {
    /**
     * The maximum number of concurrent pages to manage.
     * @type {number}
     */
    this.concurrency = concurrency;

    /**
     * Puppeteer launch options.
     * @type {Object}
     */
    this.puppeteerOptions = puppeteerOptions;

    /**
     * The Puppeteer browser instance.
     * @type {puppeteer.Browser | null}
     */
    this.browser = null;

    /**
     * A pool of Puppeteer pages.
     * @type {puppeteer.Page[]}
     */
    this.pages = [];
  }

  /**
   * Initializes the PuppeteerManager with the browser and pages.
   * @private
   */
  async initialize() {
    if (!this.browser) {
      this.browser = await puppeteer.launch(this.puppeteerOptions);
      this.pages = await Promise.all(
        Array.from({ length: this.concurrency }, () => this.browser.newPage())
      );
    }
  }

  /**
   * Closes all pages and the browser instance.
   * @private
   */
  async close() {
    await Promise.all(this.pages.map((page) => page.close()));
    this.pages = [];
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  /**
   * Runs batch jobs concurrently using the available pages.
   * @param {string[]} urls - An array of URLs to process in batch jobs.
   * @param {Function} jobFunction - The function that represents the batch job logic.
   * @returns {Promise<any[]>} - An array of results from the batch jobs.
   */
  async runBatchJobs(urls, jobFunction) {
    await this.initialize();
    const results = await Promise.all(
      urls.map(async (url) => {
        const page = await this.getPage();
        try {
          return await jobFunction(page, url);
        } finally {
          this.returnPage(page);
        }
      })
    );
    return results;
  }

  /**
   * Gets an available page from the pool. If no page is available, waits until one becomes available.
   * @private
   * @returns {puppeteer.Page} - The available page.
   */
  async getPage() {
    if (this.pages.length === 0) {
      await this.initialize();
    }
    return this.pages.pop();
  }

  /**
   * Returns a page to the pool for reuse.
   * @private
   * @param {puppeteer.Page} page - The page to return to the pool.
   */
  returnPage(page) {
    this.pages.push(page);
  }
}

export default PuppeteerManager;
