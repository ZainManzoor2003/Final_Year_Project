import React, { useContext, useEffect, useState } from 'react'
import './ManageOperators.css'
import { useNavigate, useParams } from 'react-router-dom';
import { FaEdit } from "react-icons/fa";
import axios from 'axios';
import CreateContextApi from '../../ContextApi/CreateContextApi';



const UpdateModal = ({ show, onClose, operator }) => {

  const [currentOperator, setCurrentOperator] = useState({});

  useEffect(() => {
    if (operator) {
      setCurrentOperator({
        _id: operator._id,
        name: operator.name,
        username: operator.username,
        password: operator.password,
        number: operator.number,
        address: operator.address
      });
    }
  }, [operator])

  if (!show) return null;

  const validateFields = () => {
    const { name, username, password, number, address } = currentOperator;

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
      await axios.post(`http://localhost:3001/updateOperator`, currentOperator)
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
        <h2>Update Data Entry Operator</h2>
        <label>Name:</label>
        <input
          type="text"
          value={currentOperator.name}
          onChange={(e) => setCurrentOperator(prev => ({ ...prev, name: e.target.value }))}
          maxLength={10}
        />
        <label>Username:</label>
        <input
          type="text"
          value={currentOperator.username}
          onChange={(e) => setCurrentOperator(prev => ({ ...prev, username: e.target.value }))}
          maxLength={14}
        />
        <label>Password:</label>
        <input
          type="text"
          value={currentOperator.password}
          onChange={(e) => setCurrentOperator(prev => ({ ...prev, password: e.target.value }))}
          maxLength={13}
        />
        <label>Number:</label>
        <input
          type="text"
          value={currentOperator.number}
          onChange={(e) => setCurrentOperator(prev => ({ ...prev, number: e.target.value }))}
          maxLength={11}
        />
        <label>Address:</label>
        <input
          type="text"
          value={currentOperator.address}
          onChange={(e) => setCurrentOperator(prev => ({ ...prev, address: e.target.value }))}
          maxLength={35}
        />
        <button onClick={handleSubmit}>Update</button>
      </div>
    </div>
  );
};
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

const AddModal = ({ show, onClose }) => {


  const [currentOperator, setCurrentOperator] = useState({ role: 'operator', enable: true });

  const generatePassword = () => {
    // Define the allowed characters: lowercase letters, numbers, and @, _
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789@_";
    let password = "";
    const passwordLength = 8; // You can adjust the length as needed

    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters.charAt(randomIndex);
    }

    setCurrentOperator(prev => ({ ...prev, password }));
  };


  useEffect(() => {
    generatePassword();
  }, []);

  if (!show) return null;



  // Function to generate a random password
  

  // // Function to generate a username based on the name
  const generateUsername = (name) => {
    if (!name) return ""; // If no name is provided, return an empty string

    const randomDigits = Math.floor(Math.random() * 900) + 100; // Generate 3 random digits
    const username = `${name.toLowerCase()}_${randomDigits}`; // Add underscore and random digits
    setCurrentOperator(prev => ({ ...prev, username }));
  };

  // // When the name is updated, auto-generate the username
  const handleNameChange = (e) => {
    const name = e.target.value;
    setCurrentOperator(prev => ({ ...prev, name }));
    generateUsername(name); // Generate username when name changes
  };

  const validateFields = () => {
    const { name, cnic, email, number, address, dob } = currentOperator;

    if (!name || !cnic || !email || !number || !address || !dob) {
      alert("Any field is required.");
      return false;
    }

    if (!/^\d+$/.test(cnic)) {
      alert("CNIC should contain only numbers.");
      return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      alert("Invalid email format.");
      return false;
    }

    if (!/^\d+$/.test(number)) {
      alert("Number should contain only digits.");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;
    try {
      await axios.post(`http://localhost:3001/addOperator`, currentOperator)
        .then((res) => {
          alert(res.data.mes);
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
        <h2>Add Data Entry Operator</h2>
        <label>Name:</label>
        <input
          type="text"
          value={currentOperator.name || ''}
          onChange={handleNameChange}
          maxLength={10}
        />

        <label>Username (auto-generated):</label>
        <input
          type="text"
          value={currentOperator.username || ''}
          readOnly // Make this field read-only to show the auto-generated username
        />

        <label>CNIC:</label>
        <input
          type="text"
          value={currentOperator.cnic || ''}
          onChange={(e) => setCurrentOperator(prev => ({ ...prev, cnic: e.target.value }))}
          maxLength={13}
        />

        <label>Email:</label>
        <input
          type="text"
          value={currentOperator.email || ''}
          onChange={(e) => setCurrentOperator(prev => ({ ...prev, email: e.target.value }))}
          maxLength={30}
        />

        <label>Password (auto-generated):</label>
        <input
          type="text"
          value={currentOperator.password || ''}
          readOnly // Password is auto-generated and cannot be changed
        />

        <label>Number:</label>
        <input
          type="text"
          value={currentOperator.number || ''}
          onChange={(e) => setCurrentOperator(prev => ({ ...prev, number: e.target.value }))}
          maxLength={11}
        />

        <label>Address:</label>
        <input
          type="text"
          value={currentOperator.address || ''}
          onChange={(e) => setCurrentOperator(prev => ({ ...prev, address: e.target.value }))}
          maxLength={35}
        />

        <label>DOB:</label>
        <input
          type="date"
          value={currentOperator.dob || ''}
          onChange={(e) => setCurrentOperator(prev => ({ ...prev, dob: e.target.value }))}
        />
        <button onClick={handleSubmit}>Add</button>
      </div>
    </div>
  );
};


export default function ManageOperators() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isToggled, setIsToggled] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [allOperators, setAllOperators] = useState([]);
  const [allPensioners, setAllPensioners] = useState([]);
  const [operator, setOperator] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const { adminInfo, setAdminInfo } = useContext(CreateContextApi)

  const getOperators = async () => {
    let data = await fetch(`http://localhost:3001/getOperators`);
    let res = await data.json();
    setAllOperators(res);
  }
  const getPensioners = async () => {
    let data = await fetch(`http://localhost:3001/getPensioners`);
    let res = await data.json();
    setAllPensioners(res);
  }

  const getAccountInfo = async () => {
    let data = await fetch(`http://localhost:3001/getAccountInfo/${id}`);
    let res = await data.json();
    setAdminInfo(res);
  }

  useEffect(() => {
    getAccountInfo();
  }, [])
  useEffect(() => {
    if (allOperators.length === 0) {
      getOperators();
    }
  }, [])
  useEffect(() => {
    if (allPensioners.length === 0) {
      getPensioners();
    }
  }, [])


  const handleClick = () => {
    setIsToggled(!isToggled);
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
  const enableDisableOperator = async (operator) => {
    try {
      await axios.post('http://localhost:3001/enableDisableOperator', operator)
        .then((res) => {
          if (res.data.message === 'Successfull') {
            getOperators()
          }
        })
    } catch (error) {
      console.log(error.message);

    }
  }
  const handleUpdateClick = (operator) => {
    setShowUpdateModal(true);
    setOperator({
      _id: operator._id, name: operator.name, username: operator.username, password: operator.password,
      number: operator.number, address: operator.address
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
            <h2>Data Entry <span>Operators</span> </h2>
            <button onClick={() => handleAddClick()}>Add Data Entry Operator</button>
          </div>
          <table>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Password</th>
              <th>Number</th>
              <th>Address</th>
              <th>Edit</th>
              <th>Enable / Disable</th>
            </tr>
            {allOperators.map((operator, index) => (
              <tr key={index}>
                <td>{operator.name}</td>
                <td>{operator.username}</td>
                <td>{operator.password}</td>
                <td>{operator.number}</td>
                <td>{operator.address}</td>
                <td> <span style={{ fontSize: '20px', cursor: 'pointer' }} onClick={() => handleUpdateClick(operator)}><FaEdit /></span></td>
                <td id='enable' onClick={() => enableDisableOperator(operator)}>{operator.enable !== true ? 'Enable' : 'Disable'}</td>
                {/* <td> <div
                    className={`toggle-button ${isToggled ? "toggled" : ""}`}
                    onClick={handleClick}
                  >
                    <div className="circle"></div>
                  </div></td> */}
              </tr>
            ))}

          </table>
        </div>
        <div className="my_orders_form">
          <div className="top">
            <h2>Enable / Disable <span>Pensioners</span></h2>
          </div>
          <table>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Password</th>
              <th>Sessions</th>
              <th>Enable / Disable</th>
            </tr>
            {allPensioners.map((pensioner, index) => (
              <tr key={index}>
                <td>{pensioner.name}</td>
                <td>{pensioner.username}</td>
                <td>{pensioner.password}</td>
                <td>{pensioner.sessions.length}</td>
                <td id='enable' onClick={() => enableDisablePensioner(pensioner)}>{pensioner.enable !== true ? 'Enable' : 'Disable'}</td>
                {/* <td> <div
                    className={`toggle-button ${isToggled ? "toggled" : ""}`}
                    onClick={handleClick}
                  >
                    <div className="circle"></div>
                  </div></td> */}
              </tr>
            ))}

          </table>
        </div>
      </div>
      <AddModal
        show={showAddModal}
        onClose={() => { setShowAddModal(false); getOperators() }}
      // onUpdate={handleUpdate}
      />
      <UpdateModal
        show={showUpdateModal}
        onClose={() => { setShowUpdateModal(false); getOperators() }}
        operator={operator}
      // onUpdate={handleUpdate}
      />
      <UpdateAccountModal
        show={showAccountModal}
        onClose={() => { setShowAccountModal(false); getAccountInfo(); toggleMenu(); }}
        adminInfo={adminInfo}
      // onUpdate={handleUpdate}
      />
      {/* <ToastContainer /> */}
    </>
  )
}
