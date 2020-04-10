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
            assignments:[]
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
            })
            .catch(() => {
                alert('Apologies, but there is a problem with the connection!');
            });
    }

    componentDidMount() {
        this.getClassesAndAssignments();
    }

    render() {
        let classes_elements=[];
        let counter=0;

        console.log(this.state.assignments);

        this.state.classes.forEach(classes => {
            let key_value=counter++;

            let upcoming_assignments=[];
            let past_assignments=[];
            const now = new Date();
            this.state.assignments.forEach(element => {

                if(element.class===classes._id){
                    let assignmentName= element.name;

                    let assignment_date= Date.parse(element.dateline);
                    assignment_date=new Date(assignment_date);

                    if (assignment_date>now) {
                        upcoming_assignments.push(
                            <li className="collection-item" key={key_value.toString()}>
                                <strong style={{color: '#039be5'}}>{assignmentName}</strong>
                                <br/><span>Dateline: {dateFormat( element.dateline, " h:MM TT, mmmm dS")}</span>
                            </li>);
                    } else{
                        past_assignments.push(<li className="collection-item" key={key_value.toString()}>
                            <strong style={{color: '#039be5'}}>{assignmentName}</strong>
                            <br/><span>Dateline: {dateFormat( element.dateline, " h:MM TT, mmmm dS")}</span>
                        </li>);
                    }
                }
            });

            const className = classes.name;
            classes_elements.push(
                <div className="col m4" key={key_value.toString()}>
                    <div className="card" style={{ alignItems: 'center', padding: 20}}>
                        <div className="titlefit">
                            <div className="textalign"><strong style={{fontSize:25}}>{className}</strong></div>
                            <div className="row">
                                <ul className="collection with-header ulwidth">
                                    <li className="collection-header textalign" style={{height:50}}><strong style={{fontSize:15}}>Past Assignments</strong></li>
                                    {past_assignments}
                                </ul>
                                <ul className="collection with-header ulwidth">
                                    <li className="collection-header textalign" style={{height:50}}><strong style={{fontSize:15}}>Upcomming Assignments</strong></li>
                                    {upcoming_assignments}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )
        });

        return (
            <div className="cardwidth" style={{display:"flex"}}>
            <div className="card col ">
                <strong style={{fontSize:40}}>Chosen classes</strong>
                <div className="card-action"/>
                <div className="col" style={{marginLeft:"inherit"}}>
                    {classes_elements}
                </div>
            </div>
            </div>
        )
    }
}

Dashboard.propTypes = {
    auth: PropTypes.object.isRequired,
};
const mapStateToProps = state => ({
    auth: state.auth,
});
export default connect(mapStateToProps)(Dashboard);