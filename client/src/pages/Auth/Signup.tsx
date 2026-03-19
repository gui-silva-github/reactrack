import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { AppContext } from "@/context/AppContext";
import useGetBackendUrl from "@/hooks/backend/useGetBackendUrl";
import useNavigateSPA from "@/hooks/routes/useNavigateSPA";
import useLoginOrSignup from "@/hooks/states/useLoginOrSignup";
import { toast } from "react-toastify";
import i18n from "@/i18n";
import { registerUser } from "@/api/register";
import person from "@/assets/svg/person.svg"
import mail from "@/assets/svg/mail.svg"
import lock from "@/assets/svg/lock.svg"
import DivLoginSignUp from "@/components/DivLoginSignUp/DivLoginSignUp";
import Div from "@/components/Html/Div/Div";
import Header2 from "@/components/Html/Header2/Header2";
import Paragraph from "@/components/Html/Paragraph/Paragraph";
import Image from "@/components/Html/Image/Image";
import Button from "@/components/Html/Button/Button";
import Navbar from "@/components/Navbar/Navbar";

const Signup: React.FC = () => {

    const navigate = useNavigateSPA()
    const { t } = useTranslation()

    const { backendUrl } = useGetBackendUrl()

    const { name, setName, email, setEmail, password, setPassword } = useLoginOrSignup("signup")

    const context = useContext(AppContext)

    if (!context) {
        throw new Error(t('auth.appContextError'))
    }

    const { setIsLoggedIn, getUserData } = context

    const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault()

            if (!name) {
                toast.error(t('auth.nameRequired'))
                return
            }

            const data = await registerUser(backendUrl, { name, email, password })

            if (data.success) {
                toast.success(i18n.t('auth.signupSuccess'))
                setIsLoggedIn(true)
                getUserData()
                setTimeout(() => navigate('/'), 150)
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
                    <Header2 className="text-3xl font-semibold text-white text-center mb-3" text={t('auth.signup')} />

                    <Paragraph className="text-center text-sm mb-6" text={t('auth.signupSubtitle')} />

                    <form onSubmit={onSubmitHandler}>
                        <Div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                            <Image src={person} alt={t('common.iconAlt')} />
                            <input onChange={e => setName!(e.target.value)} value={name} className="bg-transparent outline-none" type="text" placeholder={t('auth.fullName')} required />
                        </Div>

                        <Div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                            <Image src={mail} alt={t('auth.email')} />
                            <input onChange={e => setEmail(e.target.value)} value={email} className="bg-transparent outline-none" type="email" placeholder={t('auth.email')} required />
                        </Div>

                        <Div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                            <Image src={lock} alt={t('auth.password')} />
                            <input onChange={e => setPassword(e.target.value)} value={password} className="bg-transparent outline-none" type="password" placeholder={t('auth.password')} required />
                        </Div>

                        <p onClick={() => navigate('/reset-password')} className="mb-4 text-indigo-500 cursor-pointer">{t('auth.forgotPassword')}</p>

                        <Button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium" text={t('auth.register')} />
                    </form>

                    <p className='text-gray-400 text-center text-xs mt-4'>{t('auth.alreadyHaveAccount')}
                        <span onClick={() => navigate('/login')} className='text-blue-400 cursor-pointer'> {t('auth.login')}</span>
                    </p>
                </Div>
            </DivLoginSignUp>
        </Div>
    )

}

export default Signup