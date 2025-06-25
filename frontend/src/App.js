import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LoginForm from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import DefaultPage from './DefaultPage';
import Nav from './NavBar';
import DashNav from './DashboardNav';
import RealTimeDisplay from './TimeHandler';
function LayoutWithNav() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <div className='layout'>
      {isDashboard ? <DashNav /> : <Nav />}

      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/:id" element={<Dashboard />} />
        <Route path="*" element={<DefaultPage />} />
      </Routes>

      <footer>
        <RealTimeDisplay />
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <LayoutWithNav />
    </Router>
  );
}




export default App;