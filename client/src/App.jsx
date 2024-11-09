import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import React from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import {Outlet, useLocation} from 'react-router-dom'

function App() {
  const location = useLocation();
  const showHeaderAndFooter = location.pathname !== '/login' && location.pathname !== '/signup'; // Check if the route is '/login or signup

  return (
    <div>
    {showHeaderAndFooter && <Header/> }
    <Outlet/>
    {showHeaderAndFooter && <Footer/> }
    </div>
  )
}

export default App;
