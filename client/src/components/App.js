import React from 'react';
import {BrowserRouter, Route, } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "../utils/setAuthToken";
import { setCurrentUser, logoutUser } from "../actions/authActions";
import { Provider } from "react-redux";
import store from "../store";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Chatbot from "./chatbot/Chatbot";
//Do e perdoresh per gjerat private
import PrivateRoute from "../components/private-route/PrivateRoute";

// Check for token to keep user logged in
if (localStorage.jwtToken) {
    // Set auth token header auth
    const token = localStorage.jwtToken;
    setAuthToken(token);
    // Decode token and get user info and exp
    const decoded = jwt_decode(token);
    // Set user and isAuthenticated
    store.dispatch(setCurrentUser(decoded));
// Check for expired token
    const currentTime = Date.now() / 1000; // to get in milliseconds
    if (decoded.exp < currentTime) {
        // Logout user
        store.dispatch(logoutUser());

    }
}

const App = () => {
        return (
            <Provider store={store}>
                <BrowserRouter>
                    <div className="App">
                        <Chatbot/>
                        <Route exact path="/" component={Landing}/>
                        <Route exact path="/Login" component={Login}/>
                    </div>
                </BrowserRouter>
            </Provider>
        )
}

export default App;