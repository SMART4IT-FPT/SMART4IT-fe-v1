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
  Divider,
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
  const [sortOrder, setSortOrder] = useState("desc");
  const [labelFilter, setLabelFilter] = useState(null);
  const weights = useWeightState((state) => state.weights);
  const llmName = useWeightState((state) => state.llmName);
  const [isRematching, setIsRematching] = useState(false);



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
      label: appStrings.language.cv.tableLabel,
    },
    {
      key: "componentScores",
      label: appStrings.language.cv.tableComponentScore,
    },
    {
      key: "overallScore",
      label: (
        <Flex align="center" gap={4}>
          <Text style={{ fontWeight: "bold" }}>{appStrings.language.cv.tableOverallScore}</Text>
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

  const positionStatus = position?.status || "open";
  const [isUploading, setIsUploading] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const [progressObject, setProgressObject] = useState({});
  const [cvScores, setCvScores] = useState({});
  const errorNotify = useNotification({ type: "error" });
  const [scoreThreshold, setScoreThreshold] = useState(0);
  const [sortField, setSortField] = useState("overall");
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
      return;
    }

    setUploadFiles(files);
    uploadCVDataApi({
      projectId,
      positionId,
      files,
      weights,
      llmName,
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

        intervalFunction({
          callback: (stop) => {
            if (!isUploading) {
              setIsUploading(true);
            }
            watchUploadProgressApi(data.progress_id).then((progressData) => {
              if (progressData?.percent) {
                setProgressObject((prev) => {
                  const updated = { ...prev };
              
                  Object.keys(prev).forEach((fileName) => {
                    const newPercent = progressData.percent[fileName];
                    updated[fileName] = newPercent !== undefined ? newPercent : prev[fileName];
                  });
              
                  // ✅ Kiểm tra đúng status từ BE
                  if (progressData.status === "completed") {
                    stop();                    // Dừng interval khi BE báo completed
                    setIsUploading(false);
                    setProgressObject({});      // Reset progress
              
                    successNotify({
                      message: appStrings.language.cv.uploadSuccessMessage,
                    });
              
                    setTimeout(() => {
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
                    }, 1000);
                  }
              
                  return updated;
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
            title: appStrings.language.cv.showSuccessTitle,
            message: appStrings.language.cv.showSuccessMessage,
          });
        },
        onFail: (error) => {
          errorNotify({
            message: appStrings.language.cv.fetchErrorMessage,
          });
          setIsMatching(false);
        },
      });
    } catch (error) {
      errorNotify({
        message: appStrings.language.cv.fetchErrorMessage,
      });
      setIsMatching(false);
    }
  }

  async function handleRematchCVs() {
    if (!weights) {
      errorNotify({ message: appStrings.language.cv.configureWeightMessage });
      return;
    }
    setIsRematching(true);

    // Gửi request rematch tới API, truyền weights trực tiếp mà không bọc trong 'weight'
    await rematchCVDataApi({
      projectId,
      positionId,
      llmName: llmName,
      weights: weights,  // Truyền trực tiếp đối tượng weights
      onFail: (msg) => {
        errorNotify({ message: msg });
        setIsRematching(false);  // Đặt lại trạng thái khi gặp lỗi
      },
      onSuccess: (result) => {
        successNotify({
          title: appStrings.language.cv.rematchSuccessTitle,
          message: appStrings.language.cv.rematchSuccessMessage,
        });

        // Sau khi rematch thành công, lấy lại danh sách CVs
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

        setIsRematching(false);  // Đặt lại trạng thái sau khi hoàn thành
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
          positionStatus === "open" && (
            <Flex align="center" gap="xs">
              <Text>{appStrings.language.cv.showUploadZone}</Text>
              <IconChevronDown size="1rem" />
            </Flex>
          )
        }
        hideLabel={
          positionStatus === "open" && (
            <Flex align="center" gap="xs">
              <Text c="dimmed">{appStrings.language.cv.hideUploadZone}</Text>
              <IconChevronUp size="1rem" color="gray" />
            </Flex>
          )
        }
      >
        <Flex direction="column" gap="md">
          {uploadFiles ? (
            <ProgressList
              items={progressObject}
              isClosable={!isUploading}
              onClose={() => setUploadFiles(null)}
            />
          ) : positionStatus === "open" ? (
            <UploadZone onFileSelected={(files) => handleUploadFiles(files)} />
          ) : (
            <Text c="red">Please open this hiring request to upload CVs.</Text>
          )}
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
            <Flex direction="column" gap="xs">
              <Text fw={600}>{appStrings.language.cv.sort}</Text>
              <Select
                value={sortField}
                onChange={setSortField}
                data={[
                  { value: "overall", label: appStrings.language.cv.tableOverallScore },
                  { value: "education", label: appStrings.language.cv.educationScore },
                  { value: "technical", label: appStrings.language.cv.technicalScore },
                  { value: "experience", label: appStrings.language.cv.experienceScore },
                  { value: "language", label: appStrings.language.cv.languageScore },
                  { value: "upload_asc", label: appStrings.language.cv.uploadAsc },
                  { value: "upload_desc", label: appStrings.language.cv.uploadDesc },
                ]}
                size="xs"
                radius="md"
              />
              <Divider my="xs" />
              <Text fw={600}>{appStrings.language.cv.filterOverall}</Text>
              <Slider
                min={0}
                max={100}
                step={1}
                value={scoreThreshold}
                onChange={setScoreThreshold}
                marks={[{ value: 0, label: "0" }, { value: 100, label: "100" }]}
              />
            </Flex>
          </Popover.Dropdown>
        </Popover>

        <Select
          placeholder={appStrings.language.cv.filter}
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
          {appStrings.language.cv.rematchBtn}
        </Button>

        <Button
          leftSection={<IconSparkles size="1rem" />}
          onClick={handleMatchCVJD}
          loading={isMatching}
          disabled={isUploading}
        >
          {appStrings.language.cv.showBtn}
        </Button>
      </Flex>
      <AppTable
        columns={columns}
        loading={!search}
        data={(Array.isArray(search) ? [...search] : [])
          .filter((cv) => {
            const score = cvScores[cv.id]?.overallScore || 0;

            const labelMatch =
              !labelFilter ||
              (cv.labels || []).some(
                (lb) =>
                  lb.toLowerCase().replace(/ /g, "_") === labelFilter.toLowerCase()
              );

            return score >= scoreThreshold && labelMatch;
          })
          .sort((a, b) => {
            const getScore = (cv, field) => {
              const s = cvScores[cv.id] || {};
              switch (field) {
                case "education":
                  return s.educationScore || 0;
                case "technical":
                  return s.technicalScore || 0;
                case "experience":
                  return s.experienceScore || 0;
                case "language":
                  return s.languageScore || 0;
                case "upload_asc":
                  return new Date(cv.upload).getTime();
                case "upload_desc":
                  return -new Date(cv.upload).getTime();
                default:
                  return s.overallScore || 0;
              }
            };

            const sortValA = getScore(a, sortField);
            const sortValB = getScore(b, sortField);

            // Đảo ngược nếu là upload_asc hoặc upload_desc (đã có dấu âm sẵn)
            if (sortField.startsWith("upload")) return sortValA - sortValB;
            return sortOrder === "asc" ? sortValA - sortValB : sortValB - sortValA;
          })
          .map((data) => {
            const scores = cvScores[data.id] || {};
            const label = data.label || "No Label";

            const educationScore = scores.educationScore || 0;
            const languageScore = scores.languageScore || 0;
            const technicalScore = scores.technicalScore || 0;
            const experienceScore = scores.experienceScore || 0;
            const overallScore = scores.overallScore || 0;
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
                    <Text size="md">{appStrings.language.cv.educationScore}</Text>
                    <Badge
                      color={educationScore === 0 ? "gray" : educationScore >= 66 ? "green" : educationScore >= 33 ? "orange" : "red"}
                      variant="filled"
                      size="lg"
                    >
                      {educationScore}
                    </Badge>
                  </Flex>
                  <Flex align="center" gap="xs">
                    <Text size="md">
                      {appStrings.language.cv.languageScore}
                    </Text>
                    <Badge
                      color={languageScore === 0 ? "gray" : languageScore >= 66 ? "green" : languageScore >= 33 ? "orange" : "red"}
                      variant="filled"
                      size="lg"
                    >
                      {languageScore}
                    </Badge>
                  </Flex>
                  <Flex align="center" gap="xs">
                    <Text size="md">
                      {appStrings.language.cv.technicalScore}
                    </Text>
                    <Badge
                      color={technicalScore === 0 ? "gray" : technicalScore >= 66 ? "green" : technicalScore >= 33 ? "orange" : "red"}
                      variant="filled"
                      size="lg"
                    >
                      {technicalScore}
                    </Badge>
                  </Flex>
                  <Flex align="center" gap="xs">
                    <Text size="md">
                      {appStrings.language.cv.experienceScore}
                    </Text>
                    <Badge
                      color={experienceScore === 0 ? "gray" : experienceScore >= 66 ? "green" : experienceScore >= 33 ? "orange" : "red"}
                      variant="filled"
                      size="lg"
                    >
                      {experienceScore}
                    </Badge>
                  </Flex>
                  <Flex align="center" gap="xs">
                    <Text size="md">
                      {appStrings.language.cv.personalProjectScore}
                    </Text>
                    <Badge
                      color={personalProjectsScore === 0 ? "gray" : personalProjectsScore >= 66 ? "green" : personalProjectsScore >= 33 ? "orange" : "red"}
                      variant="filled"
                      size="lg"
                    >
                      {personalProjectsScore}
                    </Badge>
                  </Flex>
                  <Flex align="center" gap="xs">
                    <Text size="md">
                      {appStrings.language.cv.publicationScore}
                    </Text>
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
                      width: '100px',
                      padding: '5px'
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
