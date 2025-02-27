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
    const { adminInfo, setAdminInfo, operatorInfo, setOperatorInfo } = useContext(CreateContextApi)
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
    const login = async () => {
        if (user.email === '' || user.password === '') {
            toast.error('Please Fill the inputs fields', {
                autoClose: 1000
            })
        }
        else {
            setLoading(true)
            await axios.post(`https://fyp-enrollment-server.vercel.app/login`, user).then((res) => {
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
                            setAdminInfo(res.data.user)
                            navigate(`/manage-operators/${res.data.user._id}`);
                        }
                        else {
                            setOperatorInfo(res.data.user)
                            navigate(`/manage-pensioners/${res.data.user._id}`);
                        }
                    }, 1000);
                    setUser({})
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
