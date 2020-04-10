import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";
import M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";

class CourseCatalog extends Component {

    constructor() {
        super();
        this.state = {
            posts: [],
        };
    }

    componentDidMount() {
        M.Tabs.init(this.Tabs);
        this.getCourses();

    }

    getCourses() {
        axios.post('/api/courses', {})
            .then((response) => {
                const data = response.data;
                this.setState({ posts: data });
            })
            .catch(() => {
                alert('Apologies, but there is a problem with the connection!');
            });
    };

    render() {
        let COS=[];
        let MAT=[];
        let ECO=[];
        let BUS=[];

        let counter=0;

        this.state.posts.forEach((course) => {
            let key_value=counter++;
            function cardCreation(array) {
                array.push(
                    <div className = "card white" key={key_value.toString()}>
                        <div className = "card-content black-text" >
                            <span className="card-title">{course.title}</span>
                            <p>{course.description}</p>
                        </div>
                    </div>
                )
            }

            if (course.major === "5e77d7b193d22031a4e589f6") {
                cardCreation(COS);
            }
            else if (course.major === "5e77d7f793d22031a4e589f7") {
                cardCreation(ECO);
            }
            else if (course.major === "5e77d81193d22031a4e589f8") {
                cardCreation(MAT);
            }
            else if (course.major === "5e77d82993d22031a4e589f9") {
                cardCreation(BUS);
            }
        });

        return (
            <div className="card cardwidth">
                <div className="card-tabs">
                <ul
                        ref={Tabs => {
                            this.Tabs = Tabs;
                        }}
                        id="tabs-swipe-demo"
                        className="tabs tabs-fixed-width"
                    >
                        <li className="tab"><a className="active" href="#COS">Computer Science</a></li>
                        <li className="tab"><a href="#MAT">Mathematics</a></li>
                        <li className="tab"><a href="#ECO">Economics</a></li>
                        <li className="tab"><a href="#BUS">Business Administration</a></li>
                </ul>
                </div>
                <div className="card-content white lighten-4">
                    <div id="COS">{COS}</div>
                    <div id="MAT">{MAT}</div>
                    <div id="ECO">{ECO}</div>
                    <div id="BUS">{BUS}</div>
                </div>
            </div>
        )
    }
}

CourseCatalog.propTypes = {
    auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
    auth: state.auth
});
export default connect(mapStateToProps)(CourseCatalog);