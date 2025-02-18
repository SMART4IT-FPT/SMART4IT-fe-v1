import {
  Drawer,
  Flex,
  TextInput,
  Textarea,
  Button,
  Title,
  Container,
} from "@mantine/core";
import appStrings from "../../utils/strings";

import { v4 as uuidv4 } from "uuid";
import { getAliasByName } from "../../utils/utils";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProjectApi } from "../../apis/projects";
import useProjectsState from "../../context/project";
import useNotification from "../../hooks/useNotification";

export default function CreateProjectDrawer({ open, onClose }) {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const addProject = useProjectsState((state) => state.addProject);
  const idAlias = useRef(uuidv4());
  const errorNotify = useNotification({ type: "error" });

  const handleInputChange = (event) => {
    setProjectName(event.target.value);
  };

  function handleCreateProject() {
    const alias = getAliasByName(projectName, idAlias.current);
    setIsLoading(true);
    createProjectApi({
      name: projectName,
      alias,
      description,
      onFail: (msg) => {
        setIsLoading(false);
        errorNotify({ message: msg });
      },
      onSuccess: (project) => {
        addProject(project);
        setIsLoading(false);
        navigate(`/${project.id}`);
      },
    });
  }

  return (
    <Drawer opened={open} onClose={onClose} size="100%" position="right">
      <Container size="xs" h={50} mt="md">
        <Flex
          gap="lg"
          justify="center"
          align="center"
          direction="column"
          wrap="wrap"
        >
          <Title order={1} style={{ width: "100%" }}>
            {appStrings.language.createProject.title}
          </Title>
          <TextInput
            label={appStrings.language.createProject.nameLabel}
            placeholder={appStrings.language.createProject.nameLabel}
            variant="filled"
            style={{ width: "100%" }}
            onChange={handleInputChange}
            value={projectName}
            required
          />
          <TextInput
            disabled
            label={appStrings.language.createProject.aliasLabel}
            placeholder={appStrings.language.createProject.aliasLabel}
            style={{ width: "100%" }}
            value={getAliasByName(projectName, idAlias.current)}
          />
          <Textarea
            variant="filled"
            label={appStrings.language.createProject.descriptionLabel}
            placeholder={appStrings.language.createProject.descriptionLabel}
            style={{ width: "100%" }}
            onChange={(event) => setDescription(event.target.value)}
            value={description}
          />
        </Flex>
        <Flex justify="flex-end" gap="md" style={{ marginTop: "20px" }}>
          <Button variant="default" onClick={onClose}>
            {appStrings.language.btn.cancel}
          </Button>
          <Button
            onClick={handleCreateProject}
            loading={isLoading}
            disabled={!projectName}
          >
            {appStrings.language.btn.create}
          </Button>
        </Flex>
      </Container>
    </Drawer>
  );
}
