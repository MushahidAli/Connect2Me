import React from 'react'
import Home from './components/home'
import Logon from './components/logon'
import './App.css'

function App() {

  const connect2me = localStorage.getItem('connect2me');

  return (
    <>
      {
        connect2me ?
          <Home />
          :
          <Logon />
      }
    </>
  )

}

export default App
