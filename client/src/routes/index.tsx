import { Navigate, createBrowserRouter } from "react-router-dom";
import type { ComponentType } from "react";
import App from "../App";
import { redirectEvents } from "@/api/urls/convene";

/**
 * Cria uma rota com lazy loading (code splitting).
 * O módulo importado deve exportar `default` (Componente) e opcionalmente
 * `loader`, `action`, `ErrorBoundary` para serem repassados ao React Router.
 */
const createLazyRoute = <T extends Record<string, unknown>>(
  importFn: () => Promise<{ default: ComponentType } & T>
) => ({
  lazy: async () => {
    const module = await importFn();
    const { default: Component, ...rest } = module;
    return { Component, ...rest };
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, ...createLazyRoute(() => import("@/pages/Auth/Home")) },
      { path: "login", ...createLazyRoute(() => import("@/pages/Auth/Login")) },
      { path: "signup", ...createLazyRoute(() => import("@/pages/Auth/Signup")) },
      {
        path: "email-verify",
        ...createLazyRoute(() => import("@/pages/Auth/EmailVerify")),
      },
      {
        path: "reset-password",
        ...createLazyRoute(() => import("@/pages/Auth/ResetPassword")),
      },
      {
        path: "systems",
        ...createLazyRoute(() => import("@/pages/Systems/SystemsLayout")),
        children: [
          {
            index: true,
            ...createLazyRoute(() => import("@/pages/Systems/Dashboard/Dashboard")),
          },
          {
            path: "fit",
            children: [
              {
                index: true,
                ...createLazyRoute(() => import("@/pages/Fit/Fit")),
              },
              {
                path: "exercise/:id",
                ...createLazyRoute(() => import("@/pages/Fit/ExerciseDetail")),
              },
            ],
          },
          {
            path: "crypto",
            ...createLazyRoute(() => import("@/pages/Crypto/Provider/CoinProvider")),
            children: [
              {
                index: true,
                ...createLazyRoute(() => import("@/pages/Crypto/Crypto")),
              },
              {
                path: "coin/:id",
                ...createLazyRoute(() => import("@/pages/Crypto/CoinDetail")),
              },
            ],
          },
          {
            path: "opinly",
            ...createLazyRoute(() => import("@/pages/Opinly/Provider/OpinlyProvider")),
            children: [
              {
                index: true,
                ...createLazyRoute(() => import("@/pages/Opinly/Opinly")),
              },
            ],
          },
          {
            path: "talkive",
            ...createLazyRoute(() => import("@/pages/Talkive/Provider/TalkiveProvider")),
            children: [
              {
                index: true,
                ...createLazyRoute(() => import("@/pages/Talkive/Sections/Login/Login")),
              },
              {
                path: "chat",
                ...createLazyRoute(() => import("@/pages/Talkive/Sections/Chat/Chat")),
              },
              {
                path: "profile",
                ...createLazyRoute(() =>
                  import("@/pages/Talkive/Sections/ProfileUpdate/ProfileUpdate")
                ),
              },
            ],
          },
          {
            path: "investments",
            ...createLazyRoute(() =>
              import("@/pages/Investments/Provider/InvestmentsProvider")
            ),
            children: [
              {
                index: true,
                ...createLazyRoute(() => import("@/pages/Investments/Investments")),
              },
            ],
          },
          {
            path: "movies",
            ...createLazyRoute(() =>
              import("@/pages/Movies/Provider/MoviesProvider")
            ),
            children: [
              {
                index: true,
                ...createLazyRoute(() => import("@/pages/Movies/Sections/Home/Home")),
              },
              {
                path: "movie/:id",
                ...createLazyRoute(() => import("@/pages/Movies/Sections/Movie/Movie")),
              },
              {
                path: "search",
                ...createLazyRoute(() =>
                  import("@/pages/Movies/Sections/Search/Search")
                ),
              },
            ],
          },
          {
            path: "convene",
            ...createLazyRoute(() => import("@/pages/Convene/Provider/ConveneProvider")),
            children: [
              { index: true, element: <Navigate to={redirectEvents} /> },
              {
                path: "events",
                ...createLazyRoute(() => import("@/pages/Convene/Sections/Events/Events")),
                children: [
                  {
                    path: "new",
                    ...createLazyRoute(() =>
                      import("@/pages/Convene/Sections/NewEvent/NewEvent")
                    ),
                  },
                ],
              },
              {
                path: "events/:id",
                ...createLazyRoute(() =>
                  import("@/pages/Convene/Sections/EventDetails/EventDetails")
                ),
                children: [
                  {
                    path: "edit",
                    ...createLazyRoute(() =>
                      import("@/pages/Convene/Sections/EditEvent/EditEvent")
                    ),
                  },
                ],
              },
            ],
          },
          {
            path: "projects",
            ...createLazyRoute(() =>
              import("@/pages/Projects/Provider/ProjectsProvider")
            ),
            children: [
              {
                index: true,
                ...createLazyRoute(() => import("@/pages/Projects/HomeProjects")),
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;
