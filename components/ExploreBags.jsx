"use client"

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Stack,
  IconButton,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Slider
} from '@mui/material';
import { useTheme } from '@emotion/react';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useMediaQuery from '@mui/material/useMediaQuery';

const ExploreBags = ({ exploreBags }) => {
  const theme = useTheme();
  const router = useRouter();
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryRange, setCategoryRange] = useState([0, 100]);
  const [itemRange, setItemRange] = useState([0, 200]);
  const [likesFilter, setLikesFilter] = useState('');
  const [weightFilter, setWeightFilter] = useState('');
  const [weightUnitFilter, setWeightUnitFilter] = useState('');
  const [weightOptions, setWeightOptions] = useState([]);
  const [tripNames, setTripNames] = useState([]);
  const [selectedTripName, setSelectedTripName] = useState('');

  const isMobile = useMediaQuery("only screen and (max-width : 768px)");

  useEffect(() => {
    const fetchTripNames = () => {
      const uniqueTripNames = [...new Set(exploreBags.map(bag => bag.tripName))];
      setTripNames(uniqueTripNames);
    };
    fetchTripNames();
  }, [exploreBags]);

  useEffect(() => {
    // Populate weightOptions based on selected weightUnitFilter
    const populateWeightOptions = () => {
      if (weightUnitFilter === 'kg') {
        setWeightOptions(['All', '0-5', '5-10', '10-15', '15+']);
      } else if (weightUnitFilter === 'lb') {
        setWeightOptions(['All', '0-10', '10-20', '20-30', '30+']);
      } else if (weightUnitFilter === 'g') {
        setWeightOptions(['All', '0-5000', '5000-10000', '10000-15000', '15000+']);
      } else if (weightUnitFilter === 'oz') {
        setWeightOptions(['All', '0-175', '175-350', '350-525', '525+']);
      } else {
        setWeightOptions([]);
      }
    };
    populateWeightOptions();

    // Reset weight filter if weight unit is set to All
    if (weightUnitFilter === '') {
      setWeightFilter('');
    }
  }, [weightUnitFilter]);

  const handleSliderChange = (filterSetter) => (e, newValue) => {
    filterSetter(newValue);
  };

  const handleSelectChange = (filterSetter) => (e) => {
    filterSetter(e.target.value);
  };

  const filteredBags = exploreBags.filter((bag) =>
    (bag.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      bag.userDetails.username.toLowerCase().includes(searchFilter.toLowerCase())) &&
    (selectedTripName === '' || bag.tripName === selectedTripName) && // Filter by selected tripName
    (bag.totalCategories >= categoryRange[0] && bag.totalCategories <= categoryRange[1]) &&
    (bag.totalItems >= itemRange[0] && bag.totalItems <= itemRange[1]) &&
    (likesFilter === '' ||
      (likesFilter === '0-10' && bag.likes >= 0 && bag.likes <= 10) ||
      (likesFilter === '10-100' && bag.likes > 10 && bag.likes <= 100) ||
      (likesFilter === '100-1000' && bag.likes > 100 && bag.likes <= 1000) ||
      (likesFilter === '1000+' && bag.likes > 1000)
    ) &&
    (weightFilter === '' || weightFilter === 'All' || // Adjusted condition for "All"
      (weightFilter === '0-5' && bag.totalBagWeight >= 0 && bag.totalBagWeight <= 5 && weightUnitFilter === 'kg') ||
      (weightFilter === '5-10' && bag.totalBagWeight > 5 && bag.totalBagWeight <= 10 && weightUnitFilter === 'kg') ||
      (weightFilter === '10-15' && bag.totalBagWeight > 10 && bag.totalBagWeight <= 15 && weightUnitFilter === 'kg') ||
      (weightFilter === '15+' && bag.totalBagWeight > 15 && weightUnitFilter === 'kg') ||
      (weightFilter === '0-10' && bag.totalBagWeight >= 0 && bag.totalBagWeight <= 10 && weightUnitFilter === 'lb') ||
      (weightFilter === '10-20' && bag.totalBagWeight > 10 && bag.totalBagWeight <= 20 && weightUnitFilter === 'lb') ||
      (weightFilter === '20-30' && bag.totalBagWeight > 20 && bag.totalBagWeight <= 30 && weightUnitFilter === 'lb') ||
      (weightFilter === '30+' && bag.totalBagWeight > 30 && weightUnitFilter === 'lb') ||
      (weightFilter === '0-5000' && bag.totalBagWeight >= 0 && bag.totalBagWeight <= 5000 && weightUnitFilter === 'g') ||
      (weightFilter === '5000-10000' && bag.totalBagWeight > 5000 && bag.totalBagWeight <= 10000 && weightUnitFilter === 'g') ||
      (weightFilter === '10000-15000' && bag.totalBagWeight > 10000 && bag.totalBagWeight <= 15000 && weightUnitFilter === 'g') ||
      (weightFilter === '15000+' && bag.totalBagWeight > 15000 && weightUnitFilter === 'g') ||
      (weightFilter === '0-175' && bag.totalBagWeight >= 0 && bag.totalBagWeight <= 175 && weightUnitFilter === 'oz') ||
      (weightFilter === '175-350' && bag.totalBagWeight > 175 && bag.totalBagWeight <= 350 && weightUnitFilter === 'oz') ||
      (weightFilter === '350-525' && bag.totalBagWeight > 350 && bag.totalBagWeight <= 525 && weightUnitFilter === 'oz') ||
      (weightFilter === '525+' && bag.totalBagWeight > 525 && weightUnitFilter === 'oz')
    ) &&
    (weightUnitFilter === '' || bag.userDetails.weightOption === weightUnitFilter)
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

          <Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" mt={1} backgroundColor={ theme.palette.mode === "dark" ? theme.main.darkColor : "#F2F2F2"} p={2} >
              <TextField
                label="Search by Name or Owner"
                variant="outlined"
                size='small'
                InputLabelProps={{ style: { fontSize: 14 } }}
                sx={{ width: isMobile ? "100%" : "35%", marginBottom: isMobile ? "10px" : null }}
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
              />

                <FormControl variant="outlined" size="small" sx={{ width: isMobile ? "100%" : "25%", marginBottom: isMobile ? "10px" : null }}>
                <InputLabel sx={{ fontSize: "14px" }}>Country</InputLabel>
                <Select
                  label="Trip Name"
                  value={selectedTripName}
                  onChange={handleSelectChange(setSelectedTripName)}
                >
                  <MenuItem sx={{ fontSize: "14px" }} value="">All</MenuItem>
                  {tripNames.map(tripName => (
                    <MenuItem sx={{ fontSize: "14px" }} key={tripName} value={tripName}>{tripName}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl variant="outlined" size="small" sx={{ width: isMobile ? "100%" : "8%", marginBottom: isMobile ? "10px" : null }}>
                <InputLabel sx={{ fontSize: "14px" }}>Likes</InputLabel>
                <Select
                  label="Likes"
                  value={likesFilter}
                  onChange={handleSelectChange(setLikesFilter)}
                >
                  <MenuItem sx={{ fontSize: "14px" }} value="">All</MenuItem>
                  <MenuItem sx={{ fontSize: "14px" }} value="0-10">0-10</MenuItem>
                  <MenuItem sx={{ fontSize: "14px" }} value="10-100">10-100</MenuItem>
                  <MenuItem sx={{ fontSize: "14px" }} value="100-1000">100-1000</MenuItem>
                  <MenuItem sx={{ fontSize: "14px" }} value="1000+">1000+</MenuItem>
                </Select>
              </FormControl>

              <FormControl variant="outlined" size="small" sx={{ width: isMobile ? "100%" : "12%", marginBottom: isMobile ? "10px" : null }}>
                <InputLabel sx={{ fontSize: "14px" }}>Weight Unit</InputLabel>
                <Select
                  label="Weight Unit"
                  value={weightUnitFilter}
                  onChange={handleSelectChange(setWeightUnitFilter)}
                >
                  <MenuItem sx={{ fontSize: "14px" }} value="">All</MenuItem>
                  <MenuItem sx={{ fontSize: "14px" }} value="kg">Kilograms</MenuItem>
                  <MenuItem sx={{ fontSize: "14px" }} value="lb">Pounds</MenuItem>
                  <MenuItem sx={{ fontSize: "14px" }} value="g">Grams</MenuItem>
                  <MenuItem sx={{ fontSize: "14px" }} value="oz">Ounces</MenuItem>
                </Select>
              </FormControl>

              <FormControl variant="outlined" size="small" sx={{ width: isMobile ? "100%" : "12%", marginBottom: isMobile ? "10px" : null }}>
                <InputLabel sx={{ fontSize: "14px" }}>Total Weight</InputLabel>
                <Select
                  label="Total Weight"
                  value={weightFilter}
                  disabled={!weightUnitFilter}
                  onChange={handleSelectChange(setWeightFilter)}
                >
                  {weightOptions.map(option => (
                    <MenuItem sx={{ fontSize: "14px" }} key={option} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
            <Stack direction={isMobile ? "column" : "row"} justifyContent="space-between" alignItems="center" mt={1} mb={2} backgroundColor={ theme.palette.mode === "dark" ? theme.main.darkColor : "#F2F2F2"} pl={2} pr={2}>
              <Stack sx={{ width: isMobile ? "100%" : "50%"}} p={2}>
                <Typography id="non-linear-slider" component="label" sx={{ fontSize: "14px" }}>
                  Number of Categories
                </Typography>
                <Slider
                  value={categoryRange}
                  onChange={handleSliderChange(setCategoryRange)}
                  valueLabelDisplay="auto"
                  min={0}
                  max={100}
                
                />
              </Stack>

              <Stack sx={{ width: isMobile ? "100%" : "50%" }} pl={2} pr={2}>
                <Typography id="non-linear-slider" component="label" sx={{ fontSize: "14px" }}>
                  Number of Items
                </Typography>
                <Slider
                  value={itemRange}
                  onChange={handleSliderChange(setItemRange)}
                  valueLabelDisplay="auto"
                  min={0}
                  max={200}
                  
                />
              </Stack>

            </Stack>
          </Stack>

          {filteredBags.length === 0 ? (
            <Alert severity="info" sx={{ mt: 2 }}>No bags found matching the filters.</Alert>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontSize: "13px" }}>Name</TableCell>
                    <TableCell sx={{ fontSize: "13px" }}>Owner</TableCell>
                    <TableCell sx={{ fontSize: "13px" }}>Country</TableCell>
                    <TableCell sx={{ fontSize: "13px" }}>Categories</TableCell>
                    <TableCell sx={{ fontSize: "13px" }}>Items</TableCell>
                    <TableCell sx={{ fontSize: "13px" }}>Likes</TableCell>
                    <TableCell sx={{ fontSize: "13px" }}>Total Weight {weightUnitFilter}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredBags.map((bag) => (
                    <TableRow key={bag._id}>
                      <TableCell sx={{ fontSize: "13px" }}>
                        <Link href={`/share?id=${bag._id}`} underline="hover" target="_blank">
                          {bag.name}
                        </Link>
                      </TableCell>
                      <TableCell sx={{ fontSize: "13px" }}>{bag.userDetails.username}</TableCell>
                      <TableCell sx={{ fontSize: "13px" }}>{bag.tripName}</TableCell>
                      <TableCell sx={{ fontSize: "13px" }}>{bag.totalCategories}</TableCell>
                      <TableCell sx={{ fontSize: "13px" }}>{bag.totalItems}</TableCell>
                      <TableCell sx={{ fontSize: "13px" }}>{bag.likes}</TableCell>
                      <TableCell sx={{ fontSize: "13px" }}>
                        {bag.totalBagWeight.toFixed(2)} / {bag.goal} {bag.userDetails.weightOption}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
      </Stack>
    </Container>
  );
};

export default ExploreBags;
