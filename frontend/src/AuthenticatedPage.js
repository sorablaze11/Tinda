import React, { Component } from "react";
import PropTypes from "prop-types";

export class AuthenticatedPage extends Component {
  componentWillMount() {
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

export default AuthenticatedPage;

AuthenticatedPage.propTypes = {
  logout: PropTypes.func.isRequired
};
