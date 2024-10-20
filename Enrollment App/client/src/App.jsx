import Login from './components/Login/Login'
import { Routes, Route } from 'react-router-dom'
import ManageOperators from './components/ManageOperators/ManageOperators'
import AddOperators from './components/ManageOperators/AddOperators'
import ManagePensioners from './components/ManagePensioners/ManagePensioners'
import ContextApiStates from './ContextApi/ContextApiStates'


function App() {

  return (
    <>
      <Routes>
        <Route exact path="/" element={<><ContextApiStates><Login /></ContextApiStates></>}></Route>
        <Route exact path="/manage-operators/:id" element={<><ContextApiStates><ManageOperators /></ContextApiStates></>}></Route>
        <Route exact path="/manage-pensioners/:id" element={<><ContextApiStates><ManagePensioners /></ContextApiStates></>}></Route>
        <Route exact path="/manage-operators/add" element={<><AddOperators /></>}></Route>
      </Routes>
    </>
  )
}

export default App
