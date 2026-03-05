import { useState, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { signup, login, resetPass } from '../../../../api/talkive/config/firebase'
import { TalkiveContext } from '../../../../context/Talkive/TalkiveContext'
import './Login.sass'

type ICurrentState = 'Cadastrar-se' | 'Login'

const LoginTalkive: React.FC = () => {
    const { t } = useTranslation()
    const [currentState, setCurrentState] = useState<ICurrentState>('Cadastrar-se')
    const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const talkiveContext = useContext(TalkiveContext)
    const setChatUser = talkiveContext?.setChatUser

    const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (currentState === 'Cadastrar-se'){
            signup({username: userName, email, password})
            setChatUser && setChatUser(null)
        } else {
            login({email, password})
            setChatUser && setChatUser(null)
        }
    }

    return (
        <div className='login'>
            <form onSubmit={onSubmitHandler} className='login-form'>
                {currentState === 'Cadastrar-se' ? <input onChange={(e) => setUserName(e.target.value)} value={userName} required type='text' placeholder={t('talkive.signup.name')} className='form-input' /> : null}
                <input onChange={(e) => setEmail(e.target.value)} value={email} required type='email' placeholder={t('talkive.login.email')} className='form-input' />
                <input onChange={(e) => setPassword(e.target.value)} value={password} required type='password' placeholder={t('talkive.login.password')} className='form-input' />
                <button type='submit'>{currentState === 'Cadastrar-se' ? t('talkive.signup.createAccount') : t('talkive.login.title')}</button>
                <div className='login-term'>
                    <input type='checkbox' />
                    <p>{t('talkive.signup.agree')}</p>
                </div>
                <div className='login-forgot'>
                    {
                        currentState === 'Cadastrar-se' ? 
                        <p className='login-toggle'>
                            {t('talkive.signup.alreadyHaveAccount')} <span onClick={() => setCurrentState('Login')}>{t('talkive.signup.alreadyHaveAccountLink')}</span>
                        </p>
                        : 
                        <p className='login-toggle'>
                            {t('talkive.login.createAccount')} <span onClick={() => setCurrentState('Cadastrar-se')}>{t('talkive.login.createAccountLink')}</span>
                        </p>
                    }
                    {
                        currentState === 'Login' ?
                        <p className='login-toggle'>
                            {t('talkive.login.forgotPassword')} <span onClick={() => resetPass({email})}>{t('talkive.login.resetPassword')}</span>
                        </p> :
                        null
                    }
                </div>
            </form>
        </div>
    )
}

export default LoginTalkive