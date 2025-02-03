import React, { useContext, useEffect, useState } from 'react'
import {
    Box,
    IconButton, Button, TextField,
    Card
}
    from '@mui/material'
import Table from '@mui/material/Table';
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

const UpdateAccountModal = ({ show, onClose, adminInfo }) => {

    const [admin, setAdmin] = useState({});

    useEffect(() => {
        if (adminInfo) {
            setAdmin({
                _id: adminInfo._id,
                name: adminInfo.name,
                username: adminInfo.username,
                password: adminInfo.password,
                number: adminInfo.number,
                address: adminInfo.address
            });
        }
    }, [adminInfo])

    if (!show) return null;

    const validateFields = () => {
        const { name, username, password, number, address } = adminInfo;

        if (!name || !username || !number || !address || !password) {
            alert("Any Field is required.");
            return false;
        }

        // Check if username only contains lowercase letters, underscores, and digits
        if (!/^[a-z0-9_]+$/.test(username)) {
            alert("Username should contain only lowercase letters, underscores, and digits.");
            return false;
        }

        // Check if password contains only allowed characters and no whitespace
        if (!/^[a-z0-9@_]+$/.test(password)) {
            alert("Password should contain only lowercase letters, digits, '@', '_', and no whitespace.");
            return false;
        }

        // Check if number contains only digits
        if (!/^\d+$/.test(number)) {
            alert("Number should contain only digits.");
            return false;
        }

        return true;
    };


    const handleSubmit = async () => {
        if (!validateFields()) return;
        try {
            await axios.post(`http://localhost:3001/updateOperator`, admin)
                .then((res) => {
                    alert(res.data.message);
                    onClose()
                })

        } catch (error) {
            alert(err.message)
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <span className="close-icon" onClick={onClose}>&times;</span>
                <h2>Update Account Info</h2>
                <label>Name:</label>
                <input
                    type="text"
                    value={admin.name}
                    onChange={(e) => setAdmin(prev => ({ ...prev, name: e.target.value }))}
                    maxLength={10}
                />
                <label>Username:</label>
                <input
                    type="text"
                    value={admin.username}
                    onChange={(e) => setAdmin(prev => ({ ...prev, username: e.target.value }))}
                    maxLength={14}
                />
                <label>Password:</label>
                <input
                    type="text"
                    value={admin.password}
                    onChange={(e) => setAdmin(prev => ({ ...prev, password: e.target.value }))}
                    maxLength={13}
                />
                <label>Number:</label>
                <input
                    type="text"
                    value={admin.number}
                    onChange={(e) => setAdmin(prev => ({ ...prev, number: e.target.value }))}
                    maxLength={11}
                />
                <label>Address:</label>
                <input
                    type="text"
                    value={admin.address}
                    onChange={(e) => setAdmin(prev => ({ ...prev, address: e.target.value }))}
                    maxLength={35}
                />
                <button onClick={handleSubmit}>Update</button>
            </div>
        </div>
    );
};


export default function EnableDisablePensioner() {
    const [allPensioners, setAllPensioners] = useState([]);
    const { adminInfo, setAdminInfo } = useContext(CreateContextApi)
    const [filterText, setFilterText] = useState("")
    const [showAccountModal, setShowAccountModal] = useState(false);
    const [tempAllPensioners, setTempAllPensioners] = useState([]);
    const [page, setPage] = useState(0);  // Current page index
    const [rowsPerPage, setRowsPerPage] = useState(5);  // Number of rows per page

    const getAccountInfo = async () => {
        let data = await fetch(`http://localhost:3001/getAccountInfo/${id}`);
        let res = await data.json();
        setAdminInfo(res);
    }

    const getPensioners = async () => {
        let data = await fetch(`http://localhost:3001/getPensioners`);
        let res = await data.json();
        setAllPensioners(res);
        setTempAllPensioners(res)
    }
    useEffect(() => {
        if (allPensioners.length === 0) {
            getPensioners();
        }
    }, [])
    useEffect(() => {
        getAccountInfo()
    }, [])

    const handleFilterChange = (event) => {
        setFilterText(event.target.value)
        setPage(0)
        if (event.target.value) {
            setTempAllPensioners(allPensioners.filter((pensioner) =>
                pensioner.name.toLowerCase().includes(filterText.toLowerCase())
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
            await axios.post('http://localhost:3001/enableDisablePensioner', pensioner)
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
                <Card sx={{ width: '80%', padding: '2rem', border: '2px solid black', borderRadius: '8px' }}>
                    <TableContainer>

                        <Box display="flex" justifyContent="flex-end" >
                            <TextField
                                label="Search pensioner"
                                variant="outlined"
                                value={filterText}
                                onChange={handleFilterChange}
                            >

                            </TextField>
                        </Box>
                        <hr></hr>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }} scope="col">#</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }} scope="col">Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }} scope="col">Username</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }} scope='col'>Password</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }} scope="col">Sessions</TableCell>
                                    <TableCell scope="col">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tempAllPensioners !== null ? tempAllPensioners.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((pensioner, index) => (
                                    <TableRow
                                        key={pensioner.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell sx={{ fontSize: '1.1rem' }} scope="row">{page * rowsPerPage + index + 1}</TableCell>

                                        <TableCell sx={{ fontSize: '1.1rem' }}>{pensioner.name}</TableCell>

                                        <TableCell sx={{ fontSize: '1.1rem' }}>{pensioner.username}</TableCell>
                                        <TableCell sx={{ fontSize: '1.1rem' }}>{pensioner.password}</TableCell>
                                        <TableCell sx={{ fontSize: '1.1rem' }}>{pensioner.sessions.length}</TableCell>
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
            <UpdateAccountModal
                show={showAccountModal}
                onClose={() => { setShowAccountModal(false); getAccountInfo(); toggleMenu(); }}
                adminInfo={adminInfo}
            // onUpdate={handleUpdate}
            />
        </>
    )
}
