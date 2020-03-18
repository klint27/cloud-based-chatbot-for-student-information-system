import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {logoutUser} from "../actions/authActions";


class Header extends Component {

    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
        window.location.href = "./";
    };

    render() {
        if(!this.props.auth.isAuthenticated) {
            return (
                <nav>
                    <ul>
                        <li style={{float: "right"}}><Link to={'/Login'}>Login </Link></li>
                    </ul>
                </nav>
            )
        } else{
            return (
                <nav>
                    <ul>
                        <li style={{float: "right"}}>
                        <a href="/" onClick={this.onLogoutClick}>Logout</a>
                        </li>
                    </ul>
                </nav>
            )
        }

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