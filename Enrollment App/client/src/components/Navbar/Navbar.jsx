import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import * as React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import CreateContextApi from '../../ContextApi/CreateContextApi';
import axios from 'axios';
import Cookies from "js-cookie";



const pages = ['Manage Operators', 'Enable-Disable Pensioner'];
const settings = ['Account', 'Logout'];

const UpdateAccountModal = ({ show, onClose, adminInfo }) => {

    const [admin, setAdmin] = React.useState({});

    React.useEffect(() => {
        if (adminInfo) {
            setAdmin({
                _id: adminInfo._id,
                name: adminInfo.name,
                password: adminInfo.password,
                number: adminInfo.number,
                address: adminInfo.address,
                email: adminInfo.email,
                cnic: adminInfo.cnic
            });
        }
    }, [adminInfo])

    if (!show) return null;

    const validateFields = () => {
        const { name, password, number, address } = admin;

        if (!name) {
            alert("Name is required.");
            return false;
        }
        if (!/[A-Za-z]/.test(name)) {
            alert("Only Spaces are not allowed.");
            return false;

        }
        if (!number) {
            alert("Number is required.");
            return false;
        }
        if (number.length < 11) {
            alert("Number must be 11 digits.");
            return false;
        }
        if (!address) {
            alert("Address is required.");
            return false;
        }
        if (!/[A-Za-z]/.test(address)) {
            alert("Only Spaces are not allowed.");
            return false;

        }
        if (!password) {
            alert("Password is required.");
            return false;
        }
        if (password.length < 8 || password.length > 13) {
            alert("Password must be between 8 to 13  characters.");
            return false;
        }
        // Check if password contains only allowed characters and no whitespace
        if (!/^[a-z0-9@_]+$/.test(password)) {
            alert("Password should contain only lowercase letters, digits, '@', '_', and no whitespace.");
            return false;
        }


        return true;
    };


    const handleSubmit = async () => {
        if (!validateFields()) return;
        try {
            await axios.post(`https://fyp-enrollment-server.vercel.app/updateOperator`, admin)
                .then((res) => {
                    alert(res.data.message);
                    onClose()
                })

        } catch (err) {
            alert(err.message)
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <span className="close-icon" onClick={onClose}>&times;</span>
                <h2>Update Account Info</h2>
                <label>Name:*</label>
                <input
                    type="text"
                    value={admin.name}
                    onChange={(e) => {
                        const value = e.target.value.replace(/[^A-Za-z\s]/g, "");
                        setAdmin(prev => ({ ...prev, name: value }))
                    }}
                    maxLength={30}
                />
                <label>Password:*</label>
                <input
                    type="password"
                    value={admin.password}
                    onChange={(e) => setAdmin(prev => ({ ...prev, password: e.target.value }))}
                    maxLength={13}
                />
                <label>Number:*</label>
                <input
                    type="text"
                    value={admin.number}
                    onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, "");
                        setAdmin(prev => ({ ...prev, number: value }))
                    }}
                    maxLength={11}
                />
                <label>Address:*</label>
                <input
                    type="text"
                    value={admin.address}
                    onChange={(e) => setAdmin(prev => ({ ...prev, address: e.target.value }))}
                    maxLength={70}
                />
                <label>CNIC:</label>
                <input
                    type="text"
                    value={admin.cnic}
                    disabled
                />
                <label>Email:</label>
                <input
                    type="text"
                    value={admin.email}
                    disabled
                />
                <button onClick={handleSubmit}>Update</button>
            </div>
        </div>
    );
};

function Navbar() {
    const location = useLocation();
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const navigate = useNavigate()
    const { id } = useParams()
    const [showAccountModal, setShowAccountModal] = React.useState(false);
    const { adminInfo, setAdminInfo, setIsAuthenticated } = React.useContext(CreateContextApi)

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    const handleAccountClick = () => {
        setAnchorElUser(null);
        setShowAccountModal(true)
    }

    const getAccountInfo = async () => {
        let data = await fetch(`https://fyp-enrollment-server.vercel.app/getAccountInfo/${id}`);
        let res = await data.json();
        setAdminInfo(res);
    }
    const handleLogout = async () => {
        localStorage.removeItem('authToken')
        localStorage.removeItem('role')
        setIsAuthenticated('')
        navigate('/')
        // try {
        //     await axios.post("https://fyp-enrollment-server.vercel.app/logout", {}, { withCredentials: true });
        //     setIsAdminAuthenticated(false)
        //     setIsOperatorAuthenticated(false)
        //     navigate('/')
        // } catch (error) {
        //     console.error("Logout failed:", error);
        // }

    }

    React.useEffect(() => {
        getAccountInfo();
    }, [])

    return (
        <>
            <AppBar position="static">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href=""
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            Enrollment System
                        </Typography>

                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{ display: { xs: 'block', md: 'none' } }}
                            >
                                {location && id && location.pathname === `/manage-operators/${id}` ||
                                    location.pathname === `/en-dis-pensioners/${id}` ? pages.map((page) => (
                                        <MenuItem key={page} onClick={handleCloseNavMenu}>
                                            <Typography sx={{ textAlign: 'center' }} onClick={() =>
                                                page.includes('Operators')
                                                    ? navigate(`/manage-operators/${id}`) // Ensure absolute path
                                                    : navigate(`/en-dis-pensioners/${id}`) // Ensure absolute path
                                            }>{page}
                                            </Typography>
                                        </MenuItem>
                                    )) :
                                    <MenuItem key={'manage-pensioner'} onClick={handleCloseNavMenu}>
                                        <Typography sx={{ textAlign: 'center' }} onClick={() =>
                                            navigate(`/manage-pensioners/${id}`) // Ensure absolute path
                                        }>Manage Pensioner
                                        </Typography>
                                    </MenuItem>}
                            </Menu>
                        </Box>
                        <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                        <Typography
                            variant="h5"
                            noWrap
                            component="a"
                            href=""
                            sx={{
                                mr: 2,
                                display: { xs: 'flex', md: 'none' },
                                flexGrow: 1,
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            Enrollment System
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            {location && id && location.pathname === `/manage-operators/${id}` ||
                                location.pathname === `/en-dis-pensioners/${id}` ? pages.map((page) => (
                                    <MenuItem key={page} onClick={handleCloseNavMenu}>
                                        <Typography sx={{ textAlign: 'center' }} onClick={() =>
                                            page.includes('Operators')
                                                ? navigate(`/manage-operators/${id}`) // Ensure absolute path
                                                : navigate(`/en-dis-pensioners/${id}`) // Ensure absolute path
                                        }>{page}
                                        </Typography>
                                    </MenuItem>
                                )) :
                                <MenuItem key={'manage-pensioner'} onClick={handleCloseNavMenu}>
                                    <Typography sx={{ textAlign: 'center' }} onClick={() =>
                                        navigate(`/manage-pensioners/${id}`) // Ensure absolute path
                                    }>Manage Pensioner
                                    </Typography>
                                </MenuItem>}
                        </Box>
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt="Remy Sharp" src="" />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                <MenuItem key={'account'} onClick={handleAccountClick}>
                                    <Typography sx={{ textAlign: 'center' }}>Account</Typography>
                                </MenuItem>
                                <MenuItem key={'logout'} onClick={handleLogout}>
                                    <Typography sx={{ textAlign: 'center' }}>Logout</Typography>
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <UpdateAccountModal
                show={showAccountModal}
                onClose={() => { setShowAccountModal(false); getAccountInfo(); }}
                adminInfo={adminInfo}
            // onUpdate={handleUpdate}
            />
        </>
    );
}
export default Navbar;