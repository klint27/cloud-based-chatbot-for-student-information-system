import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";

const dateFormat = require('dateformat');


class Events extends Component {

    constructor(props) {
        super(props);
        this.state = {
            posts: [],
        };
    }

    componentDidMount() {
        this.getEvents();
    }

    async getEvents() {
        axios.post('/api/events', {limit:null})
            .then((response) => {
                const data = response.data;
                this.setState({ posts: data });
            })
            .catch(() => {
                alert('Unfortunately, there is a problem with the connection!');
            });
    };

    render() {
        let elements=[];
        let counter=0;
        this.state.posts.forEach((event) =>{
            let key_value=counter++;
            elements.push(
                    <div className = "card white" key={key_value.toString()}>
                        <div className="card-image" style={{background:"black"}}>
                            <img className="imagestyle" src={event.image} alt=""/>
                        </div>
                        <div className = "card-content black-text" >
                            <span className="card-title">{event.title}</span>
                            <p>Location: {event.location}</p>
                            <p>Date: {dateFormat(event.date, "dddd, mmmm dS, yyyy, h:MM TT")}</p>
                            <br/>
                            <p>{event.description}</p>
                        </div>
                    </div>
            )}
        );

        return (
            <div className="card col cardwidth">
                {elements}
            </div>
        )
    }
}

Events.propTypes = {
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});
export default connect(mapStateToProps)(Events);