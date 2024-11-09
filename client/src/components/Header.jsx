import React from 'react'
import { Link, NavLink } from 'react-router-dom';
function Header(){
    return (
        <header className='shadow sticky z-50 top-0'>
        <nav className='bg-white border-gray-200 px-4 lg:px-6 py-2 mx-auto max-w-screen-xl'>
          <div className="flex flex-wrap justify-between items-center">
            <Link to="/" className="flex items-center">
              <img
                src="https://m.media-amazon.com/images/I/718XLB6HowL._SL1500_.jpg"
                className="mr-3 h-6"
                alt="Logo"
                />
            </Link>
  
            <div className=" hidden lg:flex justify-between  items-center w-full lg:w-auto lg:order-1" id="mobile-menu-2">
              <ul className='flex flex-col lg:flex-row mt-4 lg:mt-0 text-sm lg:space-x-8' >
                <li>
                  <NavLink to = "/" className={({isActive}) => `block font-semibold lg:hover:bg-transparent
                  hover:text-orange-700 hover:focus:border-b  hover:border-red-500 duration-200 lg:p-0 py-2
                  ${isActive ? "text-orange-700" : "text-gray-700"}`}>
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink to = "/alert" className={({isActive}) => `block font-semibold lg:hover:bg-transparent
                  hover:text-orange-700 hover:focus:border-b  hover:border-red-500 duration-200 lg:p-0 py-2
                  ${isActive ? "text-orange-700" : "text-gray-700"}`}>
                    Alerts
                  </NavLink>
                </li>
                <li>
                  <NavLink to = "/nearest-health-care" className={({isActive}) => `block font-semibold lg:hover:bg-transparent
                  hover:text-orange-700 hover:focus:border-b  hover:border-red-500 duration-200 lg:p-0 py-2
                  ${isActive ? "text-orange-700" : "text-gray-700"}`}>
                    Nearest Health Care
                  </NavLink>
                </li>
                <li>
                  <NavLink to = "/userfeedback" className={({isActive}) => `block font-semibold lg:hover:bg-transparent
                  hover:text-orange-700 hover:focus:border-b  hover:border-red-500 duration-200 lg:p-0 py-2
                  ${isActive ? "text-orange-700" : "text-gray-700"}`}>
                    User Feedback
                  </NavLink>
                </li>
                <li>
                  <NavLink to = "/accessibility-feature" className={({isActive}) => `block font-semibold lg:hover:bg-transparent
                  hover:text-orange-700 hover:focus:border-b  hover:border-red-500 duration-200 lg:p-0 py-2
                  ${isActive ? "text-orange-700" : "text-gray-700"}`}>
                    Accessibility Feature                  
                </NavLink>
                </li>
        
              </ul>
            </div>
  
  
  
            <div className="flex items-center lg:order-2 gap-2">
              <Link
                to="/login"
                className="text-gray-800 hover:bg-gray-50 focus:ring-2 focus:ring-gray-300 font-medium rounded-lg text-sm px-2.5 lg:px-3 py-1 lg:py-1.5 mr-2 focus:outline-none"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className='text-white bg-orange-700 font-medium rounded-lg text-sm mr-2 focus:outline-none px-2.5 lg:px-3 py-1 lg:py-1.5 hover:bg-orange-800 focus:ring-2 focus:ring-orange-300'>
                Get Started
              </Link>
            </div>
          </div>
        </nav>
      </header>
    )
}

export default Header;
