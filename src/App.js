import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import WaterCycleSimulation from './screens/WaterCycleSimulation';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/simulation" element={<WaterCycleSimulation />} />
      </Routes>
    </Router>
  );
}

export default App;