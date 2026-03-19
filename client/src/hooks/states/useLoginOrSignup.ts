import type { LoginSignupReturn } from "@/interfaces/loginSignupReturn"
import type { IMethodSign } from "@/interfaces/methodSign"
import { useState } from "react"

const useLoginOrSignup = (state: IMethodSign): LoginSignupReturn => {
    if (state === 'login') {
        const [email, setEmail] = useState<string>('')
        const [password, setPassword] = useState<string>('')

        return {
            email, setEmail,
            password, setPassword
        }
    }
    const [name, setName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    return {
        name, setName,
        email, setEmail,
        password, setPassword
    }
}

export default useLoginOrSignup