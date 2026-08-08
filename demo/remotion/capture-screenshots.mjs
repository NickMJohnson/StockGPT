import pw from '/opt/homebrew/lib/node_modules/playwright/index.js';
import path from 'path';
const { chromium } = pw;

const OUT = '/private/tmp/claude-501/-Users-mac-Desktop-proj-stockgpt/765fd111-faf5-4285-b422-51ad025006c0/scratchpad/shots';
const URL = 'http://localhost:5173';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function shot(page, name) {
  await sleep(600);
  await page.screenshot({
    path: path.join(OUT, `${name}.png`),
    animations: 'disabled',
  });
  console.log('captured', name);
}

async function scrollToCenter(page, selector) {
  await page.locator(selector).first().evaluate((el) =>
    el.scrollIntoView({ block: 'center', behavior: 'instant' })
  );
  await sleep(400);
}

async function scrollToTopOfTabs(page) {
  // put the sticky tab bar just under the header
  await page.getByRole('tab', { name: 'Income Statement' }).evaluate((el) => {
    const y = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: y, behavior: 'instant' });
  });
  await sleep(400);
}

const run = async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: 'light',
  });
  const page = await context.newPage();
  page.setDefaultTimeout(60000);

  // 1. Landing
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForSelector('input[placeholder="AAPL, MSFT, TSLA..."]');
  await shot(page, '01-landing');

  // Type ticker
  const input = page.locator('input[placeholder="AAPL, MSFT, TSLA..."]');
  await input.click();
  await input.type('AAPL', { delay: 90 });
  await shot(page, '02-typed');

  // Find filings
  await page.getByRole('button', { name: /Find Filings/i }).click();
  await page.waitForSelector('[role="combobox"]', { timeout: 60000 });
  await sleep(600);
  await shot(page, '03-filings-loaded');

  // Open the filing dropdown
  await page.locator('[role="combobox"]').click();
  await page.waitForSelector('[role="option"]');
  await shot(page, '04-filings-open');

  // Select 10-K FY2025
  await page.getByRole('option').filter({ hasText: 'FY2025' }).first().click();
  await sleep(600);
  await shot(page, '05-filing-selected');

  // Analyze -> report
  await page.getByRole('button', { name: /Analyze Filing/i }).click();
  // wait for report header (Apple Inc. h1) or tabs
  await page.getByRole('tab', { name: 'Income Statement' }).waitFor({ timeout: 90000 });
  await sleep(1200);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await sleep(500);
  await shot(page, '06-report-summary');

  // Charts
  await scrollToCenter(page, 'text=/Revenue|Free Cash Flow|Net Margin/');
  await shot(page, '07-charts');

  // Income statement tab
  await scrollToTopOfTabs(page);
  await shot(page, '08-income');

  // Ratios tab
  await page.getByRole('tab', { name: 'Key Ratios' }).click();
  await scrollToTopOfTabs(page);
  await shot(page, '09-ratios');

  // AI Lab tab (empty)
  await page.getByRole('tab', { name: 'AI Lab' }).click();
  await scrollToTopOfTabs(page);
  await shot(page, '10-lab-empty');

  // Lab: compute a ratio (ratio tile)
  await page.getByRole('button', { name: 'Compute interest coverage ratio' }).click();
  await page.waitForFunction(() => document.body.innerText.includes('Computing') === false, null, { timeout: 5000 }).catch(() => {});
  // wait for a tile to appear
  await sleep(1500);

  // Lab: chart gross vs net margin (chart tile)
  const chartPrompt = page.getByRole('button', { name: 'Chart gross margin vs net margin over time' });
  if (await chartPrompt.count()) {
    await chartPrompt.first().click();
  } else {
    // if example buttons gone (tiles present), use the badge/input
    const inputLab = page.locator('input[placeholder*="Chart gross margin"]');
    await inputLab.fill('Chart gross margin vs net margin over time');
    await inputLab.press('Enter');
  }
  // wait until "Computing" indicator disappears and a chart tile exists
  await page.waitForFunction(
    () => !document.body.innerText.includes('Computing') ,
    null, { timeout: 60000 }
  ).catch(() => {});
  await sleep(2500);
  await scrollToTopOfTabs(page);
  await sleep(400);
  await shot(page, '11-lab-result');

  // Chat: ask a question in the right sidebar
  const chat = page.locator('textarea[placeholder="Ask about this filing..."]').first();
  await chat.click();
  await chat.type('How did revenue and margins trend over the last few years?', { delay: 25 });
  await sleep(400);
  await shot(page, '12-chat-typed');
  await chat.press('Enter');
  // wait for assistant answer (Analyzing... disappears and an assistant bubble present)
  await page.waitForFunction(
    () => !document.body.innerText.includes('Analyzing...'),
    null, { timeout: 60000 }
  ).catch(() => {});
  await sleep(2500);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await sleep(500);
  await shot(page, '13-chat-answer');

  await browser.close();
  console.log('DONE');
};

run().catch((e) => { console.error('CAPTURE ERROR', e); process.exit(1); });
