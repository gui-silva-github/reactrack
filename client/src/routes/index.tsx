import { Navigate, createBrowserRouter } from "react-router-dom";
import App from "../App"
import Home from "../pages/Auth/Home"
import Login from "../pages/Auth/Login"
import Signup from "../pages/Auth/Signup"
import EmailVerify from "../pages/Auth/EmailVerify"
import ResetPassword from "../pages/Auth/ResetPassword"
import SystemsLayout from "../pages/Systems/SystemsLayout"
import Fit from "../pages/Fit/Fit";
import ExerciseDetail from "../pages/Fit/ExerciseDetail";
import CoinProvider from "../pages/Crypto/Provider/CoinProvider";
import Crypto from "../pages/Crypto/Crypto";
import CoinDetail from "../pages/Crypto/CoinDetail";
import OpinlyProvider from "../pages/Opinly/Provider/OpinlyProvider";
import Opinly from "../pages/Opinly/Opinly";
import TalkiveProvider from "../pages/Talkive/Provider/TalkiveProvider";
import LoginTalkive from "../pages/Talkive/Sections/Login/Login";
import ChatTalkive from "../pages/Talkive/Sections/Chat/Chat";
import ProfileUpdateTalkive from "../pages/Talkive/Sections/ProfileUpdate/ProfileUpdate";
import InvestmentsProvider from "../pages/Investments/Provider/InvestmentsProvider";
import Investments from "../pages/Investments/Investments";
import MoviesProvider from "../pages/Movies/Provider/MoviesProvider";
import HomeMovie from "../pages/Movies/Sections/Home/Home";
import Movie from "../pages/Movies/Sections/Movie/Movie";
import SearchMovie from "../pages/Movies/Sections/Search/Search";
import ConveneProvider from "../pages/Convene/Provider/ConveneProvider";
import Events from "../pages/Convene/Sections/Events/Events";
import EventDetails from "../pages/Convene/Sections/EventDetails/EventDetails";
import NewEvent from "../pages/Convene/Sections/NewEvent/NewEvent";
import EditEvent, { loader as editEventLoader } from "../pages/Convene/Sections/EditEvent/EditEvent"
import { redirectEvents } from "../api/urls/convene";
import ProjectsProvider from "../pages/Projects/Provider/ProjectsProvider";
import HomeProjects from "../pages/Projects/HomeProjects";

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
                    {
                        path: 'fit', children: [
                            { index: true, element: <Fit /> },
                            { path: 'exercise/:id', element: <ExerciseDetail /> },
                        ]
                    },
                    {
                        path: 'crypto', element: <CoinProvider />,
                        children: [
                            { index: true, element: <Crypto /> },
                            { path: 'coin/:id', element: <CoinDetail /> },
                        ]
                    },
                    {
                        path: 'opinly', element: <OpinlyProvider />,
                        children: [
                            { index: true, element: <Opinly /> },
                        ]
                    },
                    {
                        path: 'talkive', element: <TalkiveProvider />,
                        children: [
                            { index: true, element: <LoginTalkive /> },
                            { path: 'chat', element: <ChatTalkive /> },
                            { path: 'profile', element: <ProfileUpdateTalkive /> }
                        ]
                    },
                    {
                        path: 'investments', element: <InvestmentsProvider />,
                        children: [
                            { index: true, element: <Investments /> }
                        ]
                    },
                    {
                        path: 'movies', element: <MoviesProvider />,
                        children: [
                            { index: true, element: <HomeMovie /> },
                            { path: 'movie/:id', element: <Movie /> },
                            { path: 'search', element: <SearchMovie /> },
                        ]
                    },
                    {
                        path: 'convene', element: <ConveneProvider />,
                        children: [
                            { index: true, element: <Navigate to={`${redirectEvents}`} /> },
                            {
                                path: 'events', element: <Events />, children: [
                                    { path: 'new', element: <NewEvent /> },
                                ]
                            },
                            {
                                path: 'events/:id', element: <EventDetails />, children: [
                                    {
                                        path: 'edit', element: <EditEvent />,
                                        loader: editEventLoader
                                    }
                                ]
                            }
                        ]
                    },
                    { path: 'projects', element: <ProjectsProvider />, children: [
                        { index: true, element: <HomeProjects /> }
                    ]}
                ]
            }

        ]
    }
])

export default router