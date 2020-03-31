import React, {Component} from 'react';
import { MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem} from 'mdbreact';
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

                    <nav>
                        <MDBNavbar style={{backgroundColor: '#ff3547 '}} dark expand={"md"} scrolling fixed="top">
                            <MDBNavbarBrand href="#">
                                <i className="fas fa-robot"/>
                            </MDBNavbarBrand>
                                <MDBNavbarNav left >
                                    <MDBNavItem>
                                        {(this.props.auth.isAuthenticated) && <Link to="Dashboard">Dashboard</Link>}
                                    </MDBNavItem>
                                    <MDBNavItem>
                                        <Link to="/">Home</Link>
                                    </MDBNavItem>
                                    <MDBNavItem>
                                        <Link to="/Majors">Majors</Link>
                                    </MDBNavItem>
                                    <MDBNavItem>
                                        <Link to="/CourseCatalog">Course Catalog</Link>
                                    </MDBNavItem>
                                    <MDBNavItem>
                                        <Link to="/Events">Events</Link>
                                    </MDBNavItem>
                                </MDBNavbarNav>
                                <MDBNavbarNav right>
                                    <MDBNavItem>
                                        {(!this.props.auth.isAuthenticated) && <Link to="/Login">Log In</Link>}
                                    </MDBNavItem>
                                    <MDBNavItem>
                                        {(this.props.auth.isAuthenticated) && <Link to="#" onClick={this.onLogoutClick}>Log Out</Link>}
                                    </MDBNavItem>
                                </MDBNavbarNav>
                        </MDBNavbar>
                    </nav>

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