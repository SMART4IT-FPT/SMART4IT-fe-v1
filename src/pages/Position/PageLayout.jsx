import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  IconArrowLeft,
  IconAssemblyFilled,
  IconFileCv,
  IconFileDescription,
  IconChartBar,
  IconHome,
  IconHomeFilled,
} from "@tabler/icons-react";
import AppLayout from "../../components/Layout/AppLayout";
import PositionGeneralPage from "./PositionGeneral";
import appStrings from "../../utils/strings";

import { useEffect } from "react";
import { getCurrentUserApi } from "../../apis/auth";
import { getYourProjectsApi, getSharedProjectsApi } from "../../apis/dashboard";
import { getPositionApi } from "../../apis/positions";
import usePositionsState from "../../context/position";
import useGlobalState from "../../context/global";
import useNotification from "../../hooks/useNotification";
import useProjectsState from "../../context/project";

export default function PositionPageLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { 'project-id': projectId, 'position-id': positionId } = useParams();
  const user = useGlobalState((state) => state.user);
  const setUser = useGlobalState((state) => state.setUser);
  const projects = useProjectsState((state) => state.projects);
  const setProjects = useProjectsState((state) => state.setProjects);
  const shared = useProjectsState((state) => state.shared);
  const setShared = useProjectsState((state) => state.setShared);
  const isGeneral = location.pathname.split("/")[3] === undefined;
  const setPosition = usePositionsState((state) => state.setPosition);
  const errorNotify = useNotification({ type: "error" });
  const projectName = projects?.find((project) => project.id === projectId)?.name || "Project";

  const navbarNavigation = [
    {
      label: (
        <strong
          style={{
            background: "linear-gradient(to right, #6a11cb, #2575fc)",
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            color: "#fff",
          }}
        >{projectName}</strong>
      ),
      icon: <IconAssemblyFilled size="1rem" />,
      activeIcon: <IconAssemblyFilled size="1rem" />,
    }
  ];

  const navbarItems = [
    {
      label: appStrings.language.positionDetail.title,
      icon: <IconHome size="1rem" />,
      activeIcon: <IconHomeFilled size="1rem" />,
      to: `/${projectId}/${positionId}`,
    },
    {
      label: appStrings.language.jd.title,
      icon: <IconFileDescription size="1rem" />,
      to: `/${projectId}/${positionId}/jd`,
    },
    {
      label: appStrings.language.cv.title,
      icon: <IconFileCv size="1rem" />,
      to: `/${projectId}/${positionId}/cv`,
    },
    {
      label: appStrings.language.position.dashboard,
      icon: <IconChartBar size="1rem" />,
      to: `/${projectId}/${positionId}/dashboard`,
    },
  ];

  const navbarBack = [
    {
      label: appStrings.language.btn.back,
      icon: <IconArrowLeft size="1rem" />,
      to: `/${projectId}`,
    },
  ];

  useEffect(() => {
    getCurrentUserApi({
      user,
      onFail: () => navigate("/login"),
      onSuccess: (user) => {
        setUser(user);
        if (!projects) {
          getYourProjectsApi({
            onFail: (msg) => {
              errorNotify({ message: msg });
              setProjects([]);
            },
            onSuccess: (projects) => setProjects(projects),
          });
        }
        if (!shared) {
          getSharedProjectsApi({
            onFail: (msg) => {
              errorNotify({ message: msg });
              setShared([]);
            },
            onSuccess: (projects) => setShared(projects),
          });
        }
        getPositionApi({
          projectId,
          positionId,
          onFail: (msg) => errorNotify({ message: msg }),
          onSuccess: (position) => setPosition(position),
        });
      },
    });
  }, []);

  return (
    <AppLayout
      navPreItems={navbarNavigation}
      navItems={navbarItems}
      navPostItems={navbarBack}
      aside={!isGeneral ? <PositionGeneralPage /> : null}
    >
      <Outlet />
    </AppLayout>
  );
}
