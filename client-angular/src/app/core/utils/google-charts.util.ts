type GoogleChartsApi = {
  charts: {
    load: (version: string, options: { packages: string[] }) => void;
    setOnLoadCallback: (callback: () => void) => void;
  };
  visualization: {
    arrayToDataTable: (data: unknown[][]) => unknown;
    LineChart: new (element: HTMLElement) => { draw: (data: unknown, options: Record<string, unknown>) => void };
  };
};

declare global {
  interface Window {
    google?: GoogleChartsApi;
  }
}

let chartsReady = false;
let loading = false;
const pendingCallbacks: Array<() => void> = [];

export function ensureGoogleCharts(callback: () => void): void {
  if (window.google?.visualization) {
    chartsReady = true;
    callback();
    return;
  }

  pendingCallbacks.push(callback);

  if (loading) {
    return;
  }

  loading = true;

  const runPending = () => {
    chartsReady = true;
    loading = false;
    const callbacks = [...pendingCallbacks];
    pendingCallbacks.length = 0;
    callbacks.forEach((cb) => cb());
  };

  const loadCharts = () => {
    if (!window.google?.charts) {
      loading = false;
      return;
    }

    window.google.charts.load('current', { packages: ['corechart'] });
    window.google.charts.setOnLoadCallback(runPending);
  };

  const existing = document.querySelector('script[data-google-charts]');
  if (existing) {
    if (window.google?.charts) {
      loadCharts();
    } else {
      existing.addEventListener('load', loadCharts, { once: true });
    }
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://www.gstatic.com/charts/loader.js';
  script.dataset['googleCharts'] = 'true';
  script.onload = loadCharts;
  script.onerror = () => {
    loading = false;
    pendingCallbacks.length = 0;
  };
  document.head.appendChild(script);
}
