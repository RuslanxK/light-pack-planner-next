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

  const handleShowMore = () => {
    setVisibleEntries((prev) => Math.min(prev + 7, posts.length));
  };

  const sortedPosts = [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));


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
          {sortedPosts.length ? sortedPosts.slice(0, visibleEntries).map((entry, index) => (
            <Stack spacing={1} key={index}>
              <Typography component="h6" variant="subtitle1">
                {entry.title}
              </Typography>
              <Typography component="p" variant="body2" color="gray">
                {new Date(entry.createdAt).toDateString()}
              </Typography>
              <Typography component="p" variant="body2" mb={1}>
                {entry.description}
              </Typography>
              {index < posts.length - 1 && <Divider sx={{ marginY: 1 }} /> }
            </Stack>
          ))  : <Alert severity="info" sx={{width: "100%", mt: 2}}>No changes yet</Alert>}
        </Stack>
        {visibleEntries < posts.length && (
          <Button onClick={handleShowMore} sx={{ marginTop: 2 }}>
           View Previous Updates
          </Button>
        )}
      </div>
    </Stack>
  );
};

export default ChangeLog;
