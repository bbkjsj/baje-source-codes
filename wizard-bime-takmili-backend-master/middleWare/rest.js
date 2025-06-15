/**
 * Created by Saman Khademi on 12/28/16.
 */
const fetch = require('node-fetch');

module.exports.FetchData = async (Authorization, url, res = false, json = true) => {
  const defaults = { method: 'GET', headers: { Authorization } };
  const resp = await fetch(url, defaults);
  const data = (json && resp.headers.get("content-type").match('json')) ? await resp.json() : resp.text();
  if ((resp.status === 401 || resp.status === 403)) {
    throw { message: "Invalid Login, please try again!", status: resp.status };
  } else if (resp.status !== 200) {
    throw { message: data.message, status: resp.status };
  }
  return data;
};

module.exports.DeleteData = async (token, url, res = false, json = true) => {
  const defaults = { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } };
  const resp = await fetch(url, defaults);
  const data = json ? await resp.json() : {};
  if ((resp.status === 401 || resp.status === 403)) {
    throw { message: "Invalid Login, please try again!", status: resp.status };
  } else if (resp.status !== 200) {
    throw { message: data.message, status: resp.status };
  }
  return data;
};

module.exports.PostData = async (token = false, url, body, res = false, json = true) => {
  body = JSON.stringify(body);

  const defaults = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=utf-8',
    },
    body,
  };
  if (token) defaults.headers.Authorization = `Bearer ${token}`;
  const resp = await fetch(url, defaults);
  const data = json ? await resp.json() : {};
  if ((resp.status === 401 || resp.status === 403)) {
    throw { message: "Invalid Login, please try again!", status: resp.status };
  } else if (resp.status !== 200) {
    throw { message: data, status: resp.status };
  }
  return data;
};

module.exports.PutData = async (token, url, body, res = false, json = true) => {
  body = JSON.stringify(body);
  const defaults = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=utf-8',
      Authorization: `Bearer ${token}`,
    },
    body,
  };

  const resp = await fetch(url, defaults);
  const data = json ? await resp.json() : {};
  if ((resp.status === 401 || resp.status === 403)) {
    throw { message: "Invalid Login, please try again!", status: resp.status };
  } else if (resp.status !== 200) {
    throw { message: data, status: resp.status };
  }
  return data;
};

module.exports.DownloadData = async (token, url, body, res = false) => {
  body = JSON.stringify(body);
  const defaults = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: `Bearer ${token}`,
    },
    body,
  };


  const resp = await fetch(url, defaults);
  const data = resp.blob();
  return data;
};

module.exports.DownloadDataGet = async (token, url, res = false) => {
  const defaults = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: `Bearer ${token}`,
    },
  };


  const resp = await fetch(url, defaults);
  const data = resp.blob();
  return data;
};
