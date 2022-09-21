import { useContext } from 'react';
import CurrentUserContext from '../contexts/CurrentUserContext.js';

function Card({ card, onCardClick, onCardLike, onCardDelete }) {
  //Подписка на контекст CurrentUserContext
  const currentUser = useContext(CurrentUserContext);

  //Определяем, являемся ли мы владельцем карточки
  // const isOwn = card.owner._id === currentUser._id;
  const isOwn = card.owner === currentUser._id;

  //Переменная для класса кнопки удаления (если карточка наша - видим иконку удаления)
  const cardDeleteButtonClassName = `card__trash ${
    isOwn ? 'card__trash_visible' : ''
  }`;

  //Определяем, есть ли у карточки поставленный нами лайк
  const isLiked = card.likes.some(i => i === currentUser._id);

  //Переменная для класса кнопки лайка (закрашивание, если карточка лайкнута нами)
  const cardLikeButtonClassName = `card__icon ${
    isLiked ? 'card__icon_active' : ''
  }`;

  //Обработчик клика по карточке
  function handleClick() {
    onCardClick(card);
  }

  //Обработчик клика по лайку
  function handleLikeClick() {
    onCardLike(card);
  }

  //Обработчик удаления карточки
  function handleDeleteClick() {
    onCardDelete(card);
  }

  return (
    <li className="cards__item">
      <div className="card">
        <img
          className="card__img"
          src={card.link}
          alt={card.name}
          onClick={handleClick}
        />
        <button
          className={cardDeleteButtonClassName}
          type="button"
          onClick={handleDeleteClick}
        ></button>
        <div className="card__wrapper">
          <h2 className="card__title">{card.name}</h2>
          <div className="card__icon-like">
            <button
              className={cardLikeButtonClassName}
              type="button"
              onClick={handleLikeClick}
            ></button>
            <span className="card__like">{card.likes.length}</span>
          </div>
        </div>
      </div>
    </li>
  );
}

export default Card;
