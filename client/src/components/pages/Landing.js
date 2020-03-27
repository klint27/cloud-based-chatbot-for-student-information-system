import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import M from "materialize-css";
import axios from "axios";
import {Link} from "react-router-dom";
import Header from "../Header";

class Landing extends Component {

    constructor() {
        super();
        this.state = {
            majors: [],
            events:[]
        };
    }

    componentDidMount() {
        this.getFront();

    }

    getFront() {
        axios.post('/api/majors', {select:('name -_id')})
            .then((response) => {
                const data = response.data;
                this.setState({ majors: data });
            })
            .catch(() => {
                alert('Error retrieving data!!!');
            });

        axios.post('/api/Events', {limit: 4,select:('title -_id')})
            .then((response) => {
                const data = response.data;
                this.setState({ events: data });
            })
            .catch(() => {
                alert('Error retrieving data!!!');
            });
    };

    render() {

        let event_elements=[];
        this.state.events.forEach(event =>
            event_elements.push(
                <div className="col m4">
                <div className = "card white" style={{height:300}}>
                    <div className = "card-content black-text" style={{height:250}}>
                        <span className="card-title">{event.title}</span>
                    </div>
                    <div className="card-action">
                        <Link to="/Majors">Check All Details</Link>
                    </div>
                </div>
                </div>
            )
        );

        let major_elements=[];
        this.state.majors.forEach(major =>
            major_elements.push(
                <div className="col m4">
                    <div className = "card white" style={{height:160}}>
                        <div className = "card-content black-text" style={{height:100}}>
                            <span className="card-title">{major.name}</span>
                        </div>
                        <div className="card-action">
                            <Link to="/Events">See Major Description</Link>
                        </div>
                    </div>
                </div>
            )
        );

        return (
            <div>
                <strong style={{fontSize:40}}>Future Events</strong>
                <div className="row cardwidth" style={{marginLeft:"inherit"}}>
                    {event_elements}
                </div>
                <strong style={{fontSize:40}}>Offered Majors</strong>
                <div className="row cardwidth" style={{marginLeft:"inherit"}}>
                    {major_elements}
                </div>
            </div>
        )
    }
}

Landing.propTypes = {
    auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
    auth: state.auth
});
export default connect(mapStateToProps)(Landing);