import PuppeteerManager from '../PuppeteerManager'; // Adjust the path based on your project structure

describe('PuppeteerManager', () => {
  let manager;

  beforeAll(async () => {
    manager = new PuppeteerManager(2); // Use a concurrency of 2 for testing
    await manager.initialize();
  });

  afterAll(async () => {
    await manager.close();
  });

  it('should initialize with the correct concurrency', () => {
    expect(manager.concurrency).toBe(2);
    expect(manager.browser).not.toBeNull();
    expect(manager.pages).toHaveLength(2);
  });

  it('should run batch jobs correctly', async () => {
    const urls = ['https://example.com', 'https://example.org'];
    const mockJobFunction = jest.fn(async (page, url) => {
      // Simulate a job that navigates to the URL and returns its content
      await page.goto(url, { waitUntil: 'networkidle2' });
      return page.content();
    });

    const results = await manager.runBatchJobs(urls, mockJobFunction);

    expect(mockJobFunction).toHaveBeenCalledTimes(2); // Two batch jobs should be called
    expect(results).toHaveLength(2); // Two results should be returned
    expect(results[0]).toContain('Example Domain'); // Check if the content is as expected
    expect(results[1]).toContain('Example Domain'); // Check if the content is as expected
  });
});
