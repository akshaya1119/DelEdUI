import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdmitCardPage from "./AdmitCardPage";
import SeatMatrix from "../SeatMatrix";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/seat-matrix" element={<AdmitCardPage />} />
        <Route path="/" element={<SeatMatrix />} />
      </Routes>
    </Router>
  );
};

export default App;
