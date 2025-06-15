import React from "react";
import { render } from "react-dom";
import { ConfigProvider } from "antd";
import { BrowserRouter as Router } from "react-router-dom";
import LayoutContextProvider from "contex/Layout-context";

import "./assets/style/App.css";
import "./assets/css/main.min.css";
import "./assets/css/ReactToastify.css";
import NewContextProvider from "contex/New-Context";
import "./assets/fonts/Peyda/css/Peyda-font.css";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
// import "react-responsive-tabs/styles.css";
import App from "./App";
import faIR from "antd/es/locale/fa_IR";
import { register } from "./serviceWorker";
import ReduxProvider from "provider/redux";
import { ToastContainer } from "react-toastify";

render(
  <ReduxProvider>
    <ConfigProvider direction="rtl" locale={faIR}>
      <Router>
        <NewContextProvider>
          <LayoutContextProvider>
            <App />
            <ToastContainer newestOnTop position="bottom-right" />
          </LayoutContextProvider>
        </NewContextProvider>
      </Router>
    </ConfigProvider>
  </ReduxProvider>,
  // <AuditPDFRetport />
  document.getElementById("root")
);

register();
// unregister();
