import {
  Flex,
  Breadcrumbs,
  Anchor,
  Paper,
  Box,
  Title,
  ActionIcon,
  Text,
  Menu,
  Skeleton,
  Blockquote,
  SegmentedControl,
  ScrollArea,
  Stepper,
  RingProgress,
  Center,
} from "@mantine/core";
import HeadingLayout from "../../components/Layout/HeadingLayout";
import appStrings from "../../utils/strings";
import {
  IconDownload,
  IconDots,
  IconTrash,
  IconSparkles,
  IconFile,
  IconAlignLeft,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useNotification from "../../hooks/useNotification";
import {
  getCVDetailApi,
  getCVKeywordDetailApi,
} from "../../apis/cv";
import FileViewer from "../../components/FileViewer";

function getStepStatusActive(status) {
  switch (status) {
    case "APPLYING":
      return 0;
    case "ACCEPTED":
      return 1;
    case "INTERVIEWING":
      return 2;
    case "HIRED":
      return 3;
    default:
      return 0;
  }
}

export default function CVDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const projectId = location.pathname.split("/")[1];
  const positionId = location.pathname.split("/")[2];
  const cvId = location.pathname.split("/")[4];

  const [cv, setCV] = useState(null);
  const [isTextView, setIsTextView] = useState(false);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [cvDetail, setCVDetail] = useState(null);

  const errorNotify = useNotification({ type: "error" });

  function handleNavigateToCVs() {
    navigate(`/${projectId}/${positionId}/cv`);
  }

  function handleSummaryCV() {
    setIsLoadingSummary(true);
    summaryAIApi({
      projectId,
      positionId,
      cvId,
      onFail: (msg) => {
        errorNotify({ message: msg });
        setIsLoadingSummary(false);
      },
      onSuccess: (summary) => {
        setCV((prev) => ({
          ...prev,
          summary,
        }));
        setIsLoadingSummary(false);
      },
    });
  }

  useEffect(() => {
    getCVDetailApi({
      projectId,
      positionId,
      cvId,
      onFail: (msg) => errorNotify({ message: msg }),
      onSuccess: (cv) => setCV(cv),
    });
    getCVKeywordDetailApi({
      projectId,
      positionId,
      cvId,
      onFail: (msg) => errorNotify({ message: msg }),
      onSuccess: (detail) => setCVDetail(detail),
    });
  }, []);

  const overallScore = cvDetail?.matching?.overall_result?.overall_score || 0;
  const educationScore = cvDetail?.matching?.overall_result?.education_score || 0;
  const languageScore = cvDetail?.matching?.overall_result?.language_skills_score || 0;
  const technicalScore = cvDetail?.matching?.overall_result?.technical_skills_score || 0;
  const experienceScore = cvDetail?.matching?.overall_result?.work_experience_score || 0;
  const publictationsScore = cvDetail?.matching?.overall_result?.publications_score || 0;
  const personalProjectScore = cvDetail?.matching?.overall_result?.personal_projects_score || 0;

  return (
    <Flex direction="column" gap="xl">
      {/* Breadcrumbs Header */}
      <HeadingLayout>
        <Breadcrumbs>
          <Anchor onClick={handleNavigateToCVs}>
            {appStrings.language.cv.title}
          </Anchor>
          {cv ? cv.name : <Skeleton width={200} height={25} />}
        </Breadcrumbs>
      </HeadingLayout>

      {/* Stepper Status */}
      {cv ? (
        <Stepper size="xs" active={getStepStatusActive(cv.status)}>
          <Stepper.Step label={appStrings.language.cvDetail.stepApply} />
          <Stepper.Step label={appStrings.language.cvDetail.stepAccept} />
          <Stepper.Step label={appStrings.language.cvDetail.stepInterview} />
          <Stepper.Step label={appStrings.language.cvDetail.stepHire} />
        </Stepper>
      ) : (
        <Skeleton height={50} />
      )}

      {/* CV File or Text View */}
      {cv ? (
        <Box pos="relative">
          <SegmentedControl
            size="xs"
            data={[
              { value: "file", label: <IconFile size="1rem" /> },
              { value: "text", label: <IconAlignLeft size="1rem" /> },
            ]}
            pos="absolute"
            inset="auto auto 10px 10px"
            onChange={(value) => setIsTextView(value === "text")}
          />
          <Paper withBorder h={500} style={{ overflow: "hidden" }}>
            {isTextView ? (
              <ScrollArea p="md" h={500}>
                <Text>{cv.content}</Text>
              </ScrollArea>
            ) : (
              <FileViewer url={cv.url} />
            )}
          </Paper>
        </Box>
      ) : (
        <Skeleton height={500} />
      )}

      {/* Header + Action Buttons */}
      <Flex justify="space-between">
        {cv ? (
          <Title order={2}>{cv.name}</Title>
        ) : (
          <Skeleton width={200} height={36} />
        )}

        <Menu withinPortal shadow="md" position="top-end" width={150}>
          <Menu.Target>
            <ActionIcon variant="light" color="gray">
              <IconDots />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown p={5}>
            <Menu.Item
              c="violet"
              leftSection={<IconSparkles size="1rem" />}
              disabled={isLoadingSummary}
              onClick={handleSummaryCV}
            >
              {appStrings.language.btn.ai}
            </Menu.Item>
            <Menu.Item
              c="gray"
              leftSection={<IconDownload size="1rem" />}
              onClick={() => window.open(cv?.url, "_blank")}
            >
              {appStrings.language.btn.download}
            </Menu.Item>
            <Menu.Item c="red" leftSection={<IconTrash size="1rem" />}>
              {appStrings.language.btn.delete}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Flex>

      {(cv?.summary || isLoadingSummary) && (
  <Blockquote color="violet" icon={<IconSparkles size="1rem" />}>
    {isLoadingSummary ? (
      <Flex direction="column" gap="sm">
        <Skeleton h={20} />
        <Skeleton h={20} w={200} />
      </Flex>
    ) : (
      <Flex direction="column" gap="md">
        
        {/* Professional Summary */}
        <Text size="sm" c="dimmed">
          {cv?.summary?.ProfessionalSummary}
        </Text>

        {/* Personal Information */}
        <Flex direction="column" gap="xs">
          <Text fw={500}>👤 Personal Information:</Text>
          <Text size="sm">Full Name: {cv?.summary?.PersonalInformation?.FullName}</Text>
          <Text size="sm">Email: {cv?.summary?.PersonalInformation?.ContactInformation?.Email}</Text>
          <Text size="sm">Phone: {cv?.summary?.PersonalInformation?.ContactInformation?.PhoneNumber}</Text>
          {cv?.summary?.PersonalInformation?.GitHubProfile && (
            <Text size="sm">GitHub: {cv?.summary?.PersonalInformation?.GitHubProfile}</Text>
          )}
        </Flex>

        {/* {CertificationsAndTraining} */}
        <Flex direction="column" gap="xs">
          <Text fw={500}>🏅 Certifications and Training:</Text>
          {cv?.summary?.CertificationsAndTraining?.map((cert, idx) => (
            <Box key={idx} pl="sm">
              <Text size="sm">Title: {cert.Title}</Text>
              <Text size="sm">Institution: {cert.Institution}</Text>
              <Text size="sm">Issued Date: {cert.IssuedDate}</Text>
            </Box>
          ))}
        </Flex>

        {/* {Project} */}
        <Flex direction="column" gap="xs">
          <Text fw={500}>🔧 Projects:</Text>
          {cv?.summary?.Projects?.map((proj, idx) => (
            <Box key={idx} pl="sm">
              <Text size="sm">Title: {proj.Title}</Text>
              <Text size="sm">Description: {proj.Description}</Text>
              <Text size="sm">Duration: {proj.Duration}</Text>
            </Box>
          ))}
        </Flex>

          {/* {Publications} */}
          <Flex direction="column" gap="xs">
            <Text fw={500}>📚 Publications:</Text>
            {cv?.summary?.Publications?.map((pub, idx) => (
              <Box key={idx} pl="sm">
                <Text size="sm">Title: {pub.Title}</Text>
                <Text size="sm">Authors: {pub.Authors}</Text>
                <Text size="sm">Publication Date: {pub.PublicationDate}</Text>
              </Box>
            ))}
          </Flex>

        {/* Education */}
        <Flex direction="column" gap="xs">
          <Text fw={500}>🎓 Education:</Text>
          {cv?.summary?.Education?.map((edu, idx) => (
            <Box key={idx} pl="sm">
              <Text size="sm">Institution: {edu.Institution}</Text>
              <Text size="sm">Degree: {edu.Degree || 'N/A'}</Text>
              <Text size="sm">Major: {edu.Major || 'N/A'}</Text>
              <Text size="sm">Graduation Year: {edu.GraduationYear || 'N/A'}</Text>
            </Box>
          ))}
        </Flex>

        {/* Work Experience */}
        <Flex direction="column" gap="xs">
          <Text fw={500}>💼 Work Experience:</Text>
          {cv?.summary?.WorkExperience?.map((work, idx) => (
            <Box key={idx} pl="sm" mb="sm">
              <Text size="sm">Job Title: {work.JobTitle || 'N/A'}</Text>
              <Text size="sm">Company: {work.CompanyName}</Text>
              <Text size="sm">
                Duration: {work.Duration.StartDate} - {work.Duration.EndDate || 'Present'}
              </Text>
              {work.KeyResponsibilitiesAndAchievements && (
                <Text size="sm">Responsibilities: {work.KeyResponsibilitiesAndAchievements}</Text>
              )}
            </Box>
          ))}
        </Flex>

        {/* Skills */}
        <Flex direction="column" gap="xs">
          <Text fw={500}>🛠️ Skills:</Text>
          <Text size="sm">Technical: {cv?.summary?.Skills?.TechnicalSkills?.join(', ')}</Text>
          <Text size="sm">Soft: {cv?.summary?.Skills?.SoftSkills?.join(', ')}</Text>
        </Flex>

        {/* Languages */}
        <Flex direction="column" gap="xs">
          <Text fw={500}>🌐 Languages:</Text>
          {cv?.summary?.Languages?.map((lang, idx) => (
            <Box key={idx} pl="sm">
              <Text size="sm">Language: {lang.Language}</Text>
              <Text size="sm">Proficiency: {lang.Proficiency}</Text>
            </Box>
          ))}
        </Flex>




      </Flex>
    )}
  </Blockquote>
)}



      {/* Matching Results (RingProgress Visuals) */}
      {cvDetail?.matching && (
        <Flex gap="xl" wrap="wrap" justify="center" align="center">
          {/* Overall Score */}
          <RingProgress
            size={160}
            thickness={12}
            roundCaps
            sections={[
              { value: overallScore * 10, color: 'violet' },
            ]}
            label={
              <Center>
                <Text c="violet" fw={700} ta="center">
                  Overall
                  <br />
                  {overallScore.toFixed(1)}
                </Text>
              </Center>
            }
          />

          {/* Education */}
          <RingProgress
            size={120}
            thickness={10}
            roundCaps
            sections={[
              { value: educationScore, color: 'blue' },
            ]}
            label={
              <Center>
                <Text c="blue" fw={600} ta="center">
                  Edu
                  <br />
                  {educationScore}
                </Text>
              </Center>
            }
          />

          {/* Language */}
          <RingProgress
            size={120}
            thickness={10}
            roundCaps
            sections={[
              { value: languageScore, color: 'green' },
            ]}
            label={
              <Center>
                <Text c="green" fw={600} ta="center">
                  Lang
                  <br />
                  {languageScore}
                </Text>
              </Center>
            }
          />

          {/* Technical */}
          <RingProgress
            size={120}
            thickness={10}
            roundCaps
            sections={[
              { value: technicalScore, color: 'orange' },
            ]}
            label={
              <Center>
                <Text c="orange" fw={600} ta="center">
                  Tech
                  <br />
                  {technicalScore}
                </Text>
              </Center>
            }
          />

          {/* Experience */}
          <RingProgress
            size={120}
            thickness={10}
            roundCaps
            sections={[
              { value: experienceScore, color: 'red' },
            ]}
            label={
              <Center>
                <Text c="red" fw={600} ta="center">
                  Exp
                  <br />
                  {experienceScore}
                </Text>
              </Center>
            }
          />

          {/* Publications */}
          <RingProgress
            size={120}
            thickness={10}
            roundCaps
            sections={[
              { value: publictationsScore, color: 'purple' },
            ]}
            label={
              <Center>
                <Text c="purple" fw={600} ta="center">
                  Pub
                  <br />
                  {publictationsScore}
                </Text>
              </Center>
            }
          />
          {/* Personal Projects */}
          <RingProgress
            size={120}
            thickness={10}
            roundCaps
            sections={[
              { value: personalProjectScore, color: 'cyan' },
            ]}
            label={
              <Center>
                <Text c="cyan" fw={600} ta="center">
                  Proj
                  <br />
                  {personalProjectScore}
                </Text>
              </Center>
            }
          />
        </Flex>
      )}

      {/* Detail Table */}
    </Flex>
  );
}
