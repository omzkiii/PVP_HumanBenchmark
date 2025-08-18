import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./css/main.css";

// Route Declarations
import App from "./App.tsx";
import MatchPage from "./pages/Match/MatchPage.tsx";
import QueuePage from "./pages/Queue/Queue.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import ProfilePage from "./pages/Profile/Profile.tsx";
import BattlesPage from "./pages/Battles/Battles.tsx";
import AuthHelper from "./API/AuthHelper.tsx";

//React Router Definition
const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthHelper />,
    children: [
      {
        path: "/",
        element: <App />,
        errorElement: <NotFoundPage />,
      },
      {
        path: "/matchmaking", // For in loading state { Matchmaking Load and Draft }
        element: <QueuePage />,
      },
      {
        path: "/matches/:id", // for active match instances
        element: <MatchPage />,
      },
      {
        path: "/profile/:username",
        element: <ProfilePage />,
      },
      {
        path: "/battles",
        element: <BattlesPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />,
);
