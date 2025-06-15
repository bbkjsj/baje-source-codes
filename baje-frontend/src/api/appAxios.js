import axios from "axios";
import { store } from "store";
import { showMessage } from "utils/message";
import { config, pageNames } from "../constant";
import { getLink, normalizeArabic } from "../_helpers";
import { setToken } from "../store/action/token";

const instance = axios.create({
  baseURL: config.url.API_URL,
});

instance.interceptors.request.use((req) => {
  // console.log(req, "axios-req");
  const header = req.headers || {};
  header.Authorization =
    store.getState().token || store.getState().suggestToken;

  return normalizeArabicRequest(req);
});

instance.interceptors.response.use(null, (error) => {
  const { config, response, request } = error;

  if (response?.status >= 500)
    showMessage("خطای 500 از سرور دریافت شد.", "error");

  if (response?.status === 401) {
    store.dispatch(setToken(""));

    if (
      !window.location.href.includes(pageNames.suggest.auth.intro) &&
      !window.location.href.includes(getLink(pageNames.suggest.auth.signUp)) &&
      !window.location.href.includes(getLink(pageNames.auth.login))
    )
      window.location.href = pageNames.auth.login;
  }
  if (response?.status < 500 && response && response.data) {
    if (typeof response.data === "string" && response.status !== 303) {
      showMessage(response.data, "error");
    }
    if (
      typeof response.data === "object" &&
      response.data.message &&
      Array.isArray(response.data.message)
    )
      response.data.message.forEach((item) => {
        showMessage(item, "error");
      });
    if (
      typeof response.data === "object" &&
      response.data.message &&
      typeof response.data.message === "string"
    )
      showMessage(response.data.message, "error");
  }
  if (!response)
    showMessage(
      `ارور هنگام دریافت ==> ${config.url} - ${request.status}-`,
      "error"
    );

  console.log(
    `api=${config.method.toLocaleUpperCase()} ${config.url} \nbaseURL=${
      config.baseURL
    }\nerror=${error.message}\nToken=${config.headers.Authorization}\n${
      config.method === "Post" || config.method === "post"
        ? `body=${config.body}`
        : ""
    }`
  );
  return Promise.reject(error);
});

const normalizeArabicRequest = (req) => {
  let { data, url, method } = { ...req };
  req.url = normalizeArabic(url);
  //Normalize request data
  if (data instanceof FormData) {
    const newData = new FormData();

    for (const [key, value] of data.entries()) {
      newData.set(
        key,
        typeof value === "string" ? normalizeArabic(value) : value
      );
    }

    req.data = newData;
  } else if (data) {
    data = typeof data !== "object" ? JSON.parse(data) : data;
    data = Object.entries(data).map(([key, value]) => [
      key,
      normalizeArabic(value),
    ]);
    data = Object.fromEntries(data);

    req.data = data;
  }

  //Normalize request url (params)
  if (url.indexOf("?") > -1) req.url = normalizeArabic(url);

  return req;
};

export default instance;
