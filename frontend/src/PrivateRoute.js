import React from "react";
// import AuthService from "./Services/AuthService";
import { Redirect, Route } from "react-router-dom";
import AuthenticatedPage from "./Components/AuthenticatedPage";

const PrivateRoute = ({ component: Component, ...rest }) => {
  // Add your own authentication on the below line.
  const isLoggedIn = rest.logged_in;
  console.log(rest);

  return (
    <Route
      {...rest}
      render={props =>
        isLoggedIn ? (
          <AuthenticatedPage logout={rest.logout} {...props} />
        ) : (
          <Redirect to={{ pathname: "/", state: { from: props.location } }} />
        )
      }
    />
  );
};

export default PrivateRoute;
