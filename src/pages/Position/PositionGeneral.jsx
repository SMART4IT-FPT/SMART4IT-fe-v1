import {
  Flex,
  Title,
  ActionIcon,
  Text,
  Button,
  Menu,
  Skeleton,
  Badge,
} from "@mantine/core";
import { IconDots, IconCalendarEvent } from "@tabler/icons-react";
import { DateInput } from "@mantine/dates";
import HeadingLayout from "../../components/Layout/HeadingLayout";
import PositionAction from "../../components/Actions/PositionAction";
import appStrings from "../../utils/strings";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import usePositionsState from "../../context/position";
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
  const [form, setForm] = useState({
    startDate: null,
    endDate: null,
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

  return (
    <Flex direction="column" gap="lg">
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
              isClose={position?.is_closed ? true : false}
              onDeleteTap={deletePositionTrigger}
              onCloseTap={handleClosePosition}
              onOpenTap={handleOpenPosition}
            />
          </Menu.Dropdown>
        </Menu>
      </HeadingLayout>
      {position ? (
        <Text size="lg">{position?.description}</Text>
      ) : (
        <Skeleton height={30} width={300} />
      )}
      {position ? (
        <Flex gap="lg">
          <DateInput
            rightSection={<IconCalendarEvent />}
            valueFormat="DD/MM/YYYY"
            label={appStrings.language.positionDetail.startDateLabel}
            placeholder="3/26/2024"
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
            placeholder="3/26/2025"
            size="sm"
            value={form.endDate}
            onChange={handleEndDateChange}
            minDate={form.startDate}
            style={{ flex: 1 }}
          />
        </Flex>
      ) : (
        <Skeleton height={50} />
      )}
    </Flex>
  );
}
