class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
  }

  //получаем информацию о пользователе
  getUserInfo(jwt) {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: {
        'authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      },
    }).then(this._getResponseData);
  }

  //обновляем информацию о пользователе
  setUserInfo(data, jwt) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'PATCH',
      headers: {
        'authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: data.name,
        about: data.about,
      }),
    }).then(this._getResponseData);
  }

  //обновляем аватар пользователя
  setAvatar(avatar, jwt) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: {
        'authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(avatar),
    }).then(this._getResponseData);
  }

  //получаем карточки
  getInitialCards(jwt) {
    return fetch(`${this._baseUrl}/cards`, {
      headers: {
        'authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      },
    }).then(this._getResponseData);
  }

  //добавляем новую карточку
  createCard(data, jwt) {
    return fetch(`${this._baseUrl}/cards`, {
      method: 'POST',
      headers: {
        'authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: data.name,
        link: data.link,
      }),
    }).then(this._getResponseData);
  }

  //удаляем карточку
  deleteCard(cardId, jwt) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: 'DELETE',
      headers: {
        'authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      },
    }).then(this._getResponseData);
  }

  //статус лайка/дизлайка карточки
  changeLikeCardStatus(cardId, isLiked, jwt) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
       method: `${!isLiked ? 'DELETE' : 'PUT'}`,
       headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`,
       },
    }).then(this._getResponseData);
 }

  _getResponseData(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }
}

// const api = new Api({
//   baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-43',
//   headers: {
//     authorization: 'a6f0e7d8-069f-4cc1-84f0-7d4967254933',
//     'Content-Type': 'application/json',
//   },
// });

const BASE_URL = 'http://api.domainname.anatoly.nomorepartiesxyz.ru';

const api = new Api({
  baseUrl: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // 'authorization': `Bearer ${localStorage.getItem('jwt')}`
  }
});

export default api;
