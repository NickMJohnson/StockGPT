export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export const INTRO = 82;
export const SCENE = 138;
export const OUTRO = 104;
export const TRANSITION = 16;

export type Scene = {
  img: string;
  label: string;
  title: string;
  body: string;
};

export const SCENES: Scene[] = [
  {
    img: 'shots/01-landing.png',
    label: 'Search',
    title: 'Start with any ticker',
    body: 'Type a symbol like AAPL — StockGPT finds the company straight from SEC EDGAR.',
  },
  {
    img: 'shots/04-filings-open.png',
    label: 'Choose a filing',
    title: 'Every 10-K & 10-Q',
    body: 'Browse real annual and quarterly filings, each dated and linked to the source.',
  },
  {
    img: 'shots/06-report-summary.png',
    label: 'AI Summary',
    title: 'The filing, summarized',
    body: 'Claude reads the financials and writes a plain-English briefing in seconds.',
  },
  {
    img: 'shots/07-charts.png',
    label: 'Trends',
    title: 'Multi-year trends',
    body: 'Revenue, free cash flow and margins — computed and charted automatically.',
  },
  {
    img: 'shots/08-income.png',
    label: 'Statements',
    title: 'Full financial statements',
    body: 'Income, balance sheet and cash flow, normalized across five years.',
  },
  {
    img: 'shots/09-ratios.png',
    label: 'Key Ratios',
    title: '12 ratios at a glance',
    body: 'Margins, returns, liquidity and leverage — color-coded for quick reading.',
  },
  {
    img: 'shots/11-lab-result.png',
    label: 'AI Lab',
    title: 'Ask for any metric',
    body: 'Request a custom ratio or chart in plain English and it appears as a tile.',
  },
  {
    img: 'shots/13-chat-answer.png',
    label: 'Chat',
    title: 'Chat with the filing',
    body: 'Ask anything about the numbers and get grounded, instant answers.',
  },
];

// intro + N scenes + outro sequences, with (N + 1) transitions overlapping between them
export const TOTAL =
  INTRO + SCENES.length * SCENE + OUTRO - (SCENES.length + 1) * TRANSITION;
