import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";
const dateFormat = require('dateformat');

class Dashboard extends Component {

    constructor() {
        super();
        this.state = {
            classes:[],
            assignments:[],
            user:{},
            majors:[],
            render:false
        };
    }

     async getClassesAndAssignments() {
        const {user} = this.props.auth;
        await axios.post('/api/classes&assignments', {user_id: user.id})
            .then((response) => {
                const data_classes = response.data.classes;
                this.setState({ classes: data_classes });
                const data_assignments = response.data.assignments;
                this.setState({ assignments: data_assignments });
                const data_user = response.data.user;
                this.setState({ user: data_user });
                const data_majors = response.data.majors;
                this.setState({ majors: data_majors });
                this.setState({ render: true });
            })
            .catch(() => {
                alert('Unfortunately, there is a problem with the connection!');
            });
    }

    componentDidMount() {
        this.getClassesAndAssignments();
    }

    render() {

        let classes_elements = [];
        let counter = 0;

        let name = (<div className="col" style={{marginLeft: "inherit"}}>
            <div><p style={{fontSize: 25}}>Name: {this.state.user.first_name + ' ' + this.state.user.last_name}</p>
            </div>
        </div>);

        let majors = '';

        if (this.state.majors.length === 0) {
            majors = '';
        } else if (this.state.majors.length === 1) {
            majors = (<div className="col" style={{marginLeft: "inherit"}}>
                <div><p style={{fontSize: 25}}>Major: {this.state.majors[0].name}</p></div>
            </div>);
        } else if (this.state.majors.length === 2) {
            majors = (<div className="col" style={{marginLeft: "inherit"}}>
                <div><p style={{fontSize: 25}}>Majors: {this.state.majors[0].name + ', ' + this.state.majors[1].name}</p>
                </div>
            </div>);
        }

        this.state.classes.forEach(classes => {
            let key_value = counter++;

            let upcoming_assignments = [];
            let past_assignments = [];
            const now = new Date();

            this.state.assignments.forEach(element => {
                let assignments_key_value = counter++;

                if (element.class === classes._id) {
                    let assignmentName = element.name;

                    let assignment_date = Date.parse(element.dateline);
                    assignment_date = new Date(assignment_date);

                    let marked_grade = 'Not graded';

                    if (element.grades !== undefined && element.grades.length !== 0) {
                        element.grades.forEach(grade => {
                            if (grade.student === this.props.auth.user.id) {
                                marked_grade = grade.value;
                            }
                        })
                    }

                    if (assignment_date > now) {
                        upcoming_assignments.push(
                            <li className="collection-item" key={assignments_key_value.toString()}>
                                <strong style={{color: '#039be5'}}>{assignmentName}</strong>
                                <br/><span>Dateline: {dateFormat(element.dateline, " h:MM TT, mmmm dS")}</span>
                                <br/><span>Grade: {marked_grade}</span>
                            </li>);
                    } else {
                        past_assignments.push(<li className="collection-item" key={assignments_key_value.toString()}>
                            <strong style={{color: '#039be5'}}>{assignmentName}</strong>
                            <br/><span>Dateline: {dateFormat(element.dateline, " h:MM TT, mmmm dS")}</span>
                            <br/><span>Grade: {marked_grade}</span>
                        </li>);
                    }
                }
            });

            const className = classes.name;
            classes_elements.push(
                <div className="col m4" key={key_value.toString()}>
                    <div className="card" style={{alignItems: 'center', padding: 20}}>
                        <div className="titlefit">
                            <div className="textalign"><strong style={{fontSize: 25}}>{className}</strong></div>
                            <div className="row">
                                <ul className="collection with-header ulwidth">
                                    <li className="collection-header textalign" style={{height: 50}}><strong
                                        style={{fontSize: 15}}>Past Assignments</strong></li>
                                    {past_assignments}
                                </ul>
                                <ul className="collection with-header ulwidth">
                                    <li className="collection-header textalign" style={{height: 50}}><strong
                                        style={{fontSize: 15}}>Upcomming Assignments</strong></li>
                                    {upcoming_assignments}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )
        });

        return (
            <div className="cardwidth" style={{display: "flex"}}>
                <div className="card col ">
                    <strong style={{fontSize: 40}}>Student Information</strong>
                    <div className="card-action"/>
                    {this.state.render===true && <div className="card" style={{padding: 20}}>
                        {name}
                        {majors}
                    </div>}
                    <br/>
                    <strong style={{fontSize: 40}}>Enrolled classes</strong>
                    <div className="card-action"/>
                    <div className="col" style={{marginLeft: "inherit"}}>
                        {classes_elements}
                    </div>
                </div>
            </div>
    )
    }

}

Dashboard.propTypes = {
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});
export default connect(mapStateToProps)(Dashboard);