import React, { useEffect, useState } from 'react';
import { getProjectDashboardApi } from '../../apis/dashboard';
import { Card, Grid, Text, Group, Stack, Title, Paper } from '@mantine/core';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { IconUsers, IconFileText } from '@tabler/icons-react';

const ProjectDashboard = ({ projectId }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [projectId]);

  const fetchDashboardData = () => {
    setLoading(true);
    getProjectDashboardApi({
      projectId,
      onSuccess: (data) => {
        setDashboardData(data);
        setLoading(false);
      },
      onFail: (error) => {
        console.error(error);
        setLoading(false);
      }
    });
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!dashboardData) {
    return <Text>No data available</Text>;
  }

  const positionStatusData = Object.entries(dashboardData.position_status_counts).map(([status, count]) => ({
    status,
    count
  }));

  const cvStatusData = Object.entries(dashboardData.cv_status_counts).map(([status, count]) => ({
    status,
    count
  }));

  return (
    <Stack spacing="md">
      <Grid>
        <Grid.Col span={6}>
          <Paper p="md" withBorder>
            <Group position="apart">
              <div>
                <Text size="sm" color="dimmed">Total Hiring Requests</Text>
                <Title order={2}>{dashboardData.total_positions}</Title>
              </div>
            </Group>
          </Paper>
        </Grid.Col>
        <Grid.Col span={6}>
          <Paper p="md" withBorder>
            <Group position="apart">
              <div>
                <Text size="sm" color="dimmed">Total CVs</Text>
                <Title order={2}>{dashboardData.total_cvs}</Title>
              </div>
            </Group>
          </Paper>
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={6}>
          <Card withBorder>
            <Card.Section p="md">
              <Title order={4}>Hiring Request Status</Title>
            </Card.Section>
            <Card.Section p="md">
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={positionStatusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#228be6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card.Section>
          </Card>
        </Grid.Col>
        <Grid.Col span={6}>
          <Card withBorder>
            <Card.Section p="md">
              <Title order={4}>CV Status</Title>
            </Card.Section>
            <Card.Section p="md">
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={cvStatusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#40c057" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card.Section>
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  );
};

export default ProjectDashboard; 