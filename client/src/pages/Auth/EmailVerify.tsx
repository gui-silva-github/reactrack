import { useContext, useEffect, useRef } from "react";
import useGetBackendUrl from "../../hooks/backend/useGetBackendUrl";
import useNavigateSPA from "../../hooks/routes/useNavigateSPA";

import { AppContext } from "../../context/AppContext";

import { toast } from "react-toastify";

import DivEmailReset from "../../components/DivEmailReset/DivEmailReset";
import Header1 from "../../components/Html/Header1/Header1";
import Paragraph from "../../components/Html/Paragraph/Paragraph";
import Button from "../../components/Html/Button/Button";
import Div from "../../components/Html/Div/Div";

import { verifyAccount } from "../../api/verifyAccount";
import Navbar from "../../components/Navbar/Navbar";

const EmailVerify: React.FC = () => {

    const navigate = useNavigateSPA()

    const { backendUrl } = useGetBackendUrl()

    const context = useContext(AppContext)

    if (!context) {
        throw new Error("AppContext não foi provido")
    }

    const { isLoggedIn, userData, getUserData } = context

    const inputRefs = useRef<Array<HTMLInputElement | null>>([])

    const handleInput = (e: React.FormEvent<HTMLInputElement>, index: number) => {
        const target = e.currentTarget as HTMLInputElement;

        if (target.value.length > 0 && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        const target = e.currentTarget as HTMLInputElement;

        if (e.key === 'Backspace' && target.value === '' && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
        e.preventDefault()

        const paste = e.clipboardData.getData('text')
        const pasteArray = paste.replace(/\D/g, '').split('')
        pasteArray.forEach((char, index) => {
            const inputElement = inputRefs.current[index]

            if (inputElement) {
                inputElement.value = char

                if (index === pasteArray.length - 1 && index < inputRefs.current.length - 1) {
                    inputRefs.current[index + 1]?.focus()
                } else if (index === pasteArray.length - 1) {
                    inputElement.focus()
                }
            }
        })
    }

    const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault()

            const otpArray = inputRefs.current
                .filter((e): e is HTMLInputElement => e !== null)
                .map(e => e.value)

            const otp = otpArray.join('')

            if (otp.length !== 6) {
                toast.error("Por favor, preencha o código OTP completo.")
                return;
            }

            const data = await verifyAccount(backendUrl, { otp })

            if (data.success) {
                toast.success(data.message)
                getUserData()
                navigate('/')
            } else {
                toast.error(data.message)
            }

        } catch (error: any) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        isLoggedIn && userData && userData.isAccountVerified && navigate('/')
    }, [isLoggedIn, userData])

    return (
        <Div>
            <Navbar />
            <DivEmailReset>
                <form onSubmit={onSubmitHandler} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
                    <Header1 className="text-white text-2xl font-semibold text-center mb-4" text="Verificação de E-mail (OTP)" />
                    <Paragraph className="text-center mb-6 text-indigo-300" text="Envie o código de 6 digítos enviado para seu e-mail." />

                    <div className="flex justify-between mb-8" onPaste={handlePaste}>
                        {Array(6).fill(0).map((_, index) => (
                            <input type="text" maxLength={1} onKeyDown={(e) => handleKeyDown(e, index)} key={index} ref={(e) => { inputRefs.current[index] = e }} onInput={(e) => handleInput(e, index)} required className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md' />
                        ))}
                    </div>
                    <Button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full" text="Verificar e-mail" />
                </form>
            </DivEmailReset>
        </Div>
    )
}

export default EmailVerify