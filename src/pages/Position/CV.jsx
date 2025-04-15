import {
  Flex,
  Title,
  ActionIcon,
  Text,
  Input,
  Button,
  Alert,
  Tooltip,
  CopyButton,
  Spoiler,
  Badge,
  Loader,
  Popover,
  Slider,
  Select,
} from "@mantine/core";
import {
  IconTrash,
  IconEye,
  IconSearch,
  IconCheck,
  IconCopy,
  IconShare3,
  IconSparkles,
  IconChevronUp,
  IconChevronDown,
  IconFileTypePdf,
  IconFileTypeDocx,
  IconFile,
  IconAdjustments,
} from "@tabler/icons-react";
import HeadingLayout from "../../components/Layout/HeadingLayout";
import UploadZone from "../../components/Upload/UploadZone";
import appStrings from "../../utils/strings";
import ProgressList from "../../components/Upload/ProgressList";
import AppTable from "../../components/AppTable";

import { useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  deleteCVDataApi,
  getCVsApi,
  uploadCVDataApi,
  watchUploadProgressApi,
  rematchCVDataApi,
} from "../../apis/cv";
import usePositionsState from "../../context/position";
import useCVState from "../../context/cv";
import useNotification from "../../hooks/useNotification";
import {
  formatDate,
  getShareUploadUrl,
} from "../../utils/utils";
import useInterval from "../../hooks/useInterval";
import useSearch from "../../hooks/useSearch";
import useConfirmModal from "../../hooks/useConfirmModal";
import useWeightState from "../../context/weight";




const LABELS = [
  "Database_Administrator",
  "Front_End_Developer",
  "Java_Developer",
  "Network_Administrator",
  "Project_manager",
  "Python_Developer",
  "Security_Analyst",
  "Software_Developer",
  "Systems_Administrator",
  "Web_Developer",
];


export default function CVPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const projectId = location.pathname.split("/")[1];
  const positionId = location.pathname.split("/")[2];
  const position = usePositionsState((state) => state.position);
  const cvs = useCVState((state) => state.cvs);
  const setCVs = useCVState((state) => state.setCVs);
  const uploadFiles = useCVState((state) => state.uploadFiles);
  const setUploadFiles = useCVState((state) => state.setUploadFiles);
  const [sortOrder, setSortOrder] = useState("desc"); // "asc" | "desc"
  const [labelFilter, setLabelFilter] = useState(null);
  const weights = useWeightState((state) => state.weights); // Đảm bảo weights đã được lấy từ context
  const [isRematching, setIsRematching] = useState(false); // cho Rematch riêng



  const columns = [
    {
      key: "cvName",
      label: appStrings.language.cv.tableCVName,
    },
    {
      key: "upload",
      label: appStrings.language.cv.tableUploadDate,
    },
    {
      key: "label",
      label: "Label",
    },
    {
      key: "componentScores",
      label: "Component Scores",
    },
    {
      key: "overallScore",
      label: (
        <Flex align="center" gap={4}>
          <Text style={{ fontWeight: "bold" }}>Overall Score</Text>
          <Tooltip label={`Sort ${sortOrder === "asc" ? "Descending" : "Ascending"}`} withArrow>
            <ActionIcon
              variant="subtle"
              size="xs"
              onClick={() =>
                setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
              }
            >
              <Flex direction="column" align="center" justify="center" gap={0} style={{ lineHeight: 1 }}>
                <IconChevronUp
                  size="0.75rem"
                  color={sortOrder === "desc" ? "gray" : "black"}
                  style={{ marginBottom: "-2px" }}
                />
                <IconChevronDown
                  size="0.75rem"
                  color={sortOrder === "asc" ? "gray" : "black"}
                />
              </Flex>
            </ActionIcon>
          </Tooltip>
        </Flex>
      ),
    },
    {
      key: "actions",
      label: appStrings.language.cv.tableAction,
    },
  ];

  const [isUploading, setIsUploading] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const [progressObject, setProgressObject] = useState({});
  const [adjustment, setAdjustment] = useState({
    limit: 20,
    threshold: 0.6,
  });
  const [cvScores, setCvScores] = useState({}); // Initialize cvScores state
  const errorNotify = useNotification({ type: "error" });
  const successNotify = useNotification({ type: "success" });
  const intervalFunction = useInterval(500);

  function handleSearchCVs(query) {
    if (!query) return cvs;
    const searchedCVs = cvs.filter((cv) =>
      cv.cvName.toLowerCase().includes(query.toLowerCase())
    );
    return searchedCVs;
  }

  const { search, isSearching, handleSearch } = useSearch(cvs, handleSearchCVs);

  function handleNavigateToCVDetail(cvId) {
    navigate(`/${projectId}/${positionId}/cv/${cvId}`);
  }

  const _isProgressComplete = useCallback((progressObject) => {
    if (!progressObject) return true;
    return (
      Object.keys(progressObject).length &&
      Object.values(progressObject).every((percent) => percent >= 100)
    );
  });

  function handleUploadFiles(files) {
    if (!weights) {
      console.error("Trọng số chưa được lưu!");
      return;
    }

    setUploadFiles(files);
    console.log("Đang upload CV với trọng số:", weights);

    uploadCVDataApi({
      projectId,
      positionId,
      files,
      weights,
      onFail: (msg) => {
        errorNotify({ message: msg });
        setUploadFiles(null);
      },
      onSuccess: (data) => {
        const initProgressObject = {};
        files.forEach((file) => {
          initProgressObject[file.name] = 0;
        });
        setProgressObject(initProgressObject);

        // Giới hạn cập nhật trạng thái để tránh log liên tục
        intervalFunction({
          callback: (stop) => {
            if (!isUploading) {
              setIsUploading(true);
            }
            watchUploadProgressApi(data.progress_id).then((progressData) => {
              if (progressData?.percent) {
                setProgressObject((prev) => ({
                  ...prev,
                  ...progressData?.percent,
                }));
              }
              if (_isProgressComplete(progressData?.percent)) {
                stop();
                setIsUploading(false);
                successNotify({
                  message: appStrings.language.cv.uploadSuccessMessage,
                });
              }
            });
          },
        });
      },
    });
  }



  async function handleMatchCVJD() {
    if (!search.length) {
      errorNotify({
        message: appStrings.language.cv.noCVError,
      });
      return;
    }

    setIsMatching(true);

    const scores = {};

    try {
      // Fetch all CVs using getCVsApi
      getCVsApi({
        projectId,
        positionId,
        onSuccess: (cvData) => {
          // Map through each CV to fetch their individual scores
          cvData.forEach((cv) => {
            const matchingResult = cv.matching?.overall_result || {};

            scores[cv.id] = {
              educationScore: matchingResult.education_score || 0,
              languageScore: matchingResult.language_skills_score || 0,
              technicalScore: matchingResult.technical_skills_score || 0,
              experienceScore: matchingResult.work_experience_score || 0,
              overallScore: matchingResult.overall_score || 0,
              personalProjectsScore: matchingResult.personal_projects_score || 0,
              publicationsScore: matchingResult.publications_score || 0,
            };
          });

          // Set the fetched scores in the state
          setCvScores(scores);
          setIsMatching(false);
          successNotify({
            title: appStrings.language.cv.matchSuccessTitle,
            message: appStrings.language.cv.matchSuccessMessage,
          });
        },
        onFail: (error) => {
          console.error("Error fetching CV data:", error);
          errorNotify({
            message: "Error fetching CVs or scores.",
          });
          setIsMatching(false);
        },
      });
    } catch (error) {
      console.error("Error fetching CV data:", error);
      errorNotify({
        message: "Error fetching CVs or scores.",
      });
      setIsMatching(false);
    }
  }

  async function handleRematchCVs() {
    if (!weights) {
      errorNotify({ message: "Vui lòng cấu hình trọng số trước." });
      return;
    }
  
    setIsRematching(true); // 👈 dùng riêng
  
    await rematchCVDataApi({
      projectId,
      positionId,
      weights,
      onFail: (msg) => {
        errorNotify({ message: msg });
        setIsRematching(false); // 👈
      },
      onSuccess: (result) => {
        successNotify({
          title: "Cập nhật điểm thành công!",
          message: "Tất cả CV đã được rematch lại.",
        });
  
        getCVsApi({
          projectId,
          positionId,
          onFail: () => setCVs([]),
          onSuccess: (cvs) => {
            const formatedCVs = cvs.map((cv) => ({
              id: cv.id,
              cvName: cv.name,
              upload: cv.upload_at,
              labels: (cv.labels || []).map((l) => l.toLowerCase()),
            }));
            setCVs(formatedCVs);
          },
        });
  
        setIsRematching(false); // 👈
      },
    });
  }
  


  function handleDeleteCV(id) {
    deleteCVDataApi({
      projectId,
      positionId,
      cvId: id,
      onFail: (msg) => {
        errorNotify({ message: msg });
      },
      onSuccess: () => {
        successNotify({
          message: appStrings.language.cv.deleteCVSuccessMessage,
        });
        setCVs((prev) => prev.filter((cv) => cv.id !== id));
      },
    });
  }

  const deleteCVTrigger = useConfirmModal({
    type: "delete",
    onOk: handleDeleteCV,
  });

  useEffect(() => {
    if (!projectId || !positionId) return;

    getCVsApi({
      projectId,
      positionId,
      onFail: (msg) => {
        errorNotify({ message: msg });
        setCVs([]);
      },
      onSuccess: (cvs) => {
        if (cvs.length === 0) return;
        const formatedCVs = cvs.map((cv) => ({
          id: cv.id,
          cvName: cv.name,
          upload: cv.upload_at,
          labels: (cv.labels || []).map((l) => l.toLowerCase()),
        }));
        setCVs(formatedCVs);
      },
    });
  }, [projectId, positionId]);

  return (
    <Flex direction="column" gap="md">
      <HeadingLayout>
        <Title order={1}>{appStrings.language.cv.title}</Title>
      </HeadingLayout>
      <Spoiler
        initialState={true}
        maxHeight={0}
        showLabel={
          <Flex align="center" gap="xs">
            <Text>{appStrings.language.cv.showUploadZone}</Text>
            <IconChevronDown size="1rem" />
          </Flex>
        }
        hideLabel={
          <Flex align="center" gap="xs">
            <Text c="dimmed">{appStrings.language.cv.hideUploadZone}</Text>
            <IconChevronUp size="1rem" color="gray" />
          </Flex>
        }
      >
        <Flex direction="column" gap="md">
          {uploadFiles ? (
            <ProgressList
              items={progressObject}
              isClosable={!isUploading}
              onClose={() => setUploadFiles(null)}
            />
          ) : (
            <UploadZone onFileSelected={(files) => handleUploadFiles(files)} />
          )}
          <Alert
            variant="light"
            color="grape"
            title={appStrings.language.cv.shareUrlTitle}
            icon={<IconShare3 />}
          >
            <Flex align="center" gap="xs">
              {appStrings.language.cv.shareUrlMessage}
              <CopyButton value={getShareUploadUrl(positionId)} timeout={2000}>
                {({ copied, copy }) => (
                  <Tooltip
                    label={
                      copied
                        ? appStrings.language.btn.copied
                        : appStrings.language.btn.copy
                    }
                    withArrow
                    position="right"
                  >
                    <ActionIcon
                      color={copied ? "teal" : "gray"}
                      variant="subtle"
                      onClick={copy}
                    >
                      {copied ? (
                        <IconCheck size="1rem" />
                      ) : (
                        <IconCopy size="1rem" />
                      )}
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
            </Flex>
          </Alert>
        </Flex>
      </Spoiler>
      <Flex align="center" gap="md">
        <Flex gap="md" flex={1}>
          <Input
            placeholder={appStrings.language.cv.searchPlaceholder}
            leftSection={
              isSearching ? <Loader size="1rem" /> : <IconSearch size="1rem" />
            }
            onChange={(e) => handleSearch(e.target.value)}
          />
        </Flex>
        <Popover width={300} position="top">
          <Popover.Target>
            <ActionIcon variant="subtle" color="gray">
              <IconAdjustments size="1rem" />
            </ActionIcon>
          </Popover.Target>
          <Popover.Dropdown>
            <Flex direction="column" gap="sm">
              <Text>{appStrings.language.cv.adjustLimit}</Text>
              <Slider
                min={0}
                max={cvs?.length * 10}
                defaultValue={adjustment.limit}
                onChangeEnd={(value) =>
                  setAdjustment((prev) => ({ ...prev, limit: value }))
                }
              />
              <Text>{appStrings.language.cv.adjustThreshold}</Text>
              <Slider
                min={0}
                max={1}
                step={0.005}
                defaultValue={adjustment.threshold}
                onChangeEnd={(value) =>
                  setAdjustment((prev) => ({ ...prev, threshold: value }))
                }
              />
            </Flex>
          </Popover.Dropdown>
        </Popover>
        <Select
          placeholder="Filter by Label"
          data={LABELS.map((label) => ({
            value: label.toLowerCase(),
            label: label.replace(/_/g, " "),
          }))}
          clearable
          value={labelFilter}
          onChange={setLabelFilter}
          style={{ width: 220 }}
        />
        <Button
          leftSection={<IconSparkles size="1rem" />}
          variant="outline"
          color="blue"
          onClick={handleRematchCVs}
          loading={isRematching}
          disabled={isUploading}
        >
          Rematch
        </Button>

        <Button
          leftSection={<IconSparkles size="1rem" />}
          onClick={handleMatchCVJD}
          loading={isMatching}
          disabled={isUploading}
        >
          {appStrings.language.cv.matchBtn}
        </Button>
      </Flex>
      <AppTable
        columns={columns}
        loading={!search}
        data={(Array.isArray(search) ? [...search] : [])
          .filter((cv) => {
            if (!labelFilter) return true;
            return (cv.labels || []).some(
              (lb) => lb.toLowerCase().replace(/ /g, "_") === labelFilter.toLowerCase()
            );
          })
          .sort((a, b) => {
            const scoreA = cvScores[a.id]?.overallScore || 0;
            const scoreB = cvScores[b.id]?.overallScore || 0;
            return sortOrder === "asc" ? scoreA - scoreB : scoreB - scoreA;
          })
          .map((data) => {
            const scores = cvScores[data.id] || {};  // This will fallback to an empty object if scores are not yet available
            const label = data.label || "No Label";  // Default to "No Label" if label is not available

            // Ensure that we don't attempt to call .toFixed() on undefined or null values
            const educationScore = scores.educationScore || 0;
            const languageScore = scores.languageScore || 0;
            const technicalScore = scores.technicalScore || 0;
            const experienceScore = scores.experienceScore || 0;
            const overallScore = scores.overallScore || 0; // Default to 0 if undefined
            const personalProjectsScore = scores.personalProjectsScore || 0;
            const publicationsScore = scores.publicationsScore || 0;

            return {
              cvName: (
                <Flex align="center" gap="md">
                  {data.cvName.toLowerCase().includes(".pdf") ? (
                    <IconFileTypePdf size="1rem" color="#E03131" />
                  ) : data.cvName.toLowerCase().includes(".docx") ? (
                    <IconFileTypeDocx size="1rem" color="#3B5BDB" />
                  ) : (
                    <IconFile size="1rem" />
                  )}
                  <Text>{data.cvName}</Text>
                </Flex>
              ),
              upload: (
                <Text size="md">
                  {formatDate(data.upload, true)}
                </Text>
              ),
              componentScores: (
                <Flex direction="column" gap="sm">
                  <Flex align="center" gap="xs">
                    <Text size="md">Education Score:</Text>
                    <Badge
                      color={educationScore === 0 ? "gray" : educationScore >= 66 ? "green" : educationScore >= 33 ? "orange" : "red"}
                      variant="filled"
                      size="lg"
                    >
                      {educationScore}
                    </Badge>
                  </Flex>
                  <Flex align="center" gap="xs">
                    <Text size="md">Language Score:</Text>
                    <Badge
                      color={languageScore === 0 ? "gray" : languageScore >= 66 ? "green" : languageScore >= 33 ? "orange" : "red"}
                      variant="filled"
                      size="lg"
                    >
                      {languageScore}
                    </Badge>
                  </Flex>
                  <Flex align="center" gap="xs">
                    <Text size="md">Technical Score:</Text>
                    <Badge
                      color={technicalScore === 0 ? "gray" : technicalScore >= 66 ? "green" : technicalScore >= 33 ? "orange" : "red"}
                      variant="filled"
                      size="lg"
                    >
                      {technicalScore}
                    </Badge>
                  </Flex>
                  <Flex align="center" gap="xs">
                    <Text size="md">Experience Score:</Text>
                    <Badge
                      color={experienceScore === 0 ? "gray" : experienceScore >= 66 ? "green" : experienceScore >= 33 ? "orange" : "red"}
                      variant="filled"
                      size="lg"
                    >
                      {experienceScore}
                    </Badge>
                  </Flex>
                  <Flex align="center" gap="xs">
                    <Text size="md">Personal Projects Score:</Text>
                    <Badge
                      color={personalProjectsScore === 0 ? "gray" : personalProjectsScore >= 66 ? "green" : personalProjectsScore >= 33 ? "orange" : "red"}
                      variant="filled"
                      size="lg"
                    >
                      {personalProjectsScore}
                    </Badge>
                  </Flex>
                  <Flex align="center" gap="xs">
                    <Text size="md">Publications Score:</Text>
                    <Badge
                      color={publicationsScore === 0 ? "gray" : publicationsScore >= 66 ? "green" : publicationsScore >= 33 ? "orange" : "red"}
                      variant="filled"
                      size="lg"
                    >
                      {publicationsScore}
                    </Badge>
                  </Flex>
                </Flex>
              ),

              overallScore: (
                <Flex>
                  <Badge
                    color={isNaN(overallScore) || overallScore === 0 ? "gray" : "violet"}
                    variant="filled"
                    size="lg"
                    style={{
                      width: '100px',  // Set fixed width for the Badge
                      textAlign: 'center',  // Center text inside the badge
                      padding: '5px'  // Optional: Adjust padding to control size
                    }}
                  >
                    {isNaN(overallScore) || overallScore === 0 ? "0" : overallScore.toFixed(1)}
                  </Badge>
                </Flex>
              ),

              label: (
                <Flex direction="column" gap={4}>
                  {(data.labels || []).map((lb, idx) => (
                    <Badge key={idx} color="blue" variant="light" size="sm">
                      {lb}
                    </Badge>
                  ))}
                </Flex>

              ),


              actions: (
                <Flex gap="xs">
                  <Tooltip label={appStrings.language.cv.viewActionTooltip} withArrow>
                    <ActionIcon
                      variant="subtle"
                      onClick={() => handleNavigateToCVDetail(data.id)}
                    >
                      <IconEye size="1.5rem" />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label={appStrings.language.btn.delete} withArrow>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={() => deleteCVTrigger(data.id)}
                    >
                      <IconTrash size="1.5rem" />
                    </ActionIcon>
                  </Tooltip>
                </Flex>
              ),
            };
          })}
        pageSize={5}
      />


    </Flex>
  );
}
