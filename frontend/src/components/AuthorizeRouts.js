import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

const PrivateRoute = ({children}) => {
  return isAuthenticated? children: <Navigate to="/login"/>;
};

export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return token && !isTokenExpired(token);
  };

const isTokenExpired = (token) => {
    if(!token) return true;
    const {exp} = jwtDecode(token);
    const currentTime = Date.now()/1000
    return exp<currentTime
}

export default PrivateRoute;

