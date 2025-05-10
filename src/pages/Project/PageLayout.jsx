import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Box, LoadingOverlay } from "@mantine/core";
import {
  IconAssemblyFilled,
  IconSquare,
  IconChartBar,
  IconSettings,
  IconSettingsFilled,
} from "@tabler/icons-react";
import AppLayout from "../../components/Layout/AppLayout";
import appStrings from "../../utils/strings";
import { useEffect } from "react";
import { getSharedProjectsApi, getYourProjectsApi } from "../../apis/dashboard";
import useProjectsState from "../../context/project";
import { getCurrentUserApi } from "../../apis/auth";
import useGlobalState from "../../context/global";
import useNotification from "../../hooks/useNotification";

export default function ProjectPageLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const projectId = location.pathname.split("/")[1];
  const projects = useProjectsState((state) => state.projects);
  const setProjects = useProjectsState((state) => state.setProjects);
  const shared = useProjectsState((state) => state.shared);
  const setShared = useProjectsState((state) => state.setShared);
  const user = useGlobalState((state) => state.user);
  const setUser = useGlobalState((state) => state.setUser);
  const errorNotify = useNotification({ type: "error" });
  const projectName =
    projects?.find(project => project.id === projectId)?.name ||
    shared?.find(project => project.id === projectId)?.name ||
    trash?.find(project => project.id === projectId)?.name ||
    "Project";

  const projectNameItem = [
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
      label: appStrings.language.position.title,
      icon: <IconSquare size="1rem" />,
      activeIcon: <IconSquare size="1rem" />,
      to: `/${projectId}`,
    },
    {
      label: "Dashboard",
      icon: <IconChartBar size="1rem" />,
      activeIcon: <IconChartBar size="1rem" />,
      to: `/${projectId}/dashboard`,
    },
  ];

  const navbarSettings = [
    {
      label: appStrings.language.setting.title,
      icon: <IconSettings size="1rem" />,
      activeIcon: <IconSettingsFilled size="1rem" />,
      to: `/${projectId}/setting`,
    },
  ];

  useEffect(() => {
    // Fetch user data
    getCurrentUserApi({
      user,
      onFail: (msg) => {
        errorNotify({ message: msg });
        navigate("/login");
      },
      onSuccess: (user) => {
        setUser(user);
        // Fetch projects data
        if (!projects) {
          getYourProjectsApi({
            onFail: (msg) => {
              errorNotify({ message: msg });
              setProjects([]);
            },
            onSuccess: (data) => {
              setProjects(data);
            },
          });
        }
        // Fetch shared projects data
        if (!shared) {
          getSharedProjectsApi({
            onFail: (msg) => {
              errorNotify({ message: msg });
              setShared([]);
            },
            onSuccess: (data) => {
              setShared(data);
            },
          });
        }
      },
    });
  }, [setProjects, setShared]);

  return (
    <AppLayout navPreItems={projectNameItem} navItems={navbarItems} navPostItems={navbarSettings}>
      <Outlet />
    </AppLayout>
  );
}
