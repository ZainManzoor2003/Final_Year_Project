import React, { useContext, useEffect, useState } from 'react'
import {
    Box,
    IconButton, Button, TextField,
    Card
}
    from '@mui/material'
import Table from '@mui/material/Table';
import { useNavigate } from 'react-router-dom';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import EditIcon from '@mui/icons-material/Edit'
import Switch from '@mui/material/Switch';
import axios from 'axios';
import CreateContextApi from '../../ContextApi/CreateContextApi';

const label = { inputProps: { 'aria-label': 'Switch demo' } };


export default function EnableDisablePensioner() {
    const [allPensioners, setAllPensioners] = useState([]);
    const navigate = useNavigate();
    const [filterText, setFilterText] = useState("")
    const [filterName, setFilterName] = useState("")
    const [showAccountModal, setShowAccountModal] = useState(false);
    const [tempAllPensioners, setTempAllPensioners] = useState([]);
    const [page, setPage] = useState(0);  // Current page index
    const [rowsPerPage, setRowsPerPage] = useState(5);  // Number of rows per page
    const { isAuthenticated } = useContext(CreateContextApi);
    

    const getPensioners = async () => {
        let data = await fetch(`https://fyp-enrollment-server.vercel.app/getPensioners`);
        let res = await data.json();
        setAllPensioners(res);
        setTempAllPensioners(res)
    }
    useEffect(() => {
        if (allPensioners.length === 0) {
            getPensioners();
        }
    }, [])

    const handleFilterChange = (event) => {
        setFilterText(event.target.value)
        setPage(0)
        if (event.target.value) {
            setTempAllPensioners(allPensioners.filter((pensioner) =>
                pensioner.cnic.includes(event.target.value)
            ))
        }
        else {
            setTempAllPensioners(allPensioners)
        }

    }
    const handleFilterName = (event) => {
        setFilterName(event.target.value)
        setPage(0)
        if (event.target.value) {
            setTempAllPensioners(allPensioners.filter((pensioner) =>
                pensioner.name.toLowerCase().includes(event.target.value.toLowerCase())
            ))
        }
        else {
            setTempAllPensioners(allPensioners)
        }

    }
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Handle change in rows per page
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);  // Reset the table to the first page whenever rows per page changes
    };
    const enableDisablePensioner = async (pensioner) => {
        try {
            await axios.post('https://fyp-enrollment-server.vercel.app/enableDisablePensioner', pensioner)
                .then((res) => {
                    if (res.data.message === 'Successfull') {
                        getPensioners()
                    }
                })
        } catch (error) {
            console.log(error.message);

        }
    }
    return (
        isAuthenticated && isAuthenticated=='admin' ?
        <>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="20%"
                padding="2rem"
                border="ActiveBorder"
                fullWidth
            >
                <Card sx={{ width: '90%', padding: '2rem', border: '2px solid black', borderRadius: '8px' }}>
                    <TableContainer>

                        <Box display="flex" justifyContent="flex-end" gap="10px" marginBottom="10px">

                            <Box>
                                <TextField
                                    label="Search By Name"
                                    variant="outlined"
                                    value={filterName}
                                    onChange={handleFilterName}
                                >

                                </TextField>
                            </Box>
                            <Box>
                                <TextField
                                    label="Search By CNIC"
                                    variant="outlined"
                                    value={filterText}
                                    onChange={handleFilterChange}
                                >

                                </TextField>
                            </Box>
                        </Box>
                        <hr></hr>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }} scope="col">Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }} scope="col">CNIC</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }} scope="col">Address</TableCell>
                                    <TableCell scope="col">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tempAllPensioners !== null ? tempAllPensioners.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((pensioner, index) => (
                                    <TableRow
                                        key={pensioner.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >

                                        <TableCell sx={{ fontSize: '1.1rem' }}>{pensioner.name}</TableCell>

                                        <TableCell sx={{ fontSize: '1.1rem' }}>{pensioner.cnic}</TableCell>
                                        <TableCell sx={{ fontSize: '1.1rem' }}>{pensioner.address}</TableCell>
                                        <TableCell align='center'>
                                            <IconButton color='secondary' onClick={() => enableDisablePensioner(pensioner)}>
                                                <Switch {...label} defaultChecked={pensioner.enable == false ? false : true} />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                )) : (<TableRow><TableCell>Loading... </TableCell></TableRow>)}
                            </TableBody>
                        </Table>
                        <TablePagination sx={{ fontSize: '1.1rem' }}
                            component="div"
                            count={allPensioners != null ? allPensioners.length : 0}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            rowsPerPageOptions={[5, 10, 25]}  // Options for rows per page
                        />
                    </TableContainer>
                    <hr></hr>
                </Card>
            </Box>
        </>
         : <>{navigate('/')}</>
    )
}
