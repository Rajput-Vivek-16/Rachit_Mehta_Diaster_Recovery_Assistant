import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Router, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import Home from './components/Home.jsx';
import Contact from './components/Contact.jsx';
import Alerts from './components/Alerts.jsx'
import Login from './components/LoginPage.jsx'
import Signup from './components/SignUpPage.jsx'
import MapView from './components/MapView.jsx';
import UserFeedback from './components/UserFeedback.jsx';
import AccessibilityFeature from './components/AccessibilityFeature.jsx';
import RequestForm from './components/RequestForm.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path = '/'  element = {<App/>}>
      <Route path = ''  element = {<Home/>} />
      <Route path = 'alert'  element = {<Alerts/>} />
      <Route path = 'mapview'  element = {<MapView/>} />
      <Route path = 'userfeedback'  element = {<UserFeedback/>} />
      <Route path = 'accessibility-feature'  element = {<AccessibilityFeature/>} />
      <Route path = 'request-form'  element = {<RequestForm/>} />
      <Route path = 'login'  element = {<Login/>} />
      <Route path = 'signup'  element = {<Signup/>} />
      <Route path = 'contact'  element = {<Contact/>} />
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router = {router}/>
  </React.StrictMode>,
)
