import axios from "axios"

export const commonAxiosConfig = () => {
    axios.defaults.validateStatus = (status) => status < 500

    axios.defaults.withCredentials = true
}