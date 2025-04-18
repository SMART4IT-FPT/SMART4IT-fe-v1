import {
  Flex,
  Title,
  ActionIcon,
  Text,
  Menu,
  Badge,
  NumberInput,
  Divider,
  Group,
  Paper,
  ScrollArea,
  Modal,
} from "@mantine/core";
import { IconDots, IconCalendarEvent, IconSettings } from "@tabler/icons-react";
import { DateInput } from "@mantine/dates";
import HeadingLayout from "../../components/Layout/HeadingLayout";
import PositionAction from "../../components/Actions/PositionAction";
import appStrings from "../../utils/strings";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import usePositionsState from "../../context/position";
import useWeightState from "../../context/weight"; // ✅ NEW: to sync weight globally
import {
  closePositionApi,
  deletePositionApi,
  openPositionApi,
} from "../../apis/positions";
import useNotification from "../../hooks/useNotification";
import useConfirmModal from "../../hooks/useConfirmModal";


export default function PositionGeneralPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const projectId = location.pathname.split("/")[1];
  const positionId = location.pathname.split("/")[2];
  const position = usePositionsState((state) => state.position);
  const setWeights = useWeightState((state) => state.setWeights); // Lấy setWeights từ context


  const [form, setForm] = useState({ startDate: null, endDate: null });
  const [openedModal, setOpenedModal] = useState(null);
  const [cvWeights, setCvWeights] = useState({
    education_score_config: { W_education_score: 0.05 },
    language_skills_score_config: { W_language_skills_score: 0.1 },
    technical_skills_score_config: { W_technical_skills_score: 0.3 },
    work_experience_score_config: {
      W_work_experience_score: 0.4,
      relevance_score_w: 0.6,
      duration_score_w: 0.2,
      responsibilities_score_w: 0.2,
    },
    personal_projects_score_config: {
      W_personal_projects_score: 0.2,
      relevance_score_w: 0.6,
      technologies_score_w: 0.2,
      responsibilities_score_w: 0.2,
    },
    publications_score_config: { W_publications_score: 0.05 },
  });

  const errorNotify = useNotification({ type: "error" });
  const successNotify = useNotification({ type: "success" });

  function handleStartDateChange(value) {
    setForm({ ...form, startDate: value });
  }

  function handleEndDateChange(value) {
    setForm({ ...form, endDate: value });
  }

  function handleClosePosition() {
    closePositionApi({
      projectId,
      positionId,
      onFail: (msg) => errorNotify({ message: msg }),
      onSuccess: (_) => {
        successNotify({
          message: appStrings.language.position.closeSuccessMessage,
        });
        position.is_closed = true;
      },
    });
  }

  function handleOpenPosition() {
    openPositionApi({
      projectId,
      positionId,
      onFail: (msg) => errorNotify({ message: msg }),
      onSuccess: (_) => {
        successNotify({
          message: appStrings.language.position.openSuccessMessage,
        });
        position.is_closed = false;
      },
    });
  }

  function handleDeletePosition() {
    deletePositionApi({
      projectId,
      positionId,
      onFail: (msg) => errorNotify({ message: msg }),
      onSuccess: (_) => {
        successNotify({
          message: appStrings.language.position.deleteSuccessMessage,
        });
        navigate(`/${projectId}`);
      },
    });
  }

  const deletePositionTrigger = useConfirmModal({
    type: "delete",
    onOk: handleDeletePosition,
  });

  useEffect(() => {
    if (position) {
      setForm({
        startDate: new Date(position.start_date),
        endDate: new Date(position.end_date),
      });
    }
  }, [position]);

  useEffect(() => {
    setWeights(cvWeights);  
  }, [cvWeights, setWeights]);
  
  

  const renderMainWeightInput = (label, value, onChange, modalKey) => (
    <NumberInput
      label={label}
      value={value}
      onChange={onChange}
      step={0.01}
      min={0}
      max={1}
      precision={2}
      hideControls
      w={140}
      rightSection={
        modalKey && (
          <ActionIcon
            onClick={() => setOpenedModal(modalKey)}
            variant="subtle"
            size="sm"
            color="blue"
          >
            <IconSettings size={16} />
          </ActionIcon>
        )
      }
    />
  );

  return (
    <ScrollArea h="calc(100vh - 80px)" type="auto" offsetScrollbars>
      <Flex direction="column" gap="lg" p="md">
        <HeadingLayout loading={!position}>
          <Flex align="center">
            <Title order={1}>{position?.name}</Title>
            <Badge
              variant="light"
              color={position?.is_closed ? "red" : "green"}
              style={{ marginLeft: 20 }}
            >
              {position?.is_closed
                ? appStrings.language.positionDetail.closedLabel
                : appStrings.language.positionDetail.activeLabel}
            </Badge>
          </Flex>
          <Menu withinPortal shadow="md" position="bottom-end" width={150}>
            <Menu.Target>
              <ActionIcon variant="light" color="gray">
                <IconDots />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <PositionAction
                isClose={position?.is_closed ?? false}
                onDeleteTap={deletePositionTrigger}
                onCloseTap={handleClosePosition}
                onOpenTap={handleOpenPosition}
              />
            </Menu.Dropdown>
          </Menu>
        </HeadingLayout>

        <Text size="lg">{position?.description}</Text>

        <Flex gap="lg">
          <DateInput
            rightSection={<IconCalendarEvent />}
            valueFormat="DD/MM/YYYY"
            label={appStrings.language.positionDetail.startDateLabel}
            placeholder="3/26/2025"
            size="sm"
            value={form.startDate}
            onChange={handleStartDateChange}
            maxDate={form.endDate}
            style={{ flex: 1 }}
          />
          <DateInput
            rightSection={<IconCalendarEvent />}
            valueFormat="DD/MM/YYYY"
            label={appStrings.language.positionDetail.endDateLabel}
            placeholder="3/26/2026"
            size="sm"
            value={form.endDate}
            onChange={handleEndDateChange}
            minDate={form.startDate}
            style={{ flex: 1 }}
          />
        </Flex>

        <Divider my="md" label={appStrings.language.positionDetail.weightConfigureLabel} labelPosition="left" />

        <Paper withBorder shadow="xs" p="md" radius="md">
          <Group gap="lg" wrap="wrap">
            {renderMainWeightInput(
              <label>{appStrings.language.positionDetail.education}</label>, 
              cvWeights.education_score_config.W_education_score, (val) => setCvWeights((prev) => ({ ...prev, education_score_config: { ...prev.education_score_config, W_education_score: val } })))}

            {renderMainWeightInput(
              <label>{appStrings.language.positionDetail.language}</label>, 
              cvWeights.language_skills_score_config.W_language_skills_score, (val) => setCvWeights((prev) => ({ ...prev, language_skills_score_config: { ...prev.language_skills_score_config, W_language_skills_score: val } })))}

            {renderMainWeightInput(
              <label>{appStrings.language.positionDetail.technical}</label>, 
              cvWeights.technical_skills_score_config.W_technical_skills_score, (val) => setCvWeights((prev) => ({ ...prev, technical_skills_score_config: { ...prev.technical_skills_score_config, W_technical_skills_score: val } })))}

            {renderMainWeightInput(
              <label>{appStrings.language.positionDetail.experience}</label>,
              cvWeights.work_experience_score_config.W_work_experience_score, (val) => setCvWeights((prev) => ({ ...prev, work_experience_score_config: { ...prev.work_experience_score_config, W_work_experience_score: val } })), "experience")}
            {renderMainWeightInput(
              <label>{appStrings.language.positionDetail.personalProject}</label>,
               cvWeights.personal_projects_score_config.W_personal_projects_score, (val) => setCvWeights((prev) => ({ ...prev, personal_projects_score_config: { ...prev.personal_projects_score_config, W_personal_projects_score: val } })), "projects")}
            {renderMainWeightInput(
              <label>{appStrings.language.positionDetail.publication}</label>,
              cvWeights.publications_score_config.W_publications_score, (val) => setCvWeights((prev) => ({ ...prev, publications_score_config: { ...prev.publications_score_config, W_publications_score: val } })))}
          </Group>
        </Paper>

        <Modal title={appStrings.language.positionDetail.workExperienceDetail} opened={openedModal === "experience"} onClose={() => setOpenedModal(null)}>
          <Flex direction="column" gap="sm">
            <NumberInput label={appStrings.language.positionDetail.relevan} value={cvWeights.work_experience_score_config.relevance_score_w} onChange={(val) => setCvWeights((prev) => ({ ...prev, work_experience_score_config: { ...prev.work_experience_score_config, relevance_score_w: val } }))} min={0} max={1} step={0.01} precision={2} />
            <NumberInput label={appStrings.language.positionDetail.duration} value={cvWeights.work_experience_score_config.duration_score_w} onChange={(val) => setCvWeights((prev) => ({ ...prev, work_experience_score_config: { ...prev.work_experience_score_config, duration_score_w: val } }))} min={0} max={1} step={0.01} precision={2} />
            <NumberInput label={appStrings.language.positionDetail.responsibilities} value={cvWeights.work_experience_score_config.responsibilities_score_w} onChange={(val) => setCvWeights((prev) => ({ ...prev, work_experience_score_config: { ...prev.work_experience_score_config, responsibilities_score_w: val } }))} min={0} max={1} step={0.01} precision={2} />
          </Flex>
        </Modal>

        <Modal title={appStrings.language.positionDetail.personalProjectDetail} opened={openedModal === "projects"} onClose={() => setOpenedModal(null)}>
          <Flex direction="column" gap="sm">
            <NumberInput label={appStrings.language.positionDetail.relevan} value={cvWeights.personal_projects_score_config.relevance_score_w} onChange={(val) => setCvWeights((prev) => ({ ...prev, personal_projects_score_config: { ...prev.personal_projects_score_config, relevance_score_w: val } }))} min={0} max={1} step={0.01} precision={2} />
            <NumberInput label={appStrings.language.positionDetail.technologies} value={cvWeights.personal_projects_score_config.technologies_score_w} onChange={(val) => setCvWeights((prev) => ({ ...prev, personal_projects_score_config: { ...prev.personal_projects_score_config, technologies_score_w: val } }))} min={0} max={1} step={0.01} precision={2} />
            <NumberInput label={appStrings.language.positionDetail.responsibilities} value={cvWeights.personal_projects_score_config.responsibilities_score_w} onChange={(val) => setCvWeights((prev) => ({ ...prev, personal_projects_score_config: { ...prev.personal_projects_score_config, responsibilities_score_w: val } }))} min={0} max={1} step={0.01} precision={2} />
          </Flex>
        </Modal>
      </Flex>
    </ScrollArea>
  );
}
