import React, { useContext, useEffect, useState } from 'react'
import './ManagePensioners.css'
import { useNavigate, useParams } from 'react-router-dom';
import { FaEdit } from "react-icons/fa";
import axios from 'axios';
import CreateContextApi from '../../ContextApi/CreateContextApi';


const UpdateModal = ({ show, onClose, pensioner }) => {

    const [currentPensioner, setCurrentPensioner] = useState({});

    useEffect(() => {
        if (pensioner) {
            console.log(pensioner);

            setCurrentPensioner({
                _id: pensioner._id,
                name: pensioner.name, username: pensioner.username, password: pensioner.password,
                number: pensioner.number, address: pensioner.address
            });
        }
    }, [pensioner])

    if (!show) return null;


    const handleSubmit = async () => {
        try {
            await axios.post(`http://localhost:3001/updatePensioner`, currentPensioner)
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
                <h2>Update Pensioner</h2>
                <label>Name:</label>
                <input
                    type="text"
                    value={currentPensioner.name}
                    onChange={(e) => setCurrentPensioner(prev => ({ ...prev, name: e.target.value }))}
                />
                <label>Username:</label>
                <input
                    type="text"
                    value={currentPensioner.username}
                    onChange={(e) => setCurrentPensioner(prev => ({ ...prev, username: e.target.value }))}
                />
                <label>Password:</label>
                <input
                    type="text"
                    value={currentPensioner.password}
                    onChange={(e) => setCurrentPensioner(prev => ({ ...prev, password: e.target.value }))}
                />
                <label>Number:</label>
                <input
                    type="text"
                    value={currentPensioner.number}
                    onChange={(e) => setCurrentPensioner(prev => ({ ...prev, number: e.target.value }))}
                />
                <label>Address:</label>
                <input
                    type="text"
                    value={currentPensioner.address}
                    onChange={(e) => setCurrentPensioner(prev => ({ ...prev, address: e.target.value }))}
                />
                <button onClick={handleSubmit}>Update</button>
            </div>
        </div>
    );
};

const AddModal = ({ show, onClose }) => {

    const [currentPensioner, setCurrentPensioner] = useState({ enable: true });

    useEffect(() => {
        generatePassword();
    }, []);

    // Function to generate a random password
    const generatePassword = () => {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
        let password = "";
        for (let i = 0; i < 8; i++) { // Generate 8-character long password
            const randomIndex = Math.floor(Math.random() * characters.length);
            password += characters.charAt(randomIndex);
        }
        setCurrentPensioner(prev => ({ ...prev, password }));
    };

    // Function to generate a username based on the name
    const generateUsername = (name) => {
        if (!name) return ""; // If no name is provided, return an empty string

        const randomDigits = Math.floor(Math.random() * 900) + 100; // Generate 3 random digits
        const username = `${name.toLowerCase()}_${randomDigits}`; // Add underscore and random digits
        setCurrentPensioner(prev => ({ ...prev, username }));
    };

    // When the name is updated, auto-generate the username
    const handleNameChange = (e) => {
        const name = e.target.value;
        setCurrentPensioner(prev => ({ ...prev, name }));
        generateUsername(name); // Generate username when name changes
    };

    if (!show) return null;

    const handleSubmit = async () => {
        try {
            const response = await axios.post(`http://localhost:3001/addPensioner`, currentPensioner);
            alert(response.data.mes);
            onClose(); // Close modal after success
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <span className="close-icon" onClick={onClose}>&times;</span>
                <h2>Add Pensioner</h2>

                <label>Name:</label>
                <input
                    type="text"
                    value={currentPensioner.name || ''}
                    onChange={handleNameChange}
                />

                <label>Username (auto-generated):</label>
                <input
                    type="text"
                    value={currentPensioner.username || ''}
                    readOnly // Make this field read-only to show the auto-generated username
                />

                <label>CNIC:</label>
                <input
                    type="text"
                    value={currentPensioner.cnic || ''}
                    onChange={(e) => setCurrentPensioner(prev => ({ ...prev, cnic: e.target.value }))}
                />

                <label>Email:</label>
                <input
                    type="text"
                    value={currentPensioner.email || ''}
                    onChange={(e) => setCurrentPensioner(prev => ({ ...prev, email: e.target.value }))}
                />

                <label>Password (auto-generated):</label>
                <input
                    type="text"
                    value={currentPensioner.password || ''}
                    readOnly // Password is auto-generated and cannot be changed
                />

                <label>Number:</label>
                <input
                    type="text"
                    value={currentPensioner.number || ''}
                    onChange={(e) => setCurrentPensioner(prev => ({ ...prev, number: e.target.value }))}
                />

                <label>Address:</label>
                <input
                    type="text"
                    value={currentPensioner.address || ''}
                    onChange={(e) => setCurrentPensioner(prev => ({ ...prev, address: e.target.value }))}
                />

                <label>DOB:</label>
                <input
                    type="date"
                    value={currentPensioner.dob || ''}
                    onChange={(e) => setCurrentPensioner(prev => ({ ...prev, dob: e.target.value }))}
                />

                <button onClick={handleSubmit}>Add</button>
            </div>
        </div>
    );
};


const UpdateAccountModal = ({ show, onClose, operatorInfo }) => {

    const [operator, setOperator] = useState({});

    useEffect(() => {
        if (operatorInfo) {
            setOperator({
                _id: operatorInfo._id,
                name: operatorInfo.name,
                username: operatorInfo.username,
                password: operatorInfo.password,
                number: operatorInfo.number,
                address: operatorInfo.address
            });
        }
    }, [operatorInfo])

    if (!show) return null;


    const handleSubmit = async () => {
        try {
            await axios.post(`http://localhost:3001/updateOperator`, operator)
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
                    value={operator.name}
                    onChange={(e) => setOperator(prev => ({ ...prev, name: e.target.value }))}
                />
                <label>Username:</label>
                <input
                    type="text"
                    value={operator.username}
                    onChange={(e) => setOperator(prev => ({ ...prev, username: e.target.value }))}
                />
                <label>Password:</label>
                <input
                    type="text"
                    value={operator.password}
                    onChange={(e) => setOperator(prev => ({ ...prev, password: e.target.value }))}
                />
                <label>Number:</label>
                <input
                    type="text"
                    value={operator.number}
                    onChange={(e) => setOperator(prev => ({ ...prev, number: e.target.value }))}
                />
                <label>Address:</label>
                <input
                    type="text"
                    value={operator.address}
                    onChange={(e) => setOperator(prev => ({ ...prev, address: e.target.value }))}
                />
                <button onClick={handleSubmit}>Update</button>
            </div>
        </div>
    );
};


export default function ManagePensioners() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isToggled, setIsToggled] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showAccountModal, setShowAccountModal] = useState(false);
    const [allPensioners, setAllPensioners] = useState([]);
    const [pensioner, setPensioner] = useState();
    const [isOpen, setIsOpen] = useState(false);
    const { operatorInfo, setOperatorInfo } = useContext(CreateContextApi)

    const getPensioners = async () => {
        let data = await fetch(`http://localhost:3001/getPensioners`);
        let res = await data.json();
        setAllPensioners(res);
    }

    const getAccountInfo = async () => {
        let data = await fetch(`http://localhost:3001/getAccountInfo/${id}`);
        let res = await data.json();
        setOperatorInfo(res);
    }

    useEffect(() => {
        getAccountInfo();
    }, [])

    useEffect(() => {
        if (allPensioners.length === 0) {
            getPensioners();
        }
    }, [])


    const handleClick = () => {
        setIsToggled(!isToggled);
    };
    const handleUpdateClick = (pensioner) => {
        setShowUpdateModal(true);
        setPensioner({
            _id: pensioner._id, name: pensioner.name, username: pensioner.username, password: pensioner.password,
            number: pensioner.number, address: pensioner.address
        })
    };
    const handleAddClick = () => {
        setShowAddModal(true);
    };

    const handleAccountClick = () => {
        setShowAccountModal(true)
    }

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    return (
        <>
            <>
                <div className="my-orders">
                    <div className="hamburger-container">
                        <div className="hamburger" onClick={toggleMenu}>
                            <div className={`bar ${isOpen ? 'open' : ''}`}></div>
                            <div className={`bar ${isOpen ? 'open' : ''}`}></div>
                            <div className={`bar ${isOpen ? 'open' : ''}`}></div>
                        </div>
                        {isOpen && (
                            <div className="dropdown">
                                <ul>
                                    <li onClick={() => handleAccountClick()}>Account</li>
                                    <li>Logout</li>
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className="my_orders_form">
                        <div className="top">
                            <h2>Manage <span>Pensioners</span></h2>
                            <button onClick={() => handleAddClick()}>Add Pensioner</button>
                        </div>
                        <table>
                            <tr>
                                <th>Name</th>
                                <th>Username</th>
                                <th>Password</th>
                                <th>Number</th>
                                <th>Address</th>
                                <th>Edit</th>
                            </tr>
                            {allPensioners.map((pensioner, index) => (
                                <tr key={index}>
                                    <td>{pensioner.name}</td>
                                    <td>{pensioner.username}</td>
                                    <td>{pensioner.password}</td>
                                    <td>{pensioner.number}</td>
                                    <td>{pensioner.address}</td>
                                    <td> <span style={{ fontSize: '20px', cursor: 'pointer' }} onClick={() => handleUpdateClick(pensioner)}><FaEdit /></span></td>
                                </tr>
                            ))}

                        </table>
                    </div>
                </div>
                <UpdateModal
                    show={showUpdateModal}
                    onClose={() => { setShowUpdateModal(false); getPensioners() }}
                    pensioner={pensioner}
                // onUpdate={handleUpdate}
                />
                <AddModal
                    show={showAddModal}
                    onClose={() => { setShowAddModal(false); getPensioners() }}
                // onUpdate={handleUpdate}
                />
                <UpdateAccountModal
                    show={showAccountModal}
                    onClose={() => { setShowAccountModal(false); getAccountInfo(); toggleMenu(); }}
                    operatorInfo={operatorInfo}
                // onUpdate={handleUpdate}
                />
                {/* <ToastContainer /> */}
            </>
        </>
    )
}
