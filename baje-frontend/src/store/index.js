import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import thunk from "redux-thunk";

const persistedReducer = persistReducer(
  {
    key: "root",
    storage,
    whitelist: [
      "user",
      "token",
      "suggestToken",
      "officeLogo",
      "currentOffice",
      "currentContract",
      "lastSuggestFilter",
      "currentEnvironment",
      "environmentList",
      "notifications",
    ],
  },
  combineReducers(require("./reducers"))
);

const composeEnhancer =
  process.env.NODE_ENV === "development"
    ? compose(
        applyMiddleware(thunk),
        window.__REDUX_DEVTOOLS_EXTENSION__
          ? window.__REDUX_DEVTOOLS_EXTENSION__()
          : (f) => f
      )
    : compose(applyMiddleware(thunk));

export const store = createStore(persistedReducer, composeEnhancer);
export const persistor = persistStore(store);
