import { afterRenderEffect, Component, ElementRef, inject, input, viewChild } from '@angular/core';
import { IPricesCoinData } from '../../../../core/models';
import { I18nService } from '../../../../core/services/i18n/i18n.service';
import { ensureGoogleCharts } from '../../../../core/utils/google-charts.util';

@Component({
  selector: 'app-line-chart',
  imports: [],
  template: `<div #chartContainer class="chart-inner"></div>`,
  styleUrl: './line-chart.css',
})
export class LineChart {
  readonly historicalData = input.required<IPricesCoinData>();
  readonly refreshKey = input<string>('');
  readonly i18n = inject(I18nService);
  private readonly chartContainer = viewChild<ElementRef<HTMLDivElement>>('chartContainer');

  constructor() {
    afterRenderEffect(() => {
      const data = this.historicalData();
      const container = this.chartContainer()?.nativeElement;
      this.refreshKey();

      if (!container || !data?.prices?.length) {
        return;
      }

      ensureGoogleCharts(() => {
        requestAnimationFrame(() => this.draw(data, container));
      });
    });
  }

  private draw(historicalData: IPricesCoinData, container: HTMLElement): void {
    const visualization = window.google?.visualization;
    if (!visualization) {
      return;
    }

    container.innerHTML = '';

    const dataLabel = this.i18n.t('crypto.chartDataLabel');
    const priceLabel = this.i18n.t('crypto.chartPriceLabel');
    const tableData: Array<Array<string | number>> = [
      [dataLabel, priceLabel],
      ...historicalData.prices.map((item) => [
        new Date(item[0]).toLocaleDateString().slice(0, -5),
        item[1],
      ]),
    ];

    const width = container.clientWidth || container.offsetWidth || 600;
    const dataTable = visualization.arrayToDataTable(tableData);
    const chart = new visualization.LineChart(container);
    chart.draw(dataTable, {
      width,
      height: 250,
      title: this.i18n.t('crypto.chartTitle'),
      curveType: 'function',
      legend: { position: 'bottom' },
      chartArea: { width: '85%', height: '65%' },
      backgroundColor: 'transparent',
      colors: ['#7927ff'],
    });
  }
}
