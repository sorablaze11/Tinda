import React, { Component } from "react";
import "./App.css";
import Login from "./Login";
import SignUp from "./SignUp";
import { Route, BrowserRouter } from "react-router-dom";
import AuthenticatedPage from "./AuthenticatedPage";
import { createBrowserHistory } from "history";
import axios from "axios";
import UserDetials from "./UserDetials.js";

const history = createBrowserHistory();

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

  componentWillMount() {
    console.log("componentWillMount App");
    if (this.state.logged_in) {
      if (this.state.username) {
        history.push("/authenticatedview");
      }
      history.push("/authenticatedview");
      axios
        .get("http://localhost:8000/api/authview/", {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`
          }
        })
        .then(res => {
          this.setState({
            username: res.data["username"]
          });
        });
    } else {
      if (window.location.pathname == "/signup") history.push("/signup");
      else history.push("/");
    }
  }

  componentDidMount() {}

  signup = (UserName, Email, PassWord) => {
    console.log("SignUp Called");
    var payload = {
      username: UserName,
      email: Email,
      password: PassWord
    };
    axios.post("http://127.0.0.1:8000/api/register/", payload).then(res => {
      console.log(res);
      if (res.status == 201) {
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
        <BrowserRouter history={history}>
          <Route
            exact
            path="/"
            render={props => (
              <Login
                logged_in={this.state.logged_in}
                username={this.state.username}
                login={this.login}
              />
            )}
          />
          <Route
            exact
            path="/signup"
            render={props => <SignUp signup={this.signup} />}
          />
          <Route
            exact
            path="/authenticatedview"
            render={props => <AuthenticatedPage logout={this.logout} />}
          />
          <Route exact path="/userdetials" render={props => <UserDetials />} />
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
