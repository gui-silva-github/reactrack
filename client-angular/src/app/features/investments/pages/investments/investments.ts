import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InvestmentsStateService } from '../../../../core/services/state/investments-state.service';
import { investmentFormatter } from '../../../../core/utils/investments.util';
import { I18nService } from '../../../../core/services/i18n/i18n.service';
import { InvestmentChartComponent } from '../../components/investment-chart/investment-chart.component';

@Component({
  selector: 'app-investments',
  imports: [CommonModule, FormsModule, InvestmentChartComponent],
  templateUrl: './investments.html',
  styleUrl: './investments.css',
})
export class Investments {
  readonly investmentsState = inject(InvestmentsStateService);
  readonly i18n = inject(I18nService);

  formatCurrency(value: number): string {
    return investmentFormatter.format(value);
  }
}
