import { Routes, Route, Navigate } from "react-router-dom";

import Requests from "./pages/Requests";



export default function App() {

  return (

    <Routes>

      {/* 🚀 Directly show the Requests page */}

      <Route path="/" element={<Requests />} />

      <Route path="*" element={<Navigate to="/" />} />

    </Routes>

  );

}