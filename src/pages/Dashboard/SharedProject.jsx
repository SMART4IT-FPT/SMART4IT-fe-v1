import { Flex, Title, Input, Loader } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import HeadingLayout from "../../components/Layout/HeadingLayout";
import GridLayout from "../../components/Layout/GridLayout";
import ProjectCard from "../../components/ProjectCard";
import Empty from "../../components/Empty";
import appStrings from "../../utils/strings";

import { useEffect } from "react";
import { getSharedProjectsApi } from "../../apis/dashboard";
import useProjectsState from "../../context/project";
import useNotification from "../../hooks/useNotification";
import useSearch from "../../hooks/useSearch";

export default function SharedProjectPage() {
  const shared = useProjectsState((state) => state.shared);
  const setShared = useProjectsState((state) => state.setShared);
  const errorNotify = useNotification({ type: "error" });

  function handleSearchShared(query) {
    if (!query) return shared;
    const searchedShared = shared.filter((share) =>
      share.name.toLowerCase().includes(query.toLowerCase())
    );
    return searchedShared;
  }

  const {
    search: currentShared,
    isSearching,
    handleSearch,
  } = useSearch(shared, handleSearchShared);

  useEffect(() => {
    if (!shared) {
      getSharedProjectsApi({
        onFail: (msg) => {
          errorNotify({ message: msg });
          setShared([]);
        },
        onSuccess: (data) => setShared(data),
      });
    }
  }, [setShared]);

  return (
    <Flex direction="column" gap={30}>
      <HeadingLayout loading={!currentShared}>
        <Title order={2}>{appStrings.language.sharedProjects.heading}</Title>
        <Flex>
          <Input
            placeholder={appStrings.language.sharedProjects.searchPlaceholder}
            leftSection={
              isSearching ? <Loader size="1rem" /> : <IconSearch size="1rem" />
            }
            onChange={(event) => handleSearch(event.currentTarget.value)}
          />
        </Flex>
      </HeadingLayout>
      {currentShared?.length !== 0 ? (
        <GridLayout loading={!currentShared}>
          {currentShared?.map((data, index) => (
            <ProjectCard
              key={index}
              id={data.id}
              title={data.name}
              description={data.description}
              alias={data.alias}
              members={data.members}
            />
          ))}
        </GridLayout>
      ) : (
        <Empty />
      )}
    </Flex>
  );
}
