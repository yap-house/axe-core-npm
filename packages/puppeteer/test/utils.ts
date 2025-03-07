import express from 'express';
import { createServer, Server } from 'http';
import testListen from 'test-listen';
import { expect } from 'chai';
import type { PuppeteerLaunchOptions } from 'puppeteer';
import { fixturesPath } from 'axe-test-fixtures';

export async function expectAsync(
  fn: () => Promise<any>
): Promise<Chai.Assertion> {
  try {
    const res = await fn();
    return expect(() => res);
  } catch (err) {
    return expect(() => {
      throw err;
    });
  }
}

export async function expectAsyncToNotThrow(
  fn: () => Promise<any>
): Promise<void> {
  const expectResult = await expectAsync(fn);
  expectResult.to.not.throw;
}

export async function startServer(): Promise<{ server: Server; addr: string }> {
  const app: express.Application = express();
  app.use(express.static(fixturesPath));
  const server: Server = createServer(app);
  const addr = await testListen(server);

  return { server, addr };
}

export function puppeteerOpts(): PuppeteerLaunchOptions {
  const options: PuppeteerLaunchOptions = {};

  if (process.env.CI) {
    options.args = [];
    options.args.push('--no-sandbox', '--disable-setuid-sandbox');
    options.executablePath = '/usr/bin/google-chrome-stable';
  }

  return options;
}
