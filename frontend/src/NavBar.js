import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import { useNavigate } from 'react-router-dom';
import logo from './logo.png';

function Nav(){
    const navigate = useNavigate();
    return(
    <nav className='navbar'>
        <img src={logo} alt="Logo" className="nav-logo" />
        <ul className='nav-link'>
            <li><button onClick={()=>navigate('/login')} className='nav-link'>Login</button></li>
            <li><button onClick={()=>navigate('/register')} className='nav-link'>Register</button></li>
        </ul>
    </nav>
    );
}

export default Nav;