import { chromium } from 'playwright';
import http from 'http';
import fs from 'fs';
import path from 'path';

async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
};

function startStaticServer(distDir: string, port = 4173): Promise<http.Server> {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let reqPath = decodeURI(req.url?.split('?')[0] || '/');
      if (reqPath.endsWith('/')) reqPath += 'index.html';

      let filePath = path.join(distDir, reqPath);
      if (!fs.existsSync(filePath)) {
        filePath = path.join(distDir, 'index.html');
      }

      const ext = path.extname(filePath);
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end('Not Found');
        } else {
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(data);
        }
      });
    });

    server.listen(port, '127.0.0.1', () => {
      console.log(`[Screenshots] Static HTTP server listening at: http://127.0.0.1:${port}`);
      resolve(server);
    });
  });
}

async function main() {
  const rootDir = path.resolve(import.meta.dirname, '..');
  const distDir = path.resolve(rootDir, 'dist');
  const screenshotsDir = path.resolve(rootDir, 'screenshots');

  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const server = await startStaticServer(distDir, 4173);

  console.log('[Screenshots] Launching Chromium browser...');
  const browser = await chromium.launch({ headless: true });

  try {
    // 1. Desktop Home (1440x950) - Accordion & Hero Showcase
    console.log('[Screenshots] Capturing desktop-home.png (1440x950)...');
    const desktopPage = await browser.newPage({
      viewport: { width: 1440, height: 950 },
    });
    await desktopPage.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' });
    await wait(1000);
    await desktopPage.screenshot({
      path: path.join(screenshotsDir, 'desktop-home.png'),
    });

    // 2. Desktop Command Palette Open (1440x950)
    console.log('[Screenshots] Capturing desktop-main-feature.png (Command Palette)...');
    // Click header search button or press ⌘K
    const searchBtn = desktopPage.locator('button[aria-label="Open command palette"]');
    if (await searchBtn.isVisible()) {
      await searchBtn.click();
    } else {
      await desktopPage.keyboard.press('Meta+k');
    }
    await wait(600);
    await desktopPage.screenshot({
      path: path.join(screenshotsDir, 'desktop-main-feature.png'),
    });

    // Close command palette via Escape
    await desktopPage.keyboard.press('Escape');
    await wait(500);

    // 3. Desktop Workbench / Data Table View (1440x1000)
    console.log('[Screenshots] Capturing desktop-workbench.png (Data Table Showcase)...');
    await desktopPage.locator('button:has-text("Data Table")').first().click();
    await wait(800);
    // Select a couple rows to show interactive selection
    const checkboxes = desktopPage.locator('table input[type="checkbox"]');
    if ((await checkboxes.count()) > 2) {
      await checkboxes.nth(1).click();
      await checkboxes.nth(2).click();
    }
    await wait(500);
    await desktopPage.screenshot({
      path: path.join(screenshotsDir, 'desktop-workbench.png'),
    });

    await desktopPage.close();

    // 4. Mobile Viewport (390x844 iPhone 14)
    console.log('[Screenshots] Capturing mobile-home.png (390x844)...');
    const mobilePage = await browser.newPage({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    await mobilePage.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' });
    await wait(1000);
    await mobilePage.screenshot({
      path: path.join(screenshotsDir, 'mobile-home.png'),
    });
    await mobilePage.close();

    console.log('✅ [Screenshots] Successfully captured all 4 screenshots in screenshots/');
  } catch (error) {
    console.error('❌ [Screenshots] Failed to capture screenshots:', error);
    process.exit(1);
  } finally {
    await browser.close();
    server.close();
  }
}

main();
