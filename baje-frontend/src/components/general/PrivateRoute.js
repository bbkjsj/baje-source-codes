import React from "react";
import { Route, Redirect } from "react-router-dom";
import { pageNames } from "constant";
import { useSelector } from "react-redux";

/**
 * PrivateRoute : a customized Route for displaying the pages that user has permission to see
 * @param {object} props all props
 * @param props.component this is the component that should be displayed in this path
 * @param  props.roles is the user's permisson recived from server
 * @returns
 */

const PrivateRoute = ({ component: Component, roles, permission, ...rest }) => {
  const token = useSelector((state) => state.token);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!token) {
          // not logged in so redirect to login page with the return url
          return <Redirect to={{ pathname: pageNames.auth.login }} />;
        }

        const userRoles = roles;
        // check if route is restricted by role
        if (permission && userRoles.indexOf(permission) === -1) {
          // role not authorized so redirect to home page
          return <Redirect to={{ pathname: pageNames.error }} />;
        }

        return <Component {...props} />;
      }}
    />
  );
};

export default PrivateRoute;
