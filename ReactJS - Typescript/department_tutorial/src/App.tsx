import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { DepartmentDetails } from './Components/DepartmentDetails';
import { EmployeeDetails } from './Components/EmployeeDetails';
import { HomePage } from './Components/HomePage';

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/department' Component={DepartmentDetails}></Route>
          <Route path='/employee' Component={EmployeeDetails}></Route>
          <Route path='/' Component={HomePage}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
