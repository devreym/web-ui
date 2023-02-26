import React from 'react'
import ReactDOM from "react-dom";
import { Routes, Route, Outlet, Link } from "react-router-dom";
import Home from './app/Home';
import Error from './app/Error';
import Booking from './app/Booking';

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/booking" element={<Booking />}></Route>
      </Routes>
    </div>
  );
}
