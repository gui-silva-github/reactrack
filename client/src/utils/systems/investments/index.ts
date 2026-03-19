import type { IUserInput } from "@/interfaces/systems/investments";

export const calculateInvestmentResults = ({
    initialInvestment,
    annualInvestment,
    expectedReturn,
    duration,
}: IUserInput) => {
    const annualData = [];
    let investmentValue = initialInvestment;

    for (let i = 0; i < duration; i++) {
        const interestEarnedInYear = investmentValue * (expectedReturn / 100);
        investmentValue += interestEarnedInYear + annualInvestment;
        annualData.push({
            year: i + 1,
            interest: interestEarnedInYear,
            valueEndOfYear: investmentValue,
            annualInvestment: annualInvestment,
        });
    }

    return annualData;
}

export const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});