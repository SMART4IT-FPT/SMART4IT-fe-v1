import { Title, Flex, Button, Input, Loader } from "@mantine/core";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import HeadingLayout from "../../components/Layout/HeadingLayout";
import GridLayout from "../../components/Layout/GridLayout";
import ProjectCard from "../../components/ProjectCard";
import CreateProjectDrawer from "../Drawer/CreateProjectDrawer";
import YourProjectAction from "../../components/Actions/YourProjectAction";
import Empty from "../../components/Empty";
import appStrings from "../../utils/strings";

import { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import useProjectsState from "../../context/project";
import { getYourProjectsApi, getTrashProjectsApi } from "../../apis/dashboard";
import { deleteProjectApi, shareProjectApi } from "../../apis/projects";
import useNotification from "../../hooks/useNotification";
import useSearch from "../../hooks/useSearch";
import ShareProjectModal from "../Modal/ShareProjectModal";
import { findUsersByEmailApi } from "../../apis/user";

export default function YourProjectPage() {
  const [isNewProjectOpen, isNewProjectToggle] = useDisclosure(false);
  const [isShareModalOpen, setIsShareModalOpen] = useDisclosure(false);
  const [selectedShareProject, setSelectedShareProject] = useState(null);
  const projects = useProjectsState((state) => state.projects);
  const setProjects = useProjectsState((state) => state.setProjects);
  const setTrash = useProjectsState((state) => state.setTrash);
  const errorNotify = useNotification({ type: "error" });
  const successNotify = useNotification({ type: "success" });

  function handleSearchProjects(query) {
    if (!query) return projects;
    const searchedProjects = projects.filter((project) =>
      project.name.toLowerCase().includes(query.toLowerCase())
    );
    return searchedProjects;
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

  const {
    search: currentProjects,
    isSearching,
    handleSearch,
  } = useSearch(projects, handleSearchProjects);

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
            errorNotify(msg);
            setTrash([]);
          },
          onSuccess: (data) => setTrash(data),
        });
      },
    });
  }

  useEffect(() => {
    if (!projects) {
      getYourProjectsApi({
        onFail: (msg) => {
          errorNotify(msg);
          setProjects([]);
        },
        onSuccess: (data) => setProjects(data),
      });
    }
  }, [setProjects]);

  return (
    <Flex direction="column" gap={30}>
      <HeadingLayout loading={!currentProjects}>
        <Title order={2}>{appStrings.language.yourProject.heading}</Title>
        <Flex gap={15}>
          <Input
            placeholder={appStrings.language.yourProject.searchPlaceholder}
            leftSection={
              isSearching ? <Loader size="1rem" /> : <IconSearch size="1rem" />
            }
            onChange={(e) => handleSearch(e.currentTarget.value)}
          />
          <Button
            leftSection={<IconPlus size="1rem" />}
            onClick={isNewProjectToggle.open}
          >
            {appStrings.language.yourProject.createBtn}
          </Button>
        </Flex>
      </HeadingLayout>
      {currentProjects?.length !== 0 ? (
        <GridLayout loading={!currentProjects}>
          {currentProjects?.map((data, index) => (
            <ProjectCard
              key={data.id}
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
      ) : (
        <Empty />
      )}
      <CreateProjectDrawer
        open={isNewProjectOpen}
        onClose={isNewProjectToggle.close}
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
