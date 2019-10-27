import React, { Component } from "react";
import PropTypes from "prop-types";

class AuthenticatedPage extends Component {
  componentWillMount() {
    console.log("componentWillMount AuthenticatedApp");
    console.log(this.props);
    console.log("componentWillMount AuthenticatedApp");
  }

  render() {
    return (
      <div>
        AuthenticatedPage
        <button onClick={this.props.logout}>Signout</button>);
      </div>
    );
  }
}

AuthenticatedPage.propTypes = {
  logout: PropTypes.func.isRequired
};

export default AuthenticatedPage;
