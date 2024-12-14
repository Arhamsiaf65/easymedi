import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../../context/loginContext";

const SanSarif = styled.div`
  font-family: "Quicksand", sans-serif;
  font-optical-sizing: auto;
  font-weight: 600;
  font-style: normal;
`;

function NavBar() {
  const { user, logout } = useLogin();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLoginClick = () => {
    if (user) {
      logout();
    } else {
      navigate("/login");  // Navigate to the login page
    }
  };

  return (
    <SanSarif className="absolute top-0 left-0 w-full z-10 p-4">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto">
        <img
          src="/logo.png"
          className="w-[8rem] h-[3.4rem] scale-150 object-cover"
          alt="Logo"
        />

        <div className="flex md:order-2 space-x-3">
          <button
            type="button"
            className="hidden md:block text-[#03A398] hover:text-white border border-[#03A398] hover:bg-[#03A398] focus:ring-4 focus:outline-none focus:ring-[#03A398] font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors duration-300 ease-in-out"
            onClick={handleLoginClick}
          >
            {user ? "Logout" : "Login"}
          </button>

          <button
            onClick={toggleMenu}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-controls="navbar-sticky"
            aria-expanded={isOpen ? "true" : "false"}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
      </div>
    </SanSarif>
  );
}

export default NavBar;
