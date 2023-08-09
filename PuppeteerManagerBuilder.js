import puppeteer from "puppeteer";
import ConfigurationSolver from "./ConfigurationSolver.js";
import BrowserNotFound from "./errors/BrowserNotFound/error.js";
import ConfigNotFoundError from "./errors/config/ConfigNotFoundError/error.js";

/**
 * A Puppeteer Manager to handle concurrent puppeteer pages with a single browser instance.
 */
class PuppeteerManagerBuilder {
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
   * @param {String} configName - A config name that does exist in the built in config list of puppet-manager package.
   */
  useConfig(configName) {
    this.config = ConfigurationSolver.getConfig(configName);
    return this;
  }

  /**
   *
   * @param {Object} config - A custom config object to build manager with different configurations.
   */
  setCustomConfig(config) {
    this.config = config;
    return this;
  }

  /**
   * Initializes the PuppeteerManager with the browser and pages.
   * @private
   */
  async initialize() {
    if (!this.browser) {
      this.browser = await puppeteer.launch(this.puppeteerOptions);
    }
    this.pages = await Promise.all(
      Array.from({ length: this.concurrency }, () => this.browser.newPage())
    );
  }

  /**
   * Closes all pages and the browser instance.
   * @private
   */
  async close() {
    if (this?.pages.length >= 1) {
      await Promise.all(
        this.pages.map(async (page) => {
          try {
            await this.closePage(page);
          } catch (error) {
            // Handle the error if the page couldn't be closed
            console.error("Error while closing page:", error);
          }
        })
      );
    }
    this.pages = [];
    if (this?.browser) {
      try {
        await this.browser.close();
      } catch (error) {
        // Handle the error if the browser couldn't be closed
        console.error("Error while closing browser:", error);
      }
      this.browser = null;
    }
  }

  /**
   *
   * @param {puppeteer.Page} page - A puppeteer page that has been created by initialize or runBatchJobs.
   */
  async closePage(page) {
    if (!page.isClosed()) {
      await page.close();
    }
    const pageIndex = this.pages.indexOf(page);
    if (pageIndex !== -1) {
      this.pages.splice(pageIndex, 1);
    }
  }

  /**
   * Creates a new page on the existing Puppeteer browser instance, if browser does not exist, throws an error.
   */
  async createPage() {
    if (this.pages.length < this.concurrency) {
      if (!this.browser) {
        throw new BrowserNotFound();
      }
      const newPage = await this.browser.newPage();
      this.pages.push(newPage);
    }
  }

  /**
   * Closes all pages.
   * @private
   */
  async closePages() {
    await Promise.all(this.pages.map((page) => this.closePage(page)));
    this.pages = [];
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

  /**
   * @private
   * Creates an instance of PuppeteerManager.
   */
  build() {
    if (!this.config) {
      throw new ConfigNotFoundError();
    }
    return new PuppeteerManagerBuilder(this.concurrency, this.config);
  }
}

export default PuppeteerManagerBuilder;
