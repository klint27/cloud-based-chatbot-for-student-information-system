import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";
import {Link} from "react-router-dom";
const dateFormat = require('dateformat');


class Class extends Component {

    constructor() {
        super();
        this.state = {
            description:[],
            assignments:[]
        };
    }

    async getClassInfo(){
        await axios.post('/api/class', {className: this.props.location.pathname.substring(7)})
            .then((response) => {
                const description = response.data.courseDescription[0].description;
                this.setState({ description: description });
                const data_assignments = response.data.assignments[0];
                this.setState({ assignments: data_assignments });

            })
            .catch(() => {
                alert('Error retrieving data!!!');
            });
    }

    componentDidMount() {
        this.getClassInfo();
    }

    render() {

        console.log(this.state);

        return (
            <div className="cardwidth" style={{display:"flex"}}>
                <div className="card col ">
                    <strong style={{fontSize:40}}>{this.props.location.pathname.substring(7)}</strong>
                    <div className="card-action"/>
                    <div>
                        <h4>{this.state.description}</h4>
                    </div>
                </div>
                <div style={{width:20}}/>
            </div>
        )
    }
}

Class.propTypes = {
    auth: PropTypes.object.isRequired,
};
const mapStateToProps = state => ({
    auth: state.auth,
});
export default connect(mapStateToProps)(Class);