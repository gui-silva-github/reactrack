export interface IUserInput {
  initialInvestment: number;
  annualInvestment: number;
  expectedReturn: number;
  duration: number;
}

export interface IAnnualData {
  year: number;
  interest: number;
  valueEndOfYear: number;
  annualInvestment: number;
}
