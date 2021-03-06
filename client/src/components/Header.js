import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {logoutUser} from "../actions/authActions";
import '../components/style_css.css'


class Header extends Component {

    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
        window.location.href = "./";
    };

    render() {
        return(
            <div className="navbar-fixed">
            <nav className="nav-extended" style={{backgroundColor: '#ff3547'}}>
                <div className="nav-wrapper">
                    <ul id="nav-mobile" className="left">
                        <li>{(this.props.auth.isAuthenticated) && <Link to="Dashboard">Dashboard</Link>}</li>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/Majors">Majors</Link></li>
                        <li><Link to="/CourseCatalog">Course Catalog</Link></li>
                        <li><Link to="/Events">Events</Link></li>
                    </ul>
                    <ul id="nav-mobile" className="right">
                        {(!this.props.auth.isAuthenticated) && <li><Link to="/Login">Log In</Link></li>}
                        {(this.props.auth.isAuthenticated) && <li><Link to="#" onClick={this.onLogoutClick}>Log Out</Link></li>}
                    </ul>
                </div>
            </nav>
            </div>
        );
    }
}

Header.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
    auth: state.auth
});
export default connect(
    mapStateToProps,
    { logoutUser }
)(Header);