import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CMSApplication from './CMS/CMSApplication';
import Home from './Home';
import NavigationMap from './Navigationmap/NavigationMap';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cms" element={<CMSApplication />} />
        <Route path="/maping" element={<NavigationMap />} />
      </Routes>
    </Router>
  );
}

export default App;
