import React from 'react';
import Home from "./pages/Home"
import LoginRegister from "./pages/LoginRegister";
import {Route, Routes, BrowserRouter as Router}  from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import TransactionHistory from './pages/TransactionHistory';

const App = ()=> {
  return (
    <React.Fragment>
    <Router>
    <ToastContainer />
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login-register" element={<LoginRegister/>}/>
        <Route path="/transaction-history" element={<TransactionHistory/>}/>
      </Routes>
    </Router>
    </React.Fragment>
  );
};

export default App;
