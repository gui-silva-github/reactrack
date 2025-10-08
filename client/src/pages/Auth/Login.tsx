import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import useGetBackendUrl from "../../hooks/backend/useGetBackendUrl";
import useLoginOrSignup from "../../hooks/states/useLoginOrSignup";

import { loginUser } from "../../api/login";

import { AppContext } from "../../context/AppContext";

import { toast } from "react-toastify";

import mail from "../../assets/svg/mail.svg"
import lock from "../../assets/svg/lock.svg"

import Div from "../../components/Html/Div/Div";
import DivLoginSignUp from "../../components/DivLoginSignUp/DivLoginSignUp";
import Header2 from "../../components/Html/Header2/Header2";
import Paragraph from "../../components/Html/Paragraph/Paragraph";
import Image from "../../components/Html/Image/Image";
import Button from "../../components/Html/Button/Button";
import Navbar from "../../components/Navbar/Navbar";

const Login: React.FC = () => {

    const navigate = useNavigate()

    const { backendUrl } = useGetBackendUrl()

    const { email, setEmail, password, setPassword } = useLoginOrSignup("login")

    const context = useContext(AppContext)

    if (!context) {
        throw new Error("AppContext não foi provido")
    }

    const { setIsLoggedIn, getUserData } = context

    const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault()

            const data = await loginUser(backendUrl, { email, password })

            if (data.success) {
                toast.success('Usuário logado com sucesso!')
                setIsLoggedIn(true)
                getUserData()
                navigate('/')
            } else {
                toast.error(data.message)
            }
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    return (
        <Div>
            <Navbar />
            <DivLoginSignUp>
                <Div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
                    <Header2 className="text-3xl font-semibold text-white text-center mb-3" text="Login" />
                    <Paragraph className="text-center text-sm mb-6" text="Logue na sua conta" />

                    <form onSubmit={onSubmitHandler}>
                        <Div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                            <Image src={mail} alt="Email" />
                            <input onChange={e => setEmail(e.target.value)} value={email} className="bg-transparent outline-none" type="email" placeholder="E-mail" required />
                        </Div>

                        <Div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                            <Image src={lock} alt="Senha" />
                            <input onChange={e => setPassword(e.target.value)} value={password} className="bg-transparent outline-none" type="password" placeholder="Senha" required />
                        </Div>

                        <p onClick={() => navigate('/reset-password')} className="mb-4 text-indigo-500 cursor-pointer">Esqueceu sua senha?</p>

                        <Button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium" text="Login" />
                    </form>

                    <Paragraph className="text-gray-400 text-center text-xs mt-4" text="Não tem uma conta?" />
                    <span onClick={() => navigate('/signup')} className="text-blue-400 cursor-pointer"> Cadastre-se</span>
                </Div>
            </DivLoginSignUp>
        </Div>
    )

}

export default Login