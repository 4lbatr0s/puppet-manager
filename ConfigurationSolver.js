import ConfigurationMapper from "./ConfigurationMapper.js";
import ConfigNotFoundError from "./errors/config/ConfigNotFoundError/error.js";

/**
 * A Configuration builder class to build different kind of configurations for a manager instance of PuppeteerManagerBuilder class.
 */
class ConfigurationSolver {
  /**
   * @param {String} configName - The name of config that exists in the puppet-manager package's built in configurations.
   * @returns
   */
  static getConfig(configName) {
    try {
      return ConfigurationMapper[configName];
    } catch (err) {
      throw new ConfigNotFoundError();
    }
  }
}

export default ConfigurationSolver;
