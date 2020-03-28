import React, {Component} from "react";
import {Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardHeader,
    MDBCol,
    MDBContainer,
    MDBIcon,
    MDBModalFooter,
    MDBRow,
    MDBInput
} from "mdbreact";
import '../style_css.css';

class Login extends Component {

    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            errors: {}
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.auth.isAuthenticated) {
            this.props.history.push("/Dashboard"); // push user to Dashboard when they login
        }
        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
    }

    componentDidMount() {
        // If logged in and user navigates to Login page, should redirect them to dashboard
        if (this.props.auth.isAuthenticated) {
            this.props.history.push("/Dashboard");
        }
    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };
    onSubmit = e => {
        e.preventDefault();
        const userData = {
            email: this.state.email,
            password: this.state.password
        };
        this.props.loginUser(userData); // since we handle the redirect within our component, we don't need to pass in this.props.history as a parameter
    };
    render() {
        const { errors } = this.state;

        return (
            <div className="d-flex justify-content-center loginstyle"
                 style={{
                     backgroundColor: "gray",
                     top: '0', bottom: '0', left: '0', right: '0', position: 'absolute',
                     alignItems: "center"
                 }}>
                <MDBContainer>
                    <MDBRow center={{alignItems: 'center'}}>
                        <MDBCol md="6">
                            <MDBCard>
                                <form noValidate onSubmit={this.onSubmit}>
                                <MDBCardBody>
                                    <MDBCardHeader className="form-header gradient  rounded" style={{backgroundColor:"#fb4555"}}>
                                        <h3 className="my-3">
                                            <MDBIcon icon="lock"/> Login:
                                        </h3>
                                    </MDBCardHeader>
                                    <span className="red-text">
                                        {errors.email}
                                        {errors.emailnotfound}
                                    </span>
                                    <MDBInput label="Your Email"
                                        type="email"
                                        id="email"
                                        className="form-control"
                                        onChange={this.onChange}
                                        value={this.state.email}
                                        error={errors.email}
                                    />
                                    <span className="red-text">
                                        {errors.password}
                                        {errors.passwordincorrect}
                                    </span>
                                    <MDBInput label="Your password"
                                        className="form-control"
                                        onChange={this.onChange}
                                        value={this.state.password}
                                        error={errors.password}
                                        id="password"
                                        type="password"
                                    />

                                    <div className="text-center mt-4">
                                        <MDBBtn color="danger" className="mb-3" type="submit">
                                            Login
                                        </MDBBtn>
                                    </div>
                                    <MDBModalFooter>
                                        <div className="font-weight-light">
                                            <Link to={'/'} class="text-danger"> Go back to the main page</Link>
                                        </div>
                                    </MDBModalFooter>
                                </MDBCardBody>
                                </form>
                            </MDBCard>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </div>
        );
    }
}

Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});
export default connect(
    mapStateToProps,
    { loginUser }
)(Login);