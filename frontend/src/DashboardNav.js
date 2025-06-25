import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import logo from './logo.png';

function DashNav(){
    const navigate = useNavigate();
    return(
    <nav className='navbar'>
         <img src={logo} alt="Logo" className="nav-logo" />
        <ul className='nav-link'>
            <li><button onClick={()=>navigate('/')} style={{ margin: '5px', padding: '10px 20px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Logout</button></li>
        </ul>
    </nav>
    );
}

export default DashNav;