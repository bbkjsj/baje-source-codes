import "./assets/style/App.less";

import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
} from "react-router-dom";
import { noneLayoutPages, pageNames } from "./constant";
import { useDispatch, useSelector } from "react-redux";

import Baje from "./Baje";
import CacheBuster from "CacheBuster";
import InsuranceWizardContext from "modules/personnel/insurance/mobileInsuranceContracts/contexts/InsuranceWizardContext";
import LogoLoading from "./components/general/LoadingLogo";
import MainLayout from "components/layouts/main/MainLayout";
import MobileInsuranceLayout from "components/layouts/mobileInsurance/MobileInsuranceLayout";
import { NewContext } from "./contex/New-Context";
import NotFound from "modules/NotFound";
import PrivateRoute from "./components/general/PrivateRoute";
import ScrollToTop from "./components/ScrollToTop";
import { ThemeProvider } from "styled-components";
import colors from "./utils/colors";
import { getLink, isInStandaloneMode } from "_helpers";
import moduleRoutes from "./router";
import { register } from "./serviceWorker";
import { setCurrentContract } from "./store/action/currentContract";
import { setCurrentOffice } from "./store/action/currentOffice";
import { toast } from "react-toastify";
// import useMobileDetect from "use-mobile-detect-hook";
import WelcomeSplash from "components/WelcomeSplash";
import ErrorBoundary from "components/ErrorBoundary";

// import "./App.less";

import withClearCache from "./ClearCache";

const ClearCacheComponent = withClearCache(MainApp);

function App() {
  return <ClearCacheComponent />;
}

function MainApp() {
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const newContext = useContext(NewContext);
  // const { isMobile } = useMobileDetect();
  const isMobile = () => false; // TODO: Replace with react-device-detect logic
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const suggestToken = useSelector((state) => state.suggestToken);
  const currentOffice = useSelector((state) => state.currentOffice);
  const currentContract = useSelector((state) => state.currentContract);

  useEffect(() => {
    if (
      !location.pathname.includes("login") &&
      !location.pathname.includes("signup")
    ) {
      if (token) {
        let currOffice = currentOffice || "-1";
        let currContract = currentContract || "-1";
        dispatch(setCurrentOffice(currOffice));
        dispatch(setCurrentContract(currContract));
        (async () => {
          setLoading(true);
          await newContext.getInfo();
          // await newContext.getContractList(currOffice);
          setLoading(false);
        })();
      } else if (suggestToken) {
        setLoading(false);
        history.push(pageNames.suggest.suggestion.list);
      } else {
        // if (
        //   !location.pathname.includes(pageNames.suggest.auth.intro) &&
        //   !location.pathname.includes(getLink(pageNames.suggest.auth.signUp)) &&
        //   !location.pathname.includes(getLink(pageNames.auth.login))
        // ) {
        //   history.push(pageNames.auth.login);
        // }
        setLoading(false);
      }
    }
    setLoading(false);
  }, [token, suggestToken]);

  useEffect(() => {
    (async () => {
      window.Baje = Baje;
    })();
  }, []);

  // effect for handling the splash screen
  useEffect(() => {
    setTimeout(() => {
      setShowSplash("unmounting");
    }, 5500);
    setTimeout(() => {
      setShowSplash(false);
    }, 6000);
  }, []);

  useEffect(() => {
    register({
      onSuccess(registration) {
        console.debug("serviceWorkerRegistration success");
      },
      onUpdate(registration) {
        console.debug("serviceWorkerRegistration updated", Date.now());
        const refresh = async () => {
          await registration?.waiting.postMessage({ type: "SKIP_WAITING" }); //send message to update the code (stop waiting)
          if ("caches" in window) {
            //delete cache, i think is no necessary but you lose nothing
            const names = await caches.keys();
            for (const name of names) {
              await caches.delete(name);
            }
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }
        };
        // if (Date.now() - time.current <= 2000) {
        return refresh();
        // }
        // logicToShowPopup({
        //   onClick: refresh,
        // });
      },
    });
    register();
  }, []);

  if (loading) return <LogoLoading />;

  // const roles = userContext.userData ? userContext.userData?.access : null;
  return (
    <React.Fragment>
      <ThemeProvider theme={colors}>
        <ScrollToTop />
        <Switch>
          {moduleRoutes
            .filter(
              (el) => noneLayoutPages.findIndex((x) => x === el.path) !== -1
            )
            .map((item, index) => (
              <Route
                key={index}
                path={item.path}
                component={item.component}
                exact
              />
            ))}
          {!token &&
          !suggestToken &&
          ![
            pageNames.suggest.auth.intro,
            pageNames.suggest.auth.signUp,
            pageNames.auth.login,
          ].includes(location.pathname) ? (
            <ErrorBoundary>
              <Route>
                <Redirect to={pageNames.auth.login} />
              </Route>
            </ErrorBoundary>
          ) : (
            <>
              {location.pathname.includes(
                "management/person/insurance/contracts"
              ) ? (
                <MobileInsuranceLayout>
                  <InsuranceWizardContext>
                    {moduleRoutes
                      .filter((el) =>
                        el.path.includes(
                          "management/person/insurance/contracts"
                        )
                      )
                      .map((item, index) => (
                        <Route
                          key={index}
                          path={item.path}
                          component={item.component}
                          exact
                        />
                      ))}
                  </InsuranceWizardContext>
                </MobileInsuranceLayout>
              ) : (
                <>
                  {
                    // moduleRoutes
                    //   .map((elem) => elem.path)
                    //   .includes(location.pathname) ? (
                    <MainLayout>
                      <ErrorBoundary>
                        {moduleRoutes
                          .filter(
                            (el) =>
                              noneLayoutPages.findIndex(
                                (x) => x === el.path
                              ) === -1
                          )
                          .map((item, index) => (
                            <Route
                              key={index}
                              path={item.path}
                              component={item.component}
                              exact
                            />
                          ))}
                      </ErrorBoundary>
                    </MainLayout>
                    // ) : (
                    //   <Route component={NotFound} />
                    // )
                  }
                </>
              )}
            </>
          )}
        </Switch>
      </ThemeProvider>

      {showSplash && isMobile() && isInStandaloneMode() && (
        <WelcomeSplash show={showSplash} />
      )}
    </React.Fragment>
  );
  return (
    <React.Fragment>
      <ThemeProvider theme={colors}>
        <ScrollToTop />
        <Switch>
          {moduleRoutes
            .filter(
              (el) => noneLayoutPages.findIndex((x) => x === el.path) !== -1
            )
            .map((item, index) => (
              <Route
                key={index}
                path={item.path}
                component={item.component}
                exact
              />
            ))}
          {!token &&
          !suggestToken &&
          ![
            pageNames.suggest.auth.intro,
            pageNames.suggest.auth.signUp,
            pageNames.auth.login,
          ].includes(location.pathname) ? (
            <Route>
              <Redirect to={pageNames.auth.login} />
            </Route>
          ) : (
            <>
              {location.pathname.includes(
                "management/person/insurance/contracts"
              ) ? (
                <MobileInsuranceLayout>
                  <InsuranceWizardContext>
                    {moduleRoutes
                      .filter((el) =>
                        el.path.includes(
                          "management/person/insurance/contracts"
                        )
                      )
                      .map((item, index) => (
                        <Route
                          key={index}
                          path={item.path}
                          component={item.component}
                          exact
                        />
                      ))}
                  </InsuranceWizardContext>
                </MobileInsuranceLayout>
              ) : (
                <>
                  {
                    // moduleRoutes
                    //   .map((elem) => elem.path)
                    //   .includes(location.pathname) ? (
                    <MainLayout>
                      {moduleRoutes
                        .filter(
                          (el) =>
                            noneLayoutPages.findIndex((x) => x === el.path) ===
                            -1
                        )
                        .map((item, index) => (
                          <Route
                            key={index}
                            path={item.path}
                            component={item.component}
                            exact
                          />
                        ))}
                    </MainLayout>
                    // ) : (
                    //   <Route component={NotFound} />
                    // )
                  }
                </>
              )}
            </>
          )}
        </Switch>
      </ThemeProvider>
    </React.Fragment>
  );
}

export default App;
