"use client"

import { Typography, Stack, TextField, Container, useTheme, IconButton} from '@mui/material'
import Divider from '@mui/material/Divider';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid, GridToolbar, gridFilteredSortedRowIdsSelector, selectedGridRowsSelector} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';



const Billing = () => {

    const theme = useTheme()
    const router = useRouter();

    
    function CustomToolbar() {
        return (
          <GridToolbar
            sx={{
              marginLeft: '10px',
              marginTop: "10px"}}
          />
        );
      }


    const { data, loading } = useDemoData({
        dataSet: 'Commodity',
        rowLength: 10,
        maxColumns: 6,
      });
    
    
    const getSelectedRowsToExport = ({ apiRef }) => {
      const selectedRowIds = selectedGridRowsSelector(apiRef);
      if (selectedRowIds.size > 0) {
        return Array.from(selectedRowIds.keys());
      }
    
      return gridFilteredSortedRowIdsSelector(apiRef);
    };


  return (

    <Container sx={{display: theme.flexBox}} maxWidth={false} disableGutters>

     <Stack display={theme.flexBox} justifyContent={theme.start} width={theme.fullWidth} minHeight="100vh">

     <Stack alignItems="flex-start" m={2}><IconButton onClick={() => router.push('/')}><ArrowBackIcon /></IconButton></Stack>

     <div className="main-info">


    <Typography component="h2" variant="h6" mb={0.5}>
      Payment method
    </Typography>
    <Typography component="p" variant="p" mb={4} color="gray">
       update your billing details and address
    </Typography>

     <Divider light width="1100px" />

     <Stack flexDirection="row" alignItems="flex-start" mt={3} mb={6}>

     <Stack mr={10}>
     <Typography component="span" variant="span" fontWeight="600" mb={0.5}>
      Contact email
    </Typography>
    <Typography component="p" variant="p" color="gray">
       Where should invoices be sent?
    </Typography>
    </Stack>

    <FormControl>
  
      <RadioGroup
        name="radio-buttons-group"
        defaultValue="account-email"
      >
        <FormControlLabel value="account-email" control={<Radio />} label="Send to my account email" />
        <Typography color="gray" fontSize="14px" ml={4} mt={-1}></Typography>
        <FormControlLabel value="male" control={<Radio />} label="Send to alternative email" />
        <TextField  type='email' size='small' label="email" sx={{marginTop: "5px", width: "400px"}} InputLabelProps={{ style: { fontSize: 14 }}} />

      </RadioGroup>
    </FormControl>
    </Stack>

    <Divider light width="1100px" />

  <Stack display="flex" flexDirection="row" pt={3} pb={3}>
  <Stack mr={10}>
    <Typography component="span" variant="span" fontWeight="600" mt={3} mb={0.5}>
      Card details
    </Typography>
    <Typography component="p" variant="p" color="gray">
       select default payment method.
    </Typography>
    </Stack>

    <Stack>
   

    <Typography display="flex" sx={{cursor: "pointer"}}> <AddIcon sx={{fontSize: "25px"}}/> Add new payment method</Typography>
    </Stack>

    </Stack>

    <Divider light width="1100px" />
     
    <Typography component="h2" variant="h6" mt={4} mb={2}>
      Billing history
    </Typography>

    <Stack width="1000px">
        <DataGrid
        {...data}
        checkboxSelection
        loading={loading}
        slots={{ toolbar: CustomToolbar }}
        slotProps={{
          toolbar: { printOptions: { getRowsToExport: getSelectedRowsToExport }},
        }}
      />
    </Stack>

    </div>
    
    </Stack>
    
    </Container>
  )
}

export default Billing