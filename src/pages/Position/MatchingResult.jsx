import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Flex, Breadcrumbs, Anchor, Paper, Box, Title, Skeleton } from "@mantine/core";
import HeadingLayout from "../../components/Layout/HeadingLayout";
import appStrings from "../../utils/strings";
import useNotification from "../../hooks/useNotification";
// import { getMatchingResultsApi } from "../../apis/matching";
import DetailTable from "../../components/DetailTable";

export default function MatchingResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const projectId = location.pathname.split("/")[1];
  const positionId = location.pathname.split("/")[2];
  const [results, setResults] = useState(null);
  const errorNotify = useNotification({ type: "error" });

  function handleNavigateToJDs() {
    navigate(`/${projectId}/${positionId}/jd`);
  }

  // useEffect(() => {
  //   // Get matching results
  //   getMatchingResultsApi({
  //     projectId,
  //     positionId,
  //     onFail: (msg) => {
  //       errorNotify({ message: msg });
  //     },
  //     onSuccess: (data) => {
  //       setResults(data);
  //     },
  //   });
  // }, []);

  return (
    <Flex direction="column" gap="xl">
      <HeadingLayout>
        <Breadcrumbs>
          <Anchor onClick={handleNavigateToJDs}>
            {appStrings.language.jd.title}
          </Anchor>
          {results ? appStrings.language.matchingResults.title : <Skeleton width={200} height={25} />}
        </Breadcrumbs>
      </HeadingLayout>
      {results ? (
        <Box>
          <Title order={2}>{appStrings.language.matchingResults.title}</Title>
          <DetailTable data={results} />
        </Box>
      ) : (
        <Skeleton height={500} />
      )}
    </Flex>
  );
}
