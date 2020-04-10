import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";
import {Link} from "react-router-dom";
import '../style_css.css';

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
        axios.post('/api/majors', {select:('name -_id dateline')})
            .then((response) => {
                const data = response.data;
                this.setState({ majors: data });
            })
            .catch(() => {
                alert('Apologies, but there is a problem with the connection!');
            });

        axios.post('/api/Events', {limit: 4,select:('title image -_id')})
            .then((response) => {
                const data = response.data;
                this.setState({ events: data });
            })
            .catch(() => {
                alert('Apologies, but there is a problem with the connection!');
            });
    };

    render() {
        let event_elements=[];
        let counter=0;
        this.state.events.forEach(event =>{
            let key_value=counter++;
        event_elements.push(
                <div className="col m4" key={key_value.toString()}>
                <div className = "card" style={{height:300}}>
                    <div className="card-image" style={{background:"black", height:100}}>
                        <img className="imagestyle" src={event.image} alt=""/>
                    </div>
                    <div className="card-content">
                        <span className="card-title grey-text text-darken-4">{event.title}</span>
                    </div>
                </div>
                </div>
        )}
        );

        let major_elements=[];
        this.state.majors.forEach(major =>{
            let key_value=counter++;
            major_elements.push(
                <div className="col m4" key={key_value.toString()}>
                    <div className = "card" style={{height:160, maxWidth:300}}>
                        <div className = "card-content" style={{height:100}}>
                            <span className="card-title">{major.name}</span>
                        </div>
                    </div>
                </div>
        )}
        );

        return (
            <div className="card col cardwidth">
                <strong style={{fontSize:40}}>Future Events</strong>
                <div className="row" style={{marginLeft:"inherit"}}>
                    {event_elements}
                </div>
                <div className="card-action">
                    <Link to="/Events">Check All Events</Link>
                </div>
                <div className="card-action"/>
                <strong style={{fontSize:40}}>Offered Majors</strong>
                <div className="row cardwidth" style={{marginLeft:"inherit"}}>
                    {major_elements}
                </div>
                <div className="card-action">
                    <Link to="/Majors">Explore Majors</Link>
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