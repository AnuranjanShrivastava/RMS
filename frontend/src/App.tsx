import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Employee from './components/Employee';
import Admin from './components/Admin';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/employee" element={<Employee />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default App;
