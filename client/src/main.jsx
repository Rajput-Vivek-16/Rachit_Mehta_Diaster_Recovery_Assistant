import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Router, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import Home from './components/Home.jsx';
import Contact from './components/Contact.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path = '/'  element = {<App/>}>
      <Route path = ''  element = {<Home/>} />
      <Route path = 'contact'  element = {<Contact/>} />
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router = {router}/>
  </React.StrictMode>,
)
