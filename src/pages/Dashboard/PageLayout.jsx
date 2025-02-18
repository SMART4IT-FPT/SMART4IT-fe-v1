import AppLayout from "../../components/Layout/AppLayout";
import {
  IconHome,
  IconHomeFilled,
  IconPerspective,
  IconShare,
  IconTrash,
  IconTrashFilled,
  IconSettings,
  IconSettingsFilled,
} from "@tabler/icons-react";
import appStrings from "../../utils/strings";

import useGlobalState from "../../context/global";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getCurrentUserApi } from "../../apis/auth";
import useNotification from "../../hooks/useNotification";

const navbarItems = [
  {
    label: appStrings.language.home.title,
    icon: <IconHome size="1rem" />,
    activeIcon: <IconHomeFilled size="1rem" />,
    to: "/dashboard",
  },
  {
    label: appStrings.language.yourProject.title,
    icon: <IconPerspective size="1rem" />,
    activeIcon: <IconPerspective size="1rem" />,
    to: "/dashboard/your-project",
  },
  {
    label: appStrings.language.sharedProjects.title,
    icon: <IconShare size="1rem" />,
    activeIcon: <IconShare size="1rem" />,
    to: "/dashboard/shared-project",
  },
  {
    label: appStrings.language.trashProjects.title,
    icon: <IconTrash size="1rem" />,
    activeIcon: <IconTrashFilled size="1rem" />,
    to: "/dashboard/deleted-project",
  },
];

const navbarSettings = [
  {
    label: appStrings.language.setting.title,
    icon: <IconSettings size="1rem" />,
    activeIcon: <IconSettingsFilled size="1rem" />,
    to: "/dashboard/setting",
  },
];

export default function DashboardPageLayout() {
  const navigate = useNavigate();
  const user = useGlobalState((state) => state.user);
  const setUser = useGlobalState((state) => state.setUser);
  const errorNotify = useNotification({ type: "error" });

  useEffect(() => {
    getCurrentUserApi({
      user: user,
      onFail: (msg) => {
        errorNotify({ message: msg });
        navigate("/login");
      },
      onSuccess: (user) => {
        setUser(user);
      },
    });
  }, [setUser]);

  return (
    <AppLayout navItems={navbarItems} navPostItems={navbarSettings}>
      <Outlet />
    </AppLayout>
  );
}
