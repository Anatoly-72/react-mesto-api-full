import { useState, useEffect } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.js";
import * as auth from "../utils/auth.js";
import Header from "./Header.js";
import Main from "./Main.js";
import Footer from "./Footer.js";
import EditProfilePopup from "./EditProfilePopup.js";
import EditAvatarPopup from "./EditAvatarPopup.js";
import AddPlacePopup from "./AddPlacePopup.js";
import ImagePopup from "./ImagePopup.js";
import Login from "./Login.js";
import Register from "./Register.js";
import api from "../utils/api.js";
import CurrentUserContext from "../contexts/CurrentUserContext.js";
import InfoTooltip from "./InfoTooltip.js";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setСards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState(false);
  const [InfoTooltipPopupOpen, setInfoTooltipPopupOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const history = useHistory();

  const isOpen =
    isEditAvatarPopupOpen ||
    isEditProfilePopupOpen ||
    isAddPlacePopupOpen ||
    selectedCard;

  useEffect(() => {
    function closeByEscape(evt) {
      if (evt.key === "Escape") {
        closeAllPopups();
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", closeByEscape);
      return () => {
        document.removeEventListener("keydown", closeByEscape);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    Promise.all([api.getUserInfo(), api.getInitialCards()])
      .then(([userData, cards]) => {
        setCurrentUser(userData);
        setСards(cards);
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      });
  }, []);

//   useEffect(() => {
//     if (isLoggedIn) {
//        Promise.all([api.getUserInfo(), api.getInitialCards()])
//           .then(([userData, cards]) => {
//              setCurrentUser(userData);
//              setCards(cards)
//           })
//           .catch((err) => {
//              console.log(`Ошибка: ${err}`);
//           });
//     }
//  }, [isLoggedIn]);

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
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    if (!isLiked) {
      api
        .setLike(card._id)
        .then((newCard) => {
          setСards((state) =>
            state.map((c) => (c._id === card._id ? newCard : c))
          );
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      api
        .deleteLike(card._id)
        .then((newCard) => {
          setСards((state) =>
            state.map((c) => (c._id === card._id ? newCard : c))
          );
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setСards((cards) => cards.filter((c) => c._id !== card._id && c));
      })
      .catch((err) => {
        console.error(`Ошибка: ${err}`);
      });
  }

  function handleUpdateUser(data) {
    setIsLoading(true);
    api
      .setUserInfo(data)
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
    setIsLoading(true);
    api
      .setAvatar(data)
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
    setIsLoading(true);
    api
      .createCard(data)
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
        history.push("/sign-in");
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
        localStorage.setItem("jwt", data.token);
        history.push("/");
      })
      .catch((err) => console.log(err));
  }

  function handleTokenCheck() {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      return;
    }
    auth
      .getContent(jwt)
      .then((data) => {
        setUserEmail(data.email);
        setIsLoggedIn(true);
        history.push("/");
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    handleTokenCheck();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      history.push("/");
    }
  }, [isLoggedIn]);

  const handleSignOut = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("jwt");
    history.push("/sign-in");
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
              onCardDeleteClick={handleCardDelete}
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
