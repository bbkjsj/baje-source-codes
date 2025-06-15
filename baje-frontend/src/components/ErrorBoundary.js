import React, { Component } from "react";
import AppButton from "./general/AppButton";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in child components and update state
    this.setState({
      hasError: true,
      error: error,
      errorInfo: errorInfo,
    });
    console.error("Boundary Error: ", error);
    console.info("Boundary Error: ", errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI when an error occurs
      return (
        <div style={{ zIndex: "9999999999999999999999999999999" }}>
          <h2>
            مشکلی پیش آمده است لطفاً مجدداً تلاش نمایید یا صفحه را رفرش نمایید
          </h2>
          <AppButton
            onClick={() => {
              window.location.pathname = "/";
              window.location.reload();
            }}
          >
            تلاش مجدد
          </AppButton>
          <details style={{ whiteSpace: "pre-wrap" }}>
            <summary>جزئیات</summary>
            <pre>{this.state.error && this.state.error.toString()}</pre>
            <br />
            <pre>
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </details>
        </div>
      );
    }

    // Render the child components as usual if no errors
    return this.props.children;
  }
}

export default ErrorBoundary;
