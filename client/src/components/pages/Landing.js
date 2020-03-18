import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import Header from "../Header";

class Landing extends Component {

    render() {
        const {user} = this.props.auth;

        return (
            <div>
                <Header/>
                <h1>Student Information System</h1>
                with the help of a chatbot
            </div>
        )
    }
}

Landing.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
    auth: state.auth
});
export default connect(
    mapStateToProps,
    { logoutUser }
)(Landing);