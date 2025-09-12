import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Logs from './pages/Logs';
import Activity from './pages/Activity';
import DAODash from './pages/DAODash';
import AIChat from './components/AIChat';
// import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/logs" element={<Logs />} />
      <Route path="/activity" element={<Activity />} />
      <Route path="/dao" element={<DAODash />} />
      <Route path="/ai" element={<AIChat />} />
    </Routes>
  );
}

export default App;