import { useContext } from "react"
import { useTranslation } from "react-i18next"
import { AppContext } from "@/context/AppContext"

const useGetBackendUrl = () => {
    const { t } = useTranslation()
    const context = useContext(AppContext)

    if (!context) {
        throw new Error(t('auth.appContextError'))
    }

    const { backendUrl } = context

    return { backendUrl }
}

export default useGetBackendUrl