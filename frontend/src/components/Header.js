import React from 'react';
import { Route, Link } from 'react-router-dom';
import logo from '../images/logo.png';

function Header({ loggedIn, userEmail, onSignOut }) {
  return (
    <header className="header header_margin">
      <img className="logo" src={logo} alt="Логотип" />

      <Route path="/sign-in">
        <Link to="/sign-up" className="header__link">
          Регистрация
        </Link>
      </Route>

      <Route path="/sign-up">
        <Link to="/sign-in" className="header__link">
          Войти
        </Link>
      </Route>

      {loggedIn && (
        <nav className="header__nav">
          <span className="header__user-email">{userEmail}</span>
          <span className="header__link-exit" onClick={() => onSignOut()}>
            Выйти
          </span>
        </nav>
      )}
    </header>
  );
}

export default Header;
