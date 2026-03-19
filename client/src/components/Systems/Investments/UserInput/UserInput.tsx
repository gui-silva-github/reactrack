import { useTranslation } from "react-i18next"
import type { IUserInput } from "@/interfaces/systems/investments"
import Div from "@/components/Html/Div/Div";

type InputIdentifier = 'initialInvestment' | 'annualInvestment' | 'expectedReturn' | 'duration'

interface IUserInputProps {
    userInput: IUserInput;
    onChange: (inputIdentifier: InputIdentifier, newValue: string) => void;
}

const UserInput: React.FC<IUserInputProps> = ({ userInput, onChange }) => {
    const { t } = useTranslation()
    return (
        <section id="user-input">
            <Div className="input-group">
                <p>
                    <label htmlFor="investment">{t('investments.initialInvestment')}</label>
                    <input
                        type="number" id="investment" required
                        value={userInput.initialInvestment} onChange={(e) => onChange('initialInvestment', e.target.value)}
                    />
                </p>
                <p>
                    <label htmlFor="investmentA">{t('investments.annualInvestment')}</label>
                    <input id="investmentA" type="number" required
                        value={userInput.annualInvestment}
                        onChange={(e) => onChange('annualInvestment', e.target.value)} />
                </p>
            </Div>
            <div className="input-group" style={{ marginTop: '1rem' }}>
                <p>
                    <label htmlFor="return">{t('investments.expectedReturn')}</label>
                    <input id="return" type="number" required
                        value={userInput.expectedReturn}
                        onChange={(e) => onChange('expectedReturn', e.target.value)}
                    />
                </p>
                <p>
                    <label htmlFor="duration">{t('investments.duration')}</label>
                    <input id="duration" type="number" required
                        value={userInput.duration}
                        onChange={(e) => onChange('duration', e.target.value)}
                    />
                </p>
            </div>
        </section>
    )
}

export default UserInput