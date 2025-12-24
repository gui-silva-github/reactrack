import { useState, useContext } from 'react'
import { signup, login, resetPass } from '../../../../api/talkive/config/firebase'
import { TalkiveContext } from '../../../../context/Talkive/TalkiveContext'
import './Login.sass'

type ICurrentState = 'Cadastrar-se' | 'Login'

const LoginTalkive: React.FC = () => {
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
                {currentState === 'Cadastrar-se' ? <input onChange={(e) => setUserName(e.target.value)} value={userName} required type='text' placeholder='Nome de Usuário' className='form-input' /> : null}
                <input onChange={(e) => setEmail(e.target.value)} value={email} required type='email' placeholder='E-mail' className='form-input' />
                <input onChange={(e) => setPassword(e.target.value)} value={password} required type='password' placeholder='Senha' className='form-input' />
                <button type='submit'>{currentState === 'Cadastrar-se' ? 'Criar conta' : 'Login'}</button>
                <div className='login-term'>
                    <input type='checkbox' />
                    <p>Concordo com os termos de uso e políticas de privacidade.</p>
                </div>
                <div className='login-forgot'>
                    {
                        currentState === 'Cadastrar-se' ? 
                        <p className='login-toggle'>
                            Já tem uma conta? <span onClick={() => setCurrentState('Login')}>Login</span>
                        </p>
                        : 
                        <p className='login-toggle'>
                            Criar um conta? <span onClick={() => setCurrentState('Cadastrar-se')}>Clique aqui</span>
                        </p>
                    }
                    {
                        currentState === 'Login' ?
                        <p className='login-toggle'>
                            Esqueceu a senha? <span onClick={() => resetPass({email})}>Resete aqui</span>
                        </p> :
                        null
                    }
                </div>
            </form>
        </div>
    )
}

export default LoginTalkive