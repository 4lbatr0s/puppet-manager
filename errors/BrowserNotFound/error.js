import errorConstants from "./constants.js";

/**
 * An error class to help error handling in the PuppeteerManagerBuilder class.
 */
class BrowserNotFound extends Error {
  /**
   * Creates a new instance of BrowserNotFound class by using JavaScript's Error class' constructor.
   * @private
   * @param {String} name - Name of the error.
   * @param {string} message - Message of the error.
   */
  constructor() {
    super(errorConstants.name, errorConstants.message);
  }
}
export default BrowserNotFound;
