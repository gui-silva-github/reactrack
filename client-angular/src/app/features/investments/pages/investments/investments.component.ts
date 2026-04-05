import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface InvestmentInput {
  initialInvestment: number;
  annualInvestment: number;
  expectedReturn: number;
  duration: number;
}

interface AnnualData {
  year: number;
  interest: number;
  valueEndOfYear: number;
  annualInvestment: number;
}

@Component({
  selector: 'app-investments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="investments-page">
      <header id="header">
        <img src="/assets/investments/investment-calculator-logo.png" alt="Logo investimentos" />
        <h1>Calculadora de Investimentos</h1>
      </header>

      <section id="user-input">
        <div class="input-group">
          <p>
            <label for="initialInvestment">Investimento Inicial</label>
            <input id="initialInvestment" type="number" [(ngModel)]="form().initialInvestment" (ngModelChange)="setValue('initialInvestment', $event)" />
          </p>
          <p>
            <label for="annualInvestment">Investimento Anual</label>
            <input id="annualInvestment" type="number" [(ngModel)]="form().annualInvestment" (ngModelChange)="setValue('annualInvestment', $event)" />
          </p>
        </div>

        <div class="input-group mt">
          <p>
            <label for="expectedReturn">Retorno Esperado</label>
            <input id="expectedReturn" type="number" [(ngModel)]="form().expectedReturn" (ngModelChange)="setValue('expectedReturn', $event)" />
          </p>
          <p>
            <label for="duration">Duração (anos)</label>
            <input id="duration" type="number" [(ngModel)]="form().duration" (ngModelChange)="setValue('duration', $event)" />
          </p>
        </div>
      </section>

      @if (!inputIsValid()) {
        <p class="center">Por favor, coloque uma duração maior ou igual a 1 ano.</p>
      } @else {
        <table id="result">
          <thead>
            <tr>
              <th>Ano</th>
              <th>Investimento</th>
              <th>Interesse (Ano)</th>
              <th>Total de Interesse</th>
              <th>Capital Investido</th>
            </tr>
          </thead>
          <tbody>
            @for (row of results(); track row.year) {
              <tr>
                <td>{{ row.year }}</td>
                <td>{{ formatCurrency(row.valueEndOfYear) }}</td>
                <td>{{ formatCurrency(row.interest) }}</td>
                <td>{{ formatCurrency(totalInterest(row)) }}</td>
                <td>{{ formatCurrency(totalInvested(row)) }}</td>
              </tr>
            }
          </tbody>
        </table>
      }
    </section>
  `,
  styles: [`
    .investments-page {
      padding: 6rem 1rem 2rem;
    }
    #header {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    #header img {
      width: 5rem;
      height: 5rem;
    }
    #user-input {
      padding: 1rem;
      max-width: 30rem;
      margin: 2rem auto;
      border-radius: 4px;
      background: linear-gradient(180deg, #307e6c, #2b996d);
    }
    .input-group {
      display: flex;
      justify-content: space-evenly;
      gap: 1rem;
    }
    .mt { margin-top: 1rem; }
    #user-input p {
      width: 100%;
    }
    #user-input label {
      display: block;
      margin-bottom: 0.25rem;
      font-size: .7rem;
      font-weight: bold;
      text-transform: uppercase;
    }
    #user-input input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #76c0ae;
      border-radius: 0.25rem;
      background-color: transparent;
      color: #eafff9;
      font-size: 1rem;
    }
    #result {
      width: 100%;
      max-width: 900px;
      margin: 2rem auto;
      border-collapse: separate;
      border-spacing: 0;
      text-align: right;
      background-color: #1a1f1d;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    }
    #result thead th {
      font-size: 0.75rem;
      color: #83e6c0;
      text-transform: uppercase;
      padding: 14px 10px;
      background-color: #242b28;
    }
    #result tbody td {
      color: #c2e9e0;
      padding: 12px 10px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    #result th:first-child, #result td:first-child {
      text-align: center;
    }
    .center {
      text-align: center;
    }
  `]
})
export class InvestmentsComponent {
  private readonly currency = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });

  form = signal<InvestmentInput>({
    initialInvestment: 10000,
    annualInvestment: 1200,
    expectedReturn: 6,
    duration: 10
  });

  inputIsValid = computed(() => this.form().duration >= 1);

  results = computed<AnnualData[]>(() => {
    const input = this.form();
    const annualData: AnnualData[] = [];
    let investmentValue = input.initialInvestment;

    for (let i = 0; i < input.duration; i++) {
      const interestEarnedInYear = investmentValue * (input.expectedReturn / 100);
      investmentValue += interestEarnedInYear + input.annualInvestment;
      annualData.push({
        year: i + 1,
        interest: interestEarnedInYear,
        valueEndOfYear: investmentValue,
        annualInvestment: input.annualInvestment
      });
    }

    return annualData;
  });

  setValue(key: keyof InvestmentInput, value: number): void {
    this.form.update((prev) => ({ ...prev, [key]: Number(value) }));
  }

  private getInitialInvestment(): number {
    const first = this.results()[0];
    if (!first) return 0;
    return first.valueEndOfYear - first.interest - first.annualInvestment;
  }

  totalInterest(row: AnnualData): number {
    return row.valueEndOfYear - row.annualInvestment * row.year - this.getInitialInvestment();
  }

  totalInvested(row: AnnualData): number {
    return row.valueEndOfYear - this.totalInterest(row);
  }

  formatCurrency(value: number): string {
    return this.currency.format(value);
  }
}










