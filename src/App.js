import React from 'react'
import ReactDOM from "react-dom";
import { Routes, Route, Outlet, Link } from "react-router-dom";
import Home from './app/Home';
import Error from './app/Error';

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/error" element={<Error />}></Route>
      </Routes>
    </div>
  );
}
