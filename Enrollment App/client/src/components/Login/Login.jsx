import React, { useContext, useEffect, useState } from 'react'
import { BsFillPersonFill, } from 'react-icons/bs'
import { RiLockPasswordFill } from 'react-icons/ri'
import './Login.css'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import CreateContextApi from '../../ContextApi/CreateContextApi';


export default function Login() {
    const navigate = useNavigate();
    const { setAdminInfo, setOperatorInfo, setIsAuthenticated } = useContext(CreateContextApi)
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({
        email: '',
        password: ''
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user, [name]: value
        })
    }
    const validateFields = () => {

        if (!user.email && !user.password) {
            alert("Email and password required.");
            return false;
        }
        if (!user.email) {
            alert("Email is required.");
            return false;
        }
        if (!user.password) {
            alert("Password is required.");
            return false;
        }
        if (user.password.length < 8 || user.password.length > 13) {
            alert("Password must be between 8 to 13  characters.");
            return false;
        }
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(user.email)) {
            alert("Invalid email format.");
            return false;
        }
        // Check if password contains only allowed characters and no whitespace
        if (!/^[a-z0-9@_]+$/.test(user.password)) {
            alert("Password should contain only lowercase letters, digits, '@', '_', and no whitespace.");
            return false;
        }


        return true;
    };

    useEffect(() => {
        const checkAuthToken = async () => {
            try {
                const token = localStorage.getItem('authToken');
                
                // Check if the authToken is available (from cookies or local storage)
                const response = await axios.post('https://fyp-enrollment-server.vercel.app/verify-token', {token:token}, {
                    withCredentials: true,
                });

                if (response.data.isAuthenticated) {
                    if (response.data.role === 'admin') {
                        // If the token is valid, redirect the user
                        navigate(`/manage-operators/${response.data.userId}`);
                    }
                    else {
                        navigate(`/manage-pensioners/${response.data.userId}`);
                    }
                }
            } catch (error) {
                console.log('User is not authenticated or token is invalid.');
            }
        };

        checkAuthToken();
    }, []);

    const login = async () => {
        if (!validateFields()) return;
        else {
            setLoading(true)
            await axios.post(`https://fyp-enrollment-server.vercel.app/login`, user,
                { withCredentials: true }).then((res) => {
                    // setLoading(!loading)
                    if (res.data.mes === 'Login Successfull') {
                        toast.success(res.data.mes, {
                            autoClose: 1000
                        })
                        // var date = new Date();
                        // date.setTime(date.getTime() + (30 * 1000));
                        // Cookies.set(`token${res.data.user._id}`, res.data.token,{expires:1})
                        setTimeout(() => {
                            if (res.data.user.role === 'admin') {
                                setIsAuthenticated('admin')
                                setAdminInfo(res.data.user)
                                navigate(`/manage-operators/${res.data.user._id}`);
                            }
                            else {
                                setIsAuthenticated('operator')
                                setOperatorInfo(res.data.user)
                                navigate(`/manage-pensioners/${res.data.user._id}`);
                            }
                        }, 1000);
                        setUser({})
                        localStorage.setItem('authToken', res.data.token)
                        localStorage.setItem('role', res.data.user.role)
                    }
                    else {
                        toast.error(res.data.mes, {
                            autoClose: 1000
                        })
                    }
                })
            setLoading(false)
        }

    }


    return (
        <>
            <div className="login">
                <div className="login-form">
                    <h2><span>LOG</span> IN</h2>
                    <div className="email">
                        <div className="icon"> <BsFillPersonFill /></div>
                        <input type="text" name="email" id="" placeholder='Email' onChange={(e) => { handleChange(e) }} />
                    </div>
                    <div className="password">
                        <div className="icon"> <RiLockPasswordFill /></div>
                        <input type="password" name="password" id="" placeholder='Password' onChange={(e) => { handleChange(e) }} />
                    </div>
                    <button disabled={loading} className='submit-btn' onClick={() => login()}>Log In</button>
                </div>
            </div>
            <ToastContainer />
        </>
    )
}
