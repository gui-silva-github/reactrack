import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InvestmentsStateService } from '../../../../core/services/state/investments-state.service';
import { investmentFormatter } from '../../../../core/utils/investments.util';

@Component({
  selector: 'app-investments',
  imports: [CommonModule, FormsModule],
  templateUrl: './investments.html',
  styleUrl: './investments.css',
})
export class Investments {
  readonly investmentsState = inject(InvestmentsStateService);

  formatCurrency(value: number): string {
    return investmentFormatter.format(value);
  }
}
