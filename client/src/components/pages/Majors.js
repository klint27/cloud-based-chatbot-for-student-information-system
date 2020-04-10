import React, { Component} from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios/index";
import "../style_css.css";

class Majors extends Component {

    constructor() {
        super();
        this.state = {
            posts: [],
        };
    }

    componentDidMount() {
        this.getMajors();

    }

    async getMajors() {
        axios.post('/api/majors', {})
            .then((response) => {
                const data = response.data;
                this.setState({ posts: data });
            })
            .catch(() => {
                alert('Apologies, but there is a problem with the connection!');
            });
    };

    render() {
        let elements=[];
        let counter=0;
        this.state.posts.forEach(major =>{
            let key_value=counter++;
        elements.push(
                        <div className = "card white" key={key_value.toString()}>
                            <div className = "card-content black-text" >
                                <span className="card-title">{major.name}</span>
                                <p>{major.description}</p>
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

Majors.propTypes = {
    auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
    auth: state.auth
});
export default connect(mapStateToProps)(Majors);