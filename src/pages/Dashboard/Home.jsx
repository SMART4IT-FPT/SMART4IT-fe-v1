import { Flex, Title, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import HeadingLayout from "../../components/Layout/HeadingLayout";
import GridLayout from "../../components/Layout/GridLayout";
import ProjectCard from "../../components/ProjectCard";
import appStrings from "../../utils/strings";
import YourProjectAction from "../../components/Actions/YourProjectAction";
import CreateProjectDrawer from "../Drawer/CreateProjectDrawer";
import Empty from "../../components/Empty";

import { useEffect, useState } from "react";
import useGlobalState from "../../context/global";
import useProjectsState from "../../context/project";
import useNotification from "../../hooks/useNotification";
import {
  getYourProjectsApi,
  getSharedProjectsApi,
  getTrashProjectsApi,
} from "../../apis/dashboard";
import { deleteProjectApi, shareProjectApi } from "../../apis/projects";
import ShareProjectModal from "../Modal/ShareProjectModal";
import { findUsersByEmailApi } from "../../apis/user";

export default function HomePage() {
  const [isNewProjectOpen, newProjectToggle] = useDisclosure(false);
  const [isShareModalOpen, setIsShareModalOpen] = useDisclosure(false);
  const [selectedShareProject, setSelectedShareProject] = useState(null);
  const user = useGlobalState((state) => state.user);
  const projects = useProjectsState((state) => state.projects);
  const setProjects = useProjectsState((state) => state.setProjects);
  const shared = useProjectsState((state) => state.shared);
  const setShared = useProjectsState((state) => state.setShared);
  const setTrash = useProjectsState((state) => state.setTrash);
  const errorNotify = useNotification({ type: "error" });
  const successNotify = useNotification({ type: "success" });

  function handleDeleteProject(id) {
    // Delete project
    deleteProjectApi({
      id,
      onFail: (msg) => errorNotify({ message: msg }),
      onSuccess: () => {
        getYourProjectsApi({
          onFail: (msg) => {
            errorNotify({ message: msg });
            setProjects([]);
          },
          onSuccess: (data) => {
            successNotify({
              message:
                appStrings.language.yourProject.deleteProjectSuccessMessage,
            });
            setProjects(data);
          },
        });
        getTrashProjectsApi({
          onFail: (msg) => {
            errorNotify({ message: msg });
            setTrash([]);
          },
          onSuccess: (data) => setTrash(data),
        });
      },
    });
  }

  function handleShareProject(users) {
    if (selectedShareProject === null) return;
    shareProjectApi({
      ids: users.map((user) => user.id),
      projectId: projects[selectedShareProject].id,
      onFail: (msg) => errorNotify({ message: msg }),
      onSuccess: () => {
        successNotify({
          message: appStrings.language.share.shareProjectSuccessMessage,
        });
      },
    });
  }

  useEffect(() => {
    // Get your projects
    if (!projects) {
      getYourProjectsApi({
        onFail: (msg) => {
          errorNotify({ message: msg });
          setProjects([]);
        },
        onSuccess: (data) => setProjects(data),
      });
    }
    // Get shared projects
    if (!shared) {
      getSharedProjectsApi({
        onFail: (msg) => {
          errorNotify({ message: msg });
          setShared([]);
        },
        onSuccess: (data) => setShared(data),
      });
    }
  }, [setProjects, setShared]);

  return (
    <Flex direction="column" gap={30}>
      <HeadingLayout loading={!user}>
        <Title order={1}>
          {appStrings.language.home.welcome}
          {user?.name}
        </Title>
        <Flex>
          <Button
            leftSection={<IconPlus size="1rem" />}
            onClick={newProjectToggle.open}
          >
            {appStrings.language.home.createBtn}
          </Button>
        </Flex>
      </HeadingLayout>
      {projects?.length !== 0 ? (
        <GridLayout
          title={appStrings.language.home.recentProjects}
          loading={!projects}
        >
          {projects?.map((data, index) => (
            <ProjectCard
              key={index}
              id={data.id}
              title={data.name}
              description={data.description}
              alias={data.alias}
              members={data.members}
              actions={
                <YourProjectAction
                  onShareTap={() => {
                    setIsShareModalOpen.open();
                    setSelectedShareProject(index);
                  }}
                  onDeleteTap={() => handleDeleteProject(data.id)}
                />
              }
            />
          ))}
        </GridLayout>
      ) : !shared?.length ? (
        <Empty />
      ) : null}
      {shared?.length !== 0 ? (
        <GridLayout
          title={appStrings.language.home.sharedProjects}
          loading={!shared}
        >
          {shared?.map((data, index) => (
            <ProjectCard
              key={index}
              id={data.id}
              title={data.name}
              description={data.description}
              alias={data.alias}
              members={data.members}
            />
          ))}
        </GridLayout>
      ) : null}
      <CreateProjectDrawer
        open={isNewProjectOpen}
        onClose={newProjectToggle.close}
      />
      <ShareProjectModal
        open={isShareModalOpen}
        onClose={setIsShareModalOpen.close}
        onSearch={async (query) => findUsersByEmailApi(query)}
        onShare={handleShareProject}
      />
    </Flex>
  );
}
