import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Breadcrumbs, Anchor, Title, Text } from '@mantine/core';
import ProjectDashboard from '../../components/dashboard/ProjectDashboard';
import { IconHome, IconFolder } from '@tabler/icons-react';

const ProjectDashboardPage = () => {
  const { 'project-id': projectId } = useParams();

  return (
    <Container size="xl">
      <Title order={2} mb="md">Dashboard</Title>
      <ProjectDashboard projectId={projectId} />
    </Container>
  );
};

export default ProjectDashboardPage; 