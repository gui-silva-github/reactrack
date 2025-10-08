import { createBrowserRouter } from "react-router-dom";
import App from "../App"
import Home from "../pages/Auth/Home"
import Login from "../pages/Auth/Login"
import Signup from "../pages/Auth/Signup"
import EmailVerify from "../pages/Auth/EmailVerify"
import ResetPassword from "../pages/Auth/ResetPassword"
import SystemsLayout from "../pages/Systems/SystemsLayout"

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { index: true, element: <Home /> },
            { path: 'login', element: <Login /> },
            { path: 'signup', element: <Signup /> },
            { path: 'email-verify', element: <EmailVerify /> },
            { path: 'reset-password', element: <ResetPassword /> },
            {
                path: 'systems', element: <SystemsLayout />,
                children: [
                    // { index: true, element: <Dashboard /> },
                    // { path: 'fit', element: <Fit /> },
                    // { path: 'crypto', element: <Crypto /> },
                ]
            }
        ]
    }
])

export default router