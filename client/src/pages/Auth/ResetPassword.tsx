import { useState, useRef } from "react";
import { useTranslation } from "react-i18next"; 
import useGetBackendUrl from "@/hooks/backend/useGetBackendUrl";
import useNavigateSPA from "@/hooks/routes/useNavigateSPA";
import useResetPassword from "@/hooks/states/useResetPassword";
import { sendResetOtp } from "@/api/resetOtp";
import { sendResetPassword } from "@/api/resetPassword";
import { toast } from "react-toastify";
import i18n from "@/i18n";
import mail from "@/assets/svg/mail.svg"
import lock from "@/assets/svg/lock.svg"
import DivEmailReset from "@/components/DivEmailReset/DivEmailReset";
import Header1 from "@/components/Html/Header1/Header1";
import Paragraph from "@/components/Html/Paragraph/Paragraph";
import Div from "@/components/Html/Div/Div";
import Image from "@/components/Html/Image/Image";
import Button from "@/components/Html/Button/Button";
import Navbar from "@/components/Navbar/Navbar";

const ResetPassword: React.FC = () => {

    const navigate = useNavigateSPA()
    const { t } = useTranslation()

    const { backendUrl } = useGetBackendUrl()

    const { email, setEmail, newPassword, setNewPassword } = useResetPassword()

    const [isEmailSent, setIsEmailSent] = useState(false)
    const [otp, setOtp] = useState<string>('')
    const [isOtpSubmitted, setIsOtpSubmitted] = useState(false)

    const inputRefs = useRef<Array<HTMLInputElement | null>>([])

    const handleInput = (e: React.FormEvent<HTMLInputElement>, index: number) => {
        const target = e.currentTarget;

        if (target.value.length > 0 && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        const target = e.currentTarget;

        if (e.key === 'Backspace' && target.value === '' && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault()

        const paste = e.clipboardData.getData('text')

        const pasteArray = paste.replace(/\D/g, '').split('')

        pasteArray.forEach((char, index) => {
            const inputElement = inputRefs.current[index]
            if (inputElement) {
                inputElement.value = char

                if (index === pasteArray.length - 1) {
                    inputElement.focus();
                }
            }
        })
    }

    const onSubmitEmail = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault()

            if (!email) {
                toast.error(i18n.t('auth.insertEmailError'));
                return;
            }

            const data = await sendResetOtp(backendUrl, { email })

            data.success ? toast.success(data.message) : toast.error(data.message)
            data.success && setIsEmailSent(true)
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    const onSubmitOtp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const otpArray = inputRefs.current
            .filter((e): e is HTMLInputElement => e !== null)
            .map(e => e.value)

        const submittedOtp = otpArray.join('')

        if (submittedOtp.length !== 6) {
            toast.error(i18n.t('auth.otpCompleteError'))
            return;
        }

        setOtp(submittedOtp)
        setIsOtpSubmitted(true)
    }

    const onSubmitNewPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            const data = await sendResetPassword(backendUrl, { email, otp, newPassword })

            data.success ? toast.success(data.message) : toast.error(data.message)
            data.success && navigate('/login')
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    return (
        <Div>
            <Navbar />
            <DivEmailReset>
                {!isEmailSent &&
                    <form onSubmit={onSubmitEmail} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
                        <Header1 className="text-white text-2xl font-semibold text-center mb-4" text={t('auth.resetPassword')} />

                        <Paragraph className="text-center mb-6 text-indigo-300" text={t('auth.insertEmail')} />

                        <Div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                            <Image src={mail} alt={t('auth.email')} className="w-3 h-3" />
                            <input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" placeholder={t('auth.email')} className="bg-transparent outline-none text-white" />
                        </Div>
                        <Button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3" text={t('common.send')} />
                    </form>
                }

                {!isOtpSubmitted && isEmailSent &&
                    <form onSubmit={onSubmitOtp} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
                        <Header1 className="text-white text-2xl font-semibold text-center mb-4" text={t('auth.otpTitle')} />

                        <Paragraph className="text-center mb-6 text-indigo-500" text={t('auth.otpSubtitle')} />

                        <div className="flex justify-between mb-8" onPaste={handlePaste}>
                            {Array(6).fill(0).map((_, index) => (
                                <input type="text" onKeyDown={(e) => handleKeyDown(e, index)} maxLength={1} key={index} ref={(e) => { inputRefs.current[index] = e }} onInput={(e) => handleInput(e, index)} required className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md" />

                            ))}
                        </div>
                        <Button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full" text={t('common.send')} />
                    </form>
                }

                {isOtpSubmitted && isEmailSent &&
                    <form onSubmit={onSubmitNewPassword} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
                        <Header1 className="text-white text-2xl font-semibold text-center mb-4" text={t('auth.newPassword')} />

                        <Paragraph className="text-center mb-6 text-indigo-300" text={t('auth.newPasswordSubtitle')} />

                        <Div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                            <Image src={lock} alt={t('auth.password')} className="w-3 h-3" />
                            <input value={newPassword} onChange={e => setNewPassword(e.target.value)} required type="password" placeholder={t('auth.password')} className="bg-transparent outline-none text-white" />
                        </Div>

                        <Button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3" text={t('common.send')} />
                    </form>
                }
            </DivEmailReset>
        </Div>
    )
}

export default ResetPassword