// export const BASE_URL = 'https://auth.nomoreparties.co';
export const BASE_URL = 'http://localhost:3001';

const checkResponse = (res) => {
  return res.ok
    ? res.json()
    : Promise.reject(new Error(`Ошибка ${res.status}: ${res.statusText}`));
};

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};

export const authorize = ({ email, password }) => {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email, password }),
  }).then((res) => checkResponse(res));
};

export const register = ({ email, password }) => {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email, password }),
  }).then((res) => checkResponse(res));
};

export const getContent = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => checkResponse(res));
};
