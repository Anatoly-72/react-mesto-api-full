import { useState } from 'react';

function Login({ onLogin }) {
  const [loginUser, setLoginUser] = useState({
    email: '',
    password: '',
  });

  function handleChange(evt) {
    const { name, value } = evt.target;
    setLoginUser((prevState) => ({ ...prevState, [name]: value }));
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    onLogin({
      email: loginUser.email,
      password: loginUser.password,
    });
  }

  return (
    <div className="login">
      <h3 className="login__title">Вход</h3>
      <form className="login__form" onSubmit={handleSubmit}>
        <div>
          <input
            id="email"
            type="email"
            name="email"
            required
            className="login__input"
            placeholder="Email"
            autoComplete="on"
            value={loginUser.email || ''}
            onChange={handleChange}
          />
          <input
            id="password"
            type="password"
            name="password"
            required
            className="login__input"
            placeholder="Пароль"
            autoComplete="password"
            minLength="5"
            maxLength="50"
            value={loginUser.password || ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <button type="submit" className="login__save">
            Войти
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
