import React, { Component } from "react";
import "./App.css";
import Login from "./Login";
import SignUp from "./SignUp";
import { Route, BrowserRouter } from "react-router-dom";
import AuthenticatedPage from "./AuthenticatedPage";
import { createBrowserHistory } from "history";
import axios from "axios";

const history = createBrowserHistory();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      logged_in: localStorage.getItem("token") ? true : false
    };
  }

  componentDidMount() {
    if (this.state.logged_in) {
      axios
        .get("http://localhost:8000/api/authview/", {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`
          }
        })
        .then(res => {
          this.state.username = res.data["username"];
          history.push("/authenticationview");
        });
    } else {
      history.push("/");
    }
  }

  logout = () => {
    localStorage.removeItem("token");
    this.setState({ logged_in: false, username: "" });
  };

  login = (e, data) => {
    e.preventDefault();
    var payload = {
      username: data.username,
      password: data.password
    };
    console.log("ASS");
    axios.post("http://127.0.0.1:8000/api/login/", payload).then(res => {
      console.log(res.data["token"]);
      if ((res.status = 200)) {
        localStorage.setItem("token", res.data["token"]);
        this.setState({
          logged_in: true,
          username: data.username
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
            component={Login}
            logged_in={this.state.logged_in}
            username={this.state.username}
            login={this.state.login}
          />
          <Route exact path="/signup" component={SignUp} props={this.props} />
          <Route
            exact
            path="/authenticationview"
            component={AuthenticatedPage}
            logout={this.state.logout}
          />
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
