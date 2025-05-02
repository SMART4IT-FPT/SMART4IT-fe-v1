import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Title } from '@mantine/core';
import PositionDashboard from '../../components/dashboard/PositionDashboard';

const PositionDashboardPage = () => {
  const { 'project-id': projectId, 'position-id': positionId } = useParams();

  return (
    <Container size="xl">
      <Title order={2} mb="md">Hiring Request Dashboard</Title>
      <PositionDashboard projectId={projectId} positionId={positionId} />
    </Container>
  );
};

export default PositionDashboardPage; 