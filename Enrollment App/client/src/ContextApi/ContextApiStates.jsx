import CreateContextApi from './CreateContextApi'
import React, { useState } from 'react'

export default function ContextApiStates(props) {
  const [adminInfo, setAdminInfo] = useState({})
  const [operatorInfo, setOperatorInfo] = useState({})


  return (
    <>
      <CreateContextApi.Provider value={{ adminInfo, setAdminInfo, operatorInfo, setOperatorInfo }}>
        {props.children}
      </CreateContextApi.Provider>
    </>
  )
}
