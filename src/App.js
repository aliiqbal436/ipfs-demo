import "./App.css";
import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
// import Files from "./components/files/files";
import FileViewer from "./FileViewer";

function App() {
  return (
    <Router>
      <Suspense fallback={<div>..</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/files" element={<Files />} /> */}
          <Route path="/file/:hash" element={<FileViewer />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
