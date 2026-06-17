import { Component, computed, input } from '@angular/core';
import { IPricesCoinData } from '../../../../core/models';
import { PT } from '../../../../core/constants/i18n-pt';

@Component({
  selector: 'app-line-chart',
  imports: [],
  templateUrl: './line-chart.html',
  styleUrl: './line-chart.css',
})
export class LineChart {
  readonly historicalData = input.required<IPricesCoinData>();
  readonly t = PT.crypto;

  readonly points = computed(() => {
    const prices = this.historicalData().prices;
    if (!prices.length) return '';
    const values = prices.map((p) => p[1]);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    return prices
      .map((point, index) => {
        const x = 50 + (index / (prices.length - 1 || 1)) * 530;
        const y = 240 - ((point[1] - min) / range) * 200;
        return `${x},${y}`;
      })
      .join(' ');
  });

  readonly yTicks = computed(() => [40, 90, 140, 190, 240]);

  readonly xTicks = computed(() => {
    const prices = this.historicalData().prices;
    if (!prices.length) return [];
    const step = Math.max(1, Math.floor(prices.length / 6));
    return prices
      .filter((_, index) => index % step === 0 || index === prices.length - 1)
      .map((point, _, arr) => {
        const index = prices.indexOf(point);
        return {
          x: 50 + (index / (prices.length - 1 || 1)) * 530,
          label: new Date(point[0]).toLocaleDateString('pt-BR').slice(0, -5),
        };
      });
  });
}
