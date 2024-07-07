"use client";
import * as React from 'react';
import { useState } from 'react';
import { Stack, IconButton, Typography, Divider, Button, useTheme } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';

const ChangeLog = ({posts}) => {
  const theme = useTheme();
  const router = useRouter();
  const [visibleEntries, setVisibleEntries] = useState(7);

  const changeLogEntries = [
    {
      date: "2024-06-26",
      title: "Feature Update",
      description: "Added new authentication method."
    },
    {
      date: "2024-06-20",
      title: "Bug Fix",
      description: "Resolved issue with data synchronization."
    },
    {
      date: "2024-06-15",
      title: "Performance Improvement",
      description: "Optimized database queries for faster load times."
    },
    {
      date: "2024-06-10",
      title: "UI Enhancement",
      description: "Updated the dashboard design for better usability."
    },
    {
      date: "2024-06-05",
      title: "New Feature",
      description: "Introduced dark mode."
    },
    {
      date: "2024-06-01",
      title: "Security Update",
      description: "Enhanced security protocols."
    },
    {
      date: "2024-05-28",
      title: "Bug Fix",
      description: "Fixed issue with login page."
    },
    {
      date: "2024-05-25",
      title: "API Update",
      description: "Updated API endpoints for better performance."
    },
    {
      date: "2024-05-20",
      title: "Documentation Update",
      description: "Improved developer documentation."
    },
    {
      date: "2024-05-15",
      title: "New Integration",
      description: "Added integration with third-party service."
    },
    {
      date: "2024-05-10",
      title: "Feature Enhancement",
      description: "Enhanced reporting feature with new metrics."
    },
    {
      date: "2024-05-05",
      title: "Bug Fix",
      description: "Fixed intermittent issue with data export."
    },
    {
      date: "2024-05-01",
      title: "UI Enhancement",
      description: "Improved accessibility features."
    },
    {
      date: "2024-05-01",
      title: "UI Enhancement",
      description: "Improved accessibility features."
    },
    {
      date: "2024-05-01",
      title: "UI Enhancement",
      description: "Improved accessibility features."
    },
    {
      date: "2024-05-01",
      title: "UI Enhancement",
      description: "Improved accessibility features."
    },
    {
      date: "2024-05-01",
      title: "UI Enhancement",
      description: "Improved accessibility features."
    },
    {
      date: "2024-05-01",
      title: "UI Enhancement",
      description: "Improved accessibility features."
    },
    {
      date: "2024-05-01",
      title: "UI Enhancement",
      description: "Improved accessibility features."
    },
    {
      date: "2024-05-01",
      title: "UI Enhancement",
      description: "Improved accessibility features."
    },
    {
      date: "2024-05-01",
      title: "UI Enhancement",
      description: "Improved accessibility features."
    }
  ];

  const handleShowMore = () => {
    setVisibleEntries((prev) => Math.min(prev + 7, changeLogEntries.length));
  };

  return (
    <Stack display={theme.flexBox} justifyContent={theme.start} width={theme.fullWidth} minHeight="100vh">
      <div className="main-info">
        <Stack direction="row" alignItems="center" mb={1}>
          <IconButton sx={{ marginRight: "5px" }} onClick={() => router.push('/')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography component="h2" variant="h6">
            Changelog
          </Typography>
        </Stack>
        <Typography component="p" variant="body2" mb={3} color="gray">
          Keep track of updates and changes here.
        </Typography>
        <Stack spacing={3}>
          {changeLogEntries.slice(0, visibleEntries).map((entry, index) => (
            <Stack spacing={1}>
              <Typography component="h6" variant="subtitle1">
                {entry.title}
              </Typography>
              <Typography component="p" variant="body2" color="gray">
                {entry.date}
              </Typography>
              <Typography component="p" variant="body2" mb={1}>
                {entry.description}
              </Typography>
              {index < changeLogEntries.length - 1 && <Divider sx={{ marginY: 1 }} />}
            </Stack>
          ))}
        </Stack>
        {visibleEntries < changeLogEntries.length && (
          <Button onClick={handleShowMore} sx={{ marginTop: 2 }}>
           View Previous Updates
          </Button>
        )}
      </div>
    </Stack>
  );
};

export default ChangeLog;
