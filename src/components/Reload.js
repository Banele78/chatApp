import React, { useEffect } from 'react'
import {useLocation } from "react-router-dom"

function Reload() {
    const location = useLocation();
    
  useEffect(() => {
    // Check if the current pathname is not the desired route
    if (location.pathname !== "/") {
      // Redirect to the main page or any specific route
      window.location.href = "/";
    }
  }, []);
  return null;
    
}

export default Reload
