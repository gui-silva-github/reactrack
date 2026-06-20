import { Injectable, computed, signal } from '@angular/core';
import { IAnnualData, IUserInput } from '../../models/systems/investments/investments.model';
import { calculateInvestmentResults } from '../../utils/investments.util';

@Injectable({ providedIn: 'root' })
export class InvestmentsStateService {
  private readonly formSignal = signal<IUserInput>({
    initialInvestment: 10000,
    annualInvestment: 1200,
    expectedReturn: 6,
    duration: 10,
  });

  readonly form = this.formSignal.asReadonly();
  readonly inputIsValid = computed(() => this.formSignal().duration >= 1);

  readonly results = computed<IAnnualData[]>(() => {
    if (!this.inputIsValid()) return [];
    return calculateInvestmentResults(this.formSignal());
  });

  setValue<K extends keyof IUserInput>(key: K, value: IUserInput[K]): void {
    this.formSignal.update((prev) => ({ ...prev, [key]: value }));
  }

  getInitialInvestment(): number {
    const first = this.results()[0];
    if (!first) return 0;
    return first.valueEndOfYear - first.interest - first.annualInvestment;
  }

  totalInterest(row: IAnnualData): number {
    return row.valueEndOfYear - row.annualInvestment * row.year - this.getInitialInvestment();
  }

  totalInvested(row: IAnnualData): number {
    return row.valueEndOfYear - this.totalInterest(row);
  }
}
