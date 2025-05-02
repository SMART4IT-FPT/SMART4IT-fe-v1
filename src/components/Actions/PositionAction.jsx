import { Fragment } from "react";
import { Menu, Button } from "@mantine/core"; // Đảm bảo rằng Menu được sử dụng chính xác
import { IconTrash, IconArchive, IconArchiveOff, IconDownload } from "@tabler/icons-react"; // Import IconDownload
import { useNavigate } from "react-router-dom";
import appStrings from "../../utils/strings";


export default function PositionAction({
  isClose,
  onCloseTap,
  onOpenTap,
  onDeleteTap,
  onDownloadTap,
  positionId,
  projectId,
}) {
  const navigate = useNavigate();

  const handleDashboardClick = () => {
    navigate(`/${projectId}/${positionId}/dashboard`);
  };

  return (
    <Fragment>
      <Menu.Item
        leftSection={
          isClose ? <IconArchiveOff size="1rem" /> : <IconArchive size="1rem" />
        }
        onClick={isClose ? onOpenTap : onCloseTap}
      >
        {isClose ? appStrings.language.btn.open : appStrings.language.btn.close}
      </Menu.Item>
      <Menu.Item
        c="red"
        leftSection={<IconTrash size="1rem" />}
        onClick={onDeleteTap}
      >
        {appStrings.language.btn.delete}
      </Menu.Item>
      <Menu.Item
        leftSection={<IconDownload size="1rem" />}
        onClick={onDownloadTap} 
      >
        {appStrings.language.position.downloadSummary}
      </Menu.Item>
    </Fragment>
  );
}
