import { useState, useEffect } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.js';
import * as auth from '../utils/auth.js';
import Header from './Header.js';
import Main from './Main.js';
import Footer from './Footer.js';
import EditProfilePopup from './EditProfilePopup.js';
import EditAvatarPopup from './EditAvatarPopup.js';
import AddPlacePopup from './AddPlacePopup.js';
import ImagePopup from './ImagePopup.js';
import Login from './Login.js';
import Register from './Register.js';
import api from '../utils/api.js';
import CurrentUserContext from '../contexts/CurrentUserContext.js';
import InfoTooltip from './InfoTooltip.js';

function App() {
  // Стейты для отображения поп-апов (состояние - открыт / не открыт)
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);

  // Стейт для выбранной карточки. Используется в поп-апе картинки в полном размере.
  // Чтобы показать картинку нужной карточки при клике на фото
  const [selectedCard, setSelectedCard] = useState(null);

  // Стейт для данных пользователя (имя, о себе, автарка, id)
  const [currentUser, setCurrentUser] = useState({});

  // Стейт для карточек. Для отрисовки и работы с карточками, полученными с сервера
  const [cards, setСards] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  // Стейт для авторизации. Показывает, залогинен пользователь или нет. Для показа только нужного контента
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Стейт для данных залогиненного пользователя. Содержит _id и email для отображения в приложении
  const [registrationStatus, setRegistrationStatus] = useState(false);

  // Стейт для отображения InfoTooltip. Модалка при успешной/ неудачной регистрации или авторизации
  const [InfoTooltipPopupOpen, setInfoTooltipPopupOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const history = useHistory();

  const isOpen =
    isEditAvatarPopupOpen ||
    isEditProfilePopupOpen ||
    isAddPlacePopupOpen ||
    selectedCard;

  useEffect(() => {
    function closeByEscape(evt) {
      if (evt.key === 'Escape') {
        closeAllPopups();
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', closeByEscape);
      return () => {
        document.removeEventListener('keydown', closeByEscape);
      };
    }
  }, [isOpen]);

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleInfoTooltipPopupOpen() {
    setInfoTooltipPopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setInfoTooltipPopupOpen(false);
    setSelectedCard(null);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i === currentUser._id);
    const jwt = localStorage.getItem('jwt');
    api
      .changeLikeCardStatus(card._id, !isLiked, jwt)
      .then((newCard) => {
        setСards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      });
  };

  function handleCardDelete(card) {
    const jwt = localStorage.getItem('jwt');
    api
      .deleteCard(card._id, jwt)
      .then(() => {
        setСards((cards) => cards.filter((c) => c._id !== card._id));
      })
      .catch((err) => {
        console.error(`Ошибка: ${err}`);
      });
  }

  function handleUpdateUser(data) {
    const jwt = localStorage.getItem('jwt');
    setIsLoading(true);
    api
      .setUserInfo(data, jwt)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => console.log(`Ошибка: ${err}`))
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleUpdateAvatar(data) {
    const jwt = localStorage.getItem('jwt');
    setIsLoading(true);
    api
      .setAvatar(data, jwt)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => console.log(`Ошибка: ${err}`))
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleAddPlaceSubmit(data) {
    const jwt = localStorage.getItem('jwt');
    setIsLoading(true);
    api
      .createCard(data, jwt)
      .then((newCard) => {
        setСards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(`Ошибка: ${err}`))
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleRegistration(data) {
    return auth
      .register(data)
      .then((data) => {
        setRegistrationStatus(true);
        handleInfoTooltipPopupOpen();
        history.push('/sign-in');
      })
      .catch((err) => {
        console.log(err);
        setRegistrationStatus(false);
        handleInfoTooltipPopupOpen();
      });
  }

  function handleAuthorization(data) {
    return auth
      .authorize(data)
      .then((data) => {
        setIsLoggedIn(true);
        localStorage.setItem('jwt', data.token);
        handleTokenCheck();
        history.push('/');
      })
      .catch((err) => {
        console.log(err);
        handleInfoTooltipPopupOpen();
      });
  }

  function handleTokenCheck() {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      return;
    }
    auth
      .getContent(jwt)
      .then((data) => {
        setUserEmail(data.data.email);
        setIsLoggedIn(true);
        history.push('/');
      })
      .catch((err) => console.log(err));
      api
      .getInitialCards(jwt)
      .then((res) => {
        setСards(res.data)
      })
      api
      .getUserInfo(jwt)
      .then((res) => {
        setCurrentUser(res.data)
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    handleTokenCheck();
    // eslint-disable-next-line
  }, [history]);

  useEffect(() => {
    if (isLoggedIn) {
      history.push('/');
    }
  }, [isLoggedIn, history]);

  const handleSignOut = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('jwt');
    history.push('/sign-in');
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <div className="page__container">
          <Header
            loggedIn={isLoggedIn}
            userEmail={userEmail}
            onSignOut={handleSignOut}
          />
          <Switch>
            <Route path="/sign-in">
              <Login onLogin={handleAuthorization} />
            </Route>
            <Route path="/sign-up">
              <Register onRegister={handleRegistration} />
            </Route>
            <ProtectedRoute
              path="/"
              component={Main}
              loggedIn={isLoggedIn}
              onEditProfile={handleEditProfileClick}
              onEditAvatar={handleEditAvatarClick}
              onAddPlace={handleAddPlaceClick}
              cards={cards}
              onCardClick={handleCardClick}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
            />
          </Switch>
          <Footer />

          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
            isLoading={isLoading}
          />

          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
            isLoading={isLoading}
          />

          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlace={handleAddPlaceSubmit}
            isLoading={isLoading}
          />

          <InfoTooltip
            onClose={closeAllPopups}
            isOpen={InfoTooltipPopupOpen}
            isConfirmed={registrationStatus}
          />

          <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
