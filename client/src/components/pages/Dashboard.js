import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";
import {Link} from "react-router-dom";


class Dashboard extends Component {

    constructor() {
        super();
        this.state = {

        };
    }

    componentDidMount() {
        this.getFront();

    }

    getFront() {
    }

    render() {
        return (
            <div>Dashboard</div>
        )
    }
}

Dashboard.propTypes = {
    auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
    auth: state.auth
});
export default connect(mapStateToProps)(Dashboard);