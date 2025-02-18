import { Flex, Title, Button } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import HeadingLayout from "../../components/Layout/HeadingLayout";
import ProjectGridLayout from "../../components/Layout/GridLayout";
import ProjectCard from "../../components/ProjectCard";
import Empty from "../../components/Empty";
import DeleteProjectAction from "../../components/Actions/DeletedProjectAction";
import appStrings from "../../utils/strings";

import { useEffect } from "react";
import { getTrashProjectsApi, getYourProjectsApi } from "../../apis/dashboard";
import useProjectsState from "../../context/project";
import {
  restoreProjectApi,
  deletePermanentlyProjectApi,
} from "../../apis/projects";
import useNotification from "../../hooks/useNotification";
import useConfirmModal from "../../hooks/useConfirmModal";

export default function TrashPage() {
  const setProjects = useProjectsState((state) => state.setProjects);
  const trash = useProjectsState((state) => state.trash);
  const setTrash = useProjectsState((state) => state.setTrash);
  const errorNotify = useNotification({ type: "error" });
  const successNotify = useNotification({ type: "success" });

  function handleDeletePermanently(id) {
    deletePermanentlyProjectApi({
      id,
      onFail: (msg) => errorNotify({ message: msg }),
      onSuccess: () => {
        getTrashProjectsApi({
          onFail: (msg) => {
            errorNotify({ message: msg });
            setTrash([]);
          },
          onSuccess: (data) => {
            successNotify({
              message:
                appStrings.language.trashProjects
                  .deletePermanentlySuccessMessage,
            });
            setTrash(data);
          },
        });
        getYourProjectsApi({
          onFail: (msg) => {
            errorNotify({ message: msg });
            setProjects([]);
          },
          onSuccess: (data) => setProjects(data),
        });
      },
    });
  }

  const triggerDeletePermanentlyConfirm = useConfirmModal({
    type: "delete",
    onOk: handleDeletePermanently,
  });

  function handleRestoreProject(id) {
    restoreProjectApi({
      id,
      onFail: (msg) => errorNotify({ message: msg }),
      onSuccess: () => {
        getTrashProjectsApi({
          onFail: (msg) => {
            errorNotify({ message: msg });
            setTrash([]);
          },
          onSuccess: (data) => {
            successNotify({
              message:
                appStrings.language.trashProjects.restoreProjectSuccessMessage,
            });
            setTrash(data);
          },
        });
        getYourProjectsApi({
          onFail: (msg) => {
            errorNotify({ message: msg });
            setProjects([]);
          },
          onSuccess: (data) => setProjects(data),
        });
      },
    });
  }

  useEffect(() => {
    if (!trash) {
      getTrashProjectsApi({
        onFail: (msg) => {
          errorNotify({ message: msg });
          setTrash([]);
        },
        onSuccess: (data) => setTrash(data),
      });
    }
  }, [setTrash]);

  return (
    <Flex direction="column" gap={30}>
      <HeadingLayout loading={!trash}>
        <Title order={2}>{appStrings.language.trashProjects.heading}</Title>
        <Flex>
          <Button color="red" leftSection={<IconTrash size="1rem" />}>
            {appStrings.language.trashProjects.deletePermanentlyBtn}
          </Button>
        </Flex>
      </HeadingLayout>
      {trash?.length !== 0 ? (
        <ProjectGridLayout loading={!trash}>
          {trash?.map((data) => (
            <ProjectCard
              key={data.id}
              title={data.name}
              description={data.description}
              alias={data.alias}
              actions={
                <DeleteProjectAction
                  onRestoreTap={() => handleRestoreProject(data.id)}
                  onPurgeTap={() => triggerDeletePermanentlyConfirm(data.id)}
                />
              }
              disableNavigate
            />
          ))}
        </ProjectGridLayout>
      ) : (
        <Empty />
      )}
    </Flex>
  );
}
