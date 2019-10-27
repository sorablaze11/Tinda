import React, { Component } from "react";
import "./App.css";
import Login from "./Components/Login.js";
import SignUp from "./Components/SignUp.js";
import { Route, BrowserRouter } from "react-router-dom";
import AuthenticatedPage from "./Components/AuthenticatedPage.js";
import axios from "axios";
import PrivateRoute from "./PrivateRoute.js";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "sas",
      logged_in: localStorage.getItem("token") ? true : false
    };
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.signup = this.signup.bind(this);
  }

  signup = (UserName, Email, PassWord) => {
    console.log("SignUp Called");
    var payload = {
      username: UserName,
      email: Email,
      password: PassWord
    };
    axios.post("http://127.0.0.1:8000/api/register/", payload).then(res => {
      console.log(res);
      if (res.status === 201) {
        localStorage.setItem("token", res.data["token"]);
        this.setState({
          logged_in: true,
          username: UserName
        });
      } else {
        alert("Error while registering");
      }
    });
  };

  logout = () => {
    console.log("Logout Called");
    localStorage.removeItem("token");
    this.setState({ logged_in: false, username: "" });
  };

  login = (UserName, PassWord) => {
    console.log("Login Called");
    var payload = {
      username: UserName,
      password: PassWord
    };
    axios.post("http://127.0.0.1:8000/api/login/", payload).then(res => {
      if ((res.status = 200)) {
        localStorage.setItem("token", res.data["token"]);
        this.setState({
          logged_in: true,
          username: UserName
        });
      }
    });
  };

  render() {
    return (
      <div>
        <BrowserRouter>
          <Route
            exact
            path="/"
            render={props => (
              <Login
                logged_in={this.state.logged_in}
                username={this.state.username}
                login={this.login}
                {...props}
              />
            )}
          />
          <Route
            exact
            path="/login"
            render={props => (
              <Login
                logged_in={this.state.logged_in}
                username={this.state.username}
                login={this.login}
                {...props}
              />
            )}
          />
          <Route
            exact
            path="/signup"
            render={props => <SignUp signup={this.signup} {...props} />}
          />
          <PrivateRoute
            exact
            path="/authenticatedview"
            render={props => <AuthenticatedPage {...props} />}
            logged_in={this.state.logged_in}
            logout={this.logout}
          />
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
