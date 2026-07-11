import { Component, inject, input, effect, ElementRef, viewChild } from '@angular/core';
import { I18nService } from '../../../../core/services/i18n/i18n.service';
import { IAnnualData } from '../../../../core/models/systems/investments/investments.model';
import { ensureGoogleCharts } from '../../../../core/utils/google-charts.util';

@Component({
  selector: 'app-investment-chart',
  standalone: true,
  template: `<div #chartContainer class="chart-inner"></div>`,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }

      .chart-inner {
        width: 100%;
        height: 100%;
        min-height: 300px;
      }
    `,
  ],
})
export class InvestmentChartComponent {
  readonly data = input<IAnnualData[]>([]);
  private readonly i18n = inject(I18nService);
  private readonly chartContainer = viewChild<ElementRef<HTMLDivElement>>('chartContainer');

  constructor() {
    effect(() => {
      const rows = this.data();
      if (rows.length > 0) {
        ensureGoogleCharts(() => this.draw(rows));
      }
    });
  }

  private draw(rows: IAnnualData[]): void {
    const container = this.chartContainer()?.nativeElement;
    const visualization = window.google?.visualization;
    if (!container || !visualization) return;

    const tableData: Array<Array<string | number>> = [
      [this.i18n.t('investments.year'), this.i18n.t('investments.value')],
      ...rows.map((row) => [row.year, row.valueEndOfYear]),
    ];

    const dataTable = visualization.arrayToDataTable(tableData);
    const chart = new visualization.LineChart(container);
    chart.draw(dataTable, {
      width: '100%',
      height: '100%',
      chartArea: { width: '80%', height: '75%' },
      legend: { position: 'none' },
      backgroundColor: 'transparent',
      hAxis: {
        textStyle: { color: '#c2e9e0' },
        gridlines: { color: '#2f3a36' },
      },
      vAxis: {
        textStyle: { color: '#c2e9e0' },
        gridlines: { color: '#2f3a36' },
      },
      colors: ['#83e6c0'],
    });
  }
}
