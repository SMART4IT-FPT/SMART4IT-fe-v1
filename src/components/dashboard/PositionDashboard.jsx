import React, { useEffect, useState } from 'react';
import { getPositionDashboardApi } from '../../apis/dashboard';
import { Card, Grid, Text, Group, Stack, Title, Paper } from '@mantine/core';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PositionDashboard = ({ projectId, positionId }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [projectId, positionId]);

  const fetchDashboardData = () => {
    setLoading(true);
    getPositionDashboardApi({
      projectId,
      positionId,
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

  const calculateAverageScore = (distribution) => {
    const total = Object.entries(distribution).reduce((sum, [range, count]) => {
      const [min, max] = range.split('-').map(Number);
      const midPoint = (min + max) / 2;
      return sum + (midPoint * count);
    }, 0);
    const totalCount = Object.values(distribution).reduce((sum, count) => sum + count, 0);
    return totalCount > 0 ? Math.round((total / totalCount) * 10) / 10 : 0;
  };

  const scoreDistributions = [
    {
      title: "Education Score",
      data: dashboardData.education_score_distribution,
      color: "#228be6"
    },
    {
      title: "Language Skills",
      data: dashboardData.language_skills_score_distribution,
      color: "#40c057"
    },
    {
      title: "Technical Skills",
      data: dashboardData.technical_skills_score_distribution,
      color: "#fab005"
    },
    {
      title: "Work Experience",
      data: dashboardData.work_experience_score_distribution,
      color: "#fd7e14"
    },
    {
      title: "Personal Projects",
      data: dashboardData.personal_projects_score_distribution,
      color: "#7950f2"
    },
    {
      title: "Publications",
      data: dashboardData.publications_score_distribution,
      color: "#e64980"
    }
  ];

  const renderChart = (title, data, color) => {
    const chartData = Object.entries(data).map(([range, count]) => ({
      range,
      count
    }));

    return (
      <Card withBorder>
        <Card.Section p="md">
          <Group position="apart">
            <Title order={4}>{title}</Title>
            <Text size="sm" color="dimmed">Average: {calculateAverageScore(data)}%</Text>
          </Group>
        </Card.Section>
        <Card.Section p="md">
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill={color} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card.Section>
      </Card>
    );
  };

  const cvStatusData = [
    { name: 'Applying', value: dashboardData.cv_status_counts.APPLYING || 0 },
    { name: 'Accepted', value: dashboardData.cv_status_counts.ACCEPTED || 0 },
    { name: 'Interviewing', value: dashboardData.cv_status_counts.INTERVIEWING || 0 },
    { name: 'Hired', value: dashboardData.cv_status_counts.HIRED || 0 }
  ];

  const matchingScore = calculateAverageScore(dashboardData.matching_score_distribution);

  return (
    <Stack spacing="md">
      <Grid>
        <Grid.Col span={6}>
          <Card withBorder>
            <Card.Section p="md">
              <Title order={4}>CV Status</Title>
            </Card.Section>
            <Card.Section p="md">
              <Grid>
                <Grid.Col span={12}>
                  <Paper p="md" withBorder>
                    <div>
                      <Text size="sm" color="dimmed">Total</Text>
                      <Title order={2}>{dashboardData.total_cvs}</Title>
                    </div>
                  </Paper>
                </Grid.Col>
                {cvStatusData.map((status) => (
                  <Grid.Col key={status.name} span={6}>
                    <Paper p="md" withBorder>
                      <div>
                        <Text size="sm" color="dimmed">{status.name}</Text>
                        <Title order={2}>{status.value}</Title>
                      </div>
                    </Paper>
                  </Grid.Col>
                ))}
              </Grid>
            </Card.Section>
          </Card>
        </Grid.Col>
        <Grid.Col span={6}>
          <Card withBorder>
            <Card.Section p="md">
              <Title order={4}>CV Status Distribution</Title>
            </Card.Section>
            <Card.Section p="md">
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={cvStatusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#12b886" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card.Section>
          </Card>
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={12}>
          <Card withBorder>
            <Card.Section p="md">
              <Title order={4}>Average Scores</Title>
            </Card.Section>
            <Card.Section p="md">
              <Grid>
                <Grid.Col span={3}>
                  <Paper p="md" withBorder style={{ height: '200px' }}>
                    <div>
                      <Text size="sm" color="dimmed">Matching Score</Text>
                      <Title order={2}>{matchingScore}%</Title>
                    </div>
                  </Paper>
                </Grid.Col>
                <Grid.Col span={9}>
                  <Grid>
                    {scoreDistributions.slice(0, 3).map(({ title, data, color }) => (
                      <Grid.Col key={title} span={4}>
                        <Paper p="md" withBorder>
                          <div>
                            <Text size="sm" color="dimmed">{title}</Text>
                            <Title order={2}>{calculateAverageScore(data)}%</Title>
                          </div>
                        </Paper>
                      </Grid.Col>
                    ))}
                  </Grid>
                  <Grid mt="md">
                    {scoreDistributions.slice(3, 6).map(({ title, data, color }) => (
                      <Grid.Col key={title} span={4}>
                        <Paper p="md" withBorder>
                          <div>
                            <Text size="sm" color="dimmed">{title}</Text>
                            <Title order={2}>{calculateAverageScore(data)}%</Title>
                          </div>
                        </Paper>
                      </Grid.Col>
                    ))}
                  </Grid>
                </Grid.Col>
              </Grid>
            </Card.Section>
          </Card>
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={12}>
          <Card withBorder>
            <Card.Section p="md">
              <Title order={4}>Matching Score Distribution</Title>
            </Card.Section>
            <Card.Section p="md">
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={Object.entries(dashboardData.matching_score_distribution).map(([range, count]) => ({
                    range,
                    count
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#12b886" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card.Section>
          </Card>
        </Grid.Col>
      </Grid>

      <Grid>
        {scoreDistributions.map(({ title, data, color }) => (
          <Grid.Col key={title} span={6}>
            {renderChart(title, data, color)}
          </Grid.Col>
        ))}
      </Grid>
    </Stack>
  );
};

export default PositionDashboard; 