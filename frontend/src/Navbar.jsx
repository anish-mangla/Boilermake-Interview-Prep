import { Link } from "react-router-dom";
import './Navbar.css';

const Navbar = () => {
    return (
        <div id="navbar-container">
            <div id="navbar-title">
                CS390 HW5
            </div>

            <div id="navbar-links">
                <Link to="/">Home</Link>
                <Link to="/login">Login</Link>
                <Link to="/signup">Signup</Link>
            </div>
        </div>
    )
};

export default Navbar;