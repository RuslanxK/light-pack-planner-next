"use client"


import React, { useState } from 'react';
import { Container, Typography, Stack, IconButton, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Link, TextField, MenuItem, FormControl, InputLabel, Select, Slider } from '@mui/material';
import { useTheme } from '@emotion/react';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ExploreBags = ({ exploreBags }) => {
  const theme = useTheme();
  const router = useRouter();
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryRange, setCategoryRange] = useState([0, 10]);
  const [itemRange, setItemRange] = useState([0, 10]);
  const [likesFilter, setLikesFilter] = useState('');
  const [weightFilter, setWeightFilter] = useState('');

  const handleSliderChange = (filterSetter) => (e, newValue) => {
    filterSetter(newValue);
  };

  const handleSelectChange = (filterSetter) => (e) => {
    filterSetter(e.target.value);
  };

  const filteredBags = exploreBags.filter((bag) => 
    (bag.name.toLowerCase().includes(searchFilter.toLowerCase()) || bag.userDetails.username.toLowerCase().includes(searchFilter.toLowerCase())) &&
    (bag.totalCategories >= categoryRange[0] && bag.totalCategories <= categoryRange[1]) &&
    (bag.totalItems >= itemRange[0] && bag.totalItems <= itemRange[1]) &&
    (likesFilter === '' || 
      (likesFilter === '0-10' && bag.likes >= 0 && bag.likes <= 10) || 
      (likesFilter === '10-100' && bag.likes > 10 && bag.likes <= 100) || 
      (likesFilter === '100-1000' && bag.likes > 100 && bag.likes <= 1000) || 
      (likesFilter === '1000+' && bag.likes > 1000)
    ) &&
    (weightFilter === '' || 
      (weightFilter === '0-5' && bag.totalBagWeight >= 0 && bag.totalBagWeight <= 5) || 
      (weightFilter === '5-10' && bag.totalBagWeight > 5 && bag.totalBagWeight <= 10) || 
      (weightFilter === '10-15' && bag.totalBagWeight > 10 && bag.totalBagWeight <= 15) || 
      (weightFilter === '15+' && bag.totalBagWeight > 15)
    )
  );

  return (
    <Container sx={{ display: theme.flexBox }} maxWidth={false} disableGutters>
      <Stack display={theme.flexBox} justifyContent={theme.start} width={theme.trips.width} minHeight="100vh" pb={5}>
        <div className="main-info">
          <Stack direction="row" alignItems="center">
            <IconButton sx={{ marginRight: "5px" }} onClick={() => router.push('/')}>
              <ArrowBackIcon />
            </IconButton>
            <Typography component="h1" fontWeight="600" variant='span' fontSize="20px" mb={0.5}>
              Explore Bags
            </Typography>
          </Stack>
          <Typography component="p" variant="p" mb={2.5} mt={1}>
            Discover the top-rated bags crafted for every journey. <br /> Whether you're conquering remote mountain peaks or exploring dense forests, find the perfect companion for your next adventure.
          </Typography>
        </div>

        <Stack pl={5} pr={5}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2} backgroundColor={theme.main.darkColor} p={1} pl={1.5} pr={1.5}>
            <TextField
              label="Search by Name or Owner"
              variant="outlined"
              size='small'
              InputLabelProps={{ style : {fontSize: 14}}}
              sx={{ width: "30%"}}
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />

            <FormControl variant="outlined" size="small" sx={{ width: "8%" }}>
              <InputLabel sx={{fontSize: "14px"}}>Likes</InputLabel>
              <Select
                label="Likes"
                value={likesFilter}
                onChange={handleSelectChange(setLikesFilter)}
              >
                <MenuItem sx={{fontSize: "14px"}} value="">All</MenuItem>
                <MenuItem sx={{fontSize: "14px"}} value="0-10">0-10</MenuItem>
                <MenuItem sx={{fontSize: "14px"}} value="10-100">10-100</MenuItem>
                <MenuItem sx={{fontSize: "14px"}} value="100-1000">100-1000</MenuItem>
                <MenuItem sx={{fontSize: "14px"}} value="1000+">1000+</MenuItem>
              </Select>
            </FormControl>

            <FormControl variant="outlined" size="small" sx={{width: "12%" }}>
              <InputLabel sx={{fontSize: "14px"}}>Total Weight</InputLabel>
              <Select
                label="Total Bag Weight"
                value={weightFilter}
                sx={{fontSize: "14px"}}
                onChange={handleSelectChange(setWeightFilter)}
              >
                <MenuItem sx={{fontSize: "14px"}} value="">All</MenuItem>
                <MenuItem sx={{fontSize: "14px"}}value="0-5">0-5</MenuItem>
                <MenuItem sx={{fontSize: "14px"}}value="5-10">5-10</MenuItem>
                <MenuItem sx={{fontSize: "14px"}}value="10-15">10-15</MenuItem>
                <MenuItem sx={{fontSize: "14px"}} value="15+">15+</MenuItem>
              </Select>
            </FormControl>

            <Stack display="flex" justifyContent="stretch" width="15%">
            <InputLabel sx={{fontSize: "14px"}}>Categories</InputLabel>
              <FormControl variant="outlined" size="small" sx={{ width: "100%", paddingRight: '10px' }}>
                <Slider
                  value={categoryRange}
                  onChange={handleSliderChange(setCategoryRange)}
                  valueLabelDisplay="auto"
                  min={0}
                  max={100} // Adjust the max value based on your actual data
                  step={1}
                />
              </FormControl>
            </Stack>

            <Stack display="flex" justifyContent="stretch" width="15%">
            <InputLabel sx={{fontSize: "14px"}}>Items</InputLabel>
              <FormControl variant="outlined" size="small" sx={{ width: "100%" }}>
                <Slider
                  value={itemRange}
                  onChange={handleSliderChange(setItemRange)}
                  valueLabelDisplay="auto"
                  min={0}
                  max={200} // Adjust the max value based on your actual data
                  step={1}
                />
              </FormControl>
            </Stack>
          </Stack>

          {filteredBags.length === 0 ? (
            <Alert severity="warning" sx={{ marginTop: '10px' }}>
              There are no shared bags yet.
            </Alert>
          ) : (
            <TableContainer>
              <Table
                size="small"
                sx={{
                  minWidth: 650,
                  boxShadow: "rgba(0, 0, 0, 0.15) 0px 2px 8px;",
                  background: theme.palette.mode === "dark" ? theme.main.darkColor : "#FAFAFA",
                  marginTop: "10px"
                }}
                aria-label="simple table"
              >
                <TableHead sx={{ background: theme.palette.mode === "dark" ? "#171717" : "#F2F2F2" }}>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="left">Owner</TableCell>
                    <TableCell align="center">Categories</TableCell>
                    <TableCell align="center">Items</TableCell>
                    <TableCell align="center">Total Weight</TableCell>
                    <TableCell align="center">Likes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredBags.map((row) => (
                    <TableRow
                      key={row._id}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        '&:hover': {
                          backgroundColor: theme.palette.mode === 'dark' ? '#6e6d6d' : "#e6e3e3",
                          cursor: 'pointer'
                        }
                      }}
                    >
                      <TableCell component="th" scope="row">
                        <Link href={`/share?id=${row._id}`} target="_blank" rel="noopener noreferrer" underline="none">
                          {row.name}
                        </Link>
                      </TableCell>
                      <TableCell align="left">{row.userDetails.username}</TableCell>
                      <TableCell align="center">{row.totalCategories}</TableCell>
                      <TableCell align="center">{row.totalItems}</TableCell>
                      <TableCell align="center">{row.totalBagWeight.toFixed(2)} / {row.goal} {row.userDetails.weightOption}</TableCell>
                      <TableCell align="center">{row.likes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Stack>
      </Stack>
    </Container>
  );
}

export default ExploreBags;
