import LandingPage from "../pages/Landing/LandingPage";
import LoginPage from "../pages/Login/LoginPage";
import DashboardPageLayout from "../pages/Dashboard/PageLayout";
import HomePage from "../pages/Dashboard/Home";
import YourProjectPage from "../pages/Dashboard/YourProject";
import SharedProjectPage from "../pages/Dashboard/SharedProject";
import TrashPage from "../pages/Dashboard/Trash";
import SettingPage from "../pages/Dashboard/Setting";
import ProjectPageLayout from "../pages/Project/PageLayout";
import YourPositionPage from "../pages/Project/Position";
import InsightsPage from "../pages/Project/Insight";
import ProjectSettingPage from "../pages/Project/Setting";
import PositionPageLayout from "../pages/Position/PageLayout";
import PositionGeneralPage from "../pages/Position/PositionGeneral";
import JDPage from "../pages/Position/JD";
import CVPage from "../pages/Position/CV";
import MatchingResultPage from "../pages/Position/MatchingResult";
import CVDetailPage from "../pages/Position/CVDetail";
import RedirectPage from "../pages/Utils/Redirect";
import NotFoundPage from "../pages/Utils/NotFound";
import UploadPage from "../pages/Upload/UploadPage";

const appRoutes = [
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/404",
    element: <NotFoundPage />,
  },
  {
    path: "/upload/:positionId",
    element: <UploadPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardPageLayout />,
    children: [
      {
        path: "/dashboard",
        element: <HomePage />,
      },
      {
        path: "/dashboard/your-project",
        element: <YourProjectPage />,
      },
      {
        path: "/dashboard/shared-project",
        element: <SharedProjectPage />,
      },
      {
        path: "/dashboard/deleted-project",
        element: <TrashPage />,
      },
      {
        path: "/dashboard/setting",
        element: <SettingPage />,
      },
      {
        path: "/dashboard/*",
        element: <RedirectPage destination="/dashboard" />,
      },
    ],
  },
  {
    path: "/:project-id",
    element: <ProjectPageLayout />,
    children: [
      {
        path: "/:project-id",
        element: <YourPositionPage />,
      },
      {
        path: "/:project-id/insights",
        element: <InsightsPage />,
      },
      {
        path: "/:project-id/setting",
        element: <ProjectSettingPage />,
      },
    ],
  },
  {
    path: "/:project-id/:position-id",
    element: <PositionPageLayout />,
    children: [
      {
        path: "/:project-id/:position-id",
        element: <PositionGeneralPage />,
      },
      {
        path: "/:project-id/:position-id/jd",
        element: <JDPage />,
      },
      {
        path: "/:project-id/:position-id/cv",
        element: <CVPage />,
      },
      {
        path: "/:project-id/:position-id/result",
        element: <MatchingResultPage />,
      },
      {
        path: "/:project-id/:position-id/cv/:cv-id",
        element: <CVDetailPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];

export default appRoutes;
