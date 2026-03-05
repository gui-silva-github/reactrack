import { useState } from "react";
import { useTranslation } from "react-i18next";
import Paragraph from "../../components/Html/Paragraph/Paragraph";
import type { IUserInput } from "../../interfaces/systems/investments";
import HeaderInvestments from "../../components/Systems/Investments/Header/Header"
import UserInput from "../../components/Systems/Investments/UserInput/UserInput"
import Results from "../../components/Systems/Investments/Results/Results"

const Investments: React.FC = () => {
    const { t } = useTranslation()
    const [userInput, setUserInput] = useState<IUserInput>({
        initialInvestment: 10000,
        annualInvestment: 1200,
        expectedReturn: 6,
        duration: 10
    })

    const inputIsValid = userInput.duration >= 1

    function handleChange(inputIdentifier: string, newValue: string){
        setUserInput(prevUserInput => {
            return {
                ...prevUserInput,
                [inputIdentifier]: +newValue
            }
        })
    }

    return (
        <>
            <HeaderInvestments />
            <UserInput userInput={userInput} onChange={handleChange} />
            { !inputIsValid && <Paragraph text={t('investments.durationError')} className="center" /> }
            { inputIsValid && <Results input={userInput} /> }
        </>
    )
}

export default Investments