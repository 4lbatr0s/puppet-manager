# Puppeteer Manager

A Puppeteer Manager to handle concurrent Puppeteer pages with a single browser instance.

## Introduction

The Puppeteer Manager is a utility class designed to manage multiple concurrent Puppeteer pages efficiently. It allows you to limit the number of open pages, reuse them for processing multiple URLs concurrently, and optimize memory consumption by sharing a single Puppeteer browser instance.

## Features

- Manages concurrent Puppeteer pages with a specified concurrency level.
- Efficiently reuses pages for batch job processing.
- Reduces memory consumption by utilizing a single Puppeteer browser instance.
- Supports customizable Puppeteer launch options.

## Installation

Install the `puppeteer` dependency as a peer dependency:

```bash
npm install puppeteer
```

Install the `PuppeteerManager` class:

```bash
npm install puppet-manager
```

## Usage

```javascript
const PuppeteerManagerBuilder = require('puppet-manager/PuppeteerManagerBuilder');
const ConfigurationNames = require('./ConfigurationNames');

async function batchJob(page, url) {
  // Your batch job logic goes here using the 'page'
  await page.goto(url, { waitUntil: 'networkidle2' });
  // ... (your other operations on the page)
  return page.content(); // Return the result of your batch job
}

async function main() {
  const batchUrls = [
    'https://example.com/page1',
    'https://example.com/page2',
    'https://example.com/page3',
  ];

  try {
    const builder = new PuppeteerManagerBuilder();

    // Use a predefined configuration using the enum value
    const managerWithBuiltInConfig = builder
      .useConfig(ConfigurationNames.Config1)
      .build();

    const resultsBuiltInConfig = await managerWithBuiltInConfig.runBatchJobs(batchUrls, batchJob);
    console.log('Results from predefined config:', resultsBuiltInConfig);

    // Use a custom configuration using setCustomConfig
    const customConfig = {
      headless: true,
      ignoreHTTPSErrors: true,
      defaultViewport: { width: 1280, height: 720 },
      userDataDir: './custom-user-data',
      args: ['--disable-notifications'],
    };

    const managerWithCustomConfig = builder
      .setCustomConfig(customConfig)
      .build();

    const resultsCustomConfig = await managerWithCustomConfig.runBatchJobs(batchUrls, batchJob);
    console.log('Results from custom config:', resultsCustomConfig);
  } finally {
    if (managerWithBuiltInConfig) {
      await managerWithBuiltInConfig.close();
    }
    if (managerWithCustomConfig) {
      await managerWithCustomConfig.close();
    }
  }
}

main();

```

## API Reference

### PuppeteerManager(concurrency, puppeteerOptions)

Creates a new PuppeteerManager instance.

- `concurrency` (optional, default: 3): The maximum number of concurrent pages to manage.
- `puppeteerOptions` (optional, default: {}): Puppeteer launch options.

### async runBatchJobs(urls, jobFunction)

Runs batch jobs concurrently using the available pages.

- `urls`: An array of URLs to process in batch jobs.
- `jobFunction`: The function that represents the batch job logic, taking a Puppeteer page and URL as input.

### async initialize()

Initializes the PuppeteerManager with the browser and pages. (Internal method)

### async close()

Closes all pages and the browser instance. (Internal method)

### async getPage()

Gets an available page from the pool. If no page is available, waits until one becomes available. (Internal method)

### returnPage(page)

Returns a page to the pool for reuse. (Internal method)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please read the [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines.

## Acknowledgments

- This project is inspired by the need for efficient Puppeteer page management in concurrent tasks.

## Support

For any questions, bug reports, or feature requests, please [open an issue](https://github.com/4lbatr0s/puppet-manager/issues/new).

## TODOS
1. Include TypeScript type definitions.
2. Include default browser configurations for a better performance.
3. Create consistency with naming.
```
