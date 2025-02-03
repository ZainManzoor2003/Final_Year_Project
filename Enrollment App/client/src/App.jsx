import Login from './components/Login/Login'
import { Routes, Route } from 'react-router-dom'
import ManageOperators from './components/ManageOperators/ManageOperators'
import ManagePensioners from './components/ManagePensioners/ManagePensioners'
import ContextApiStates from './ContextApi/ContextApiStates'
import Navbar from './components/Navbar/Navbar'
import EnableDisablePensioner from './components/ManageOperators/EnableDisablePensioner'


function App() {

  return (
    <>
      <Routes>
        <Route exact path="/" element={<><ContextApiStates><Login /></ContextApiStates></>}></Route>
        <Route exact path="/manage-operators/:id" element={<><ContextApiStates><Navbar/><ManageOperators /></ContextApiStates></>}></Route>
        <Route exact path="/en-dis-pensioners/:id" element={<><ContextApiStates><Navbar/><EnableDisablePensioner /></ContextApiStates></>}></Route>
        <Route exact path="/manage-pensioners/:id" element={<><ContextApiStates><Navbar/><ManagePensioners /></ContextApiStates></>}></Route>
      </Routes>
    </>
  )
}

export default App
