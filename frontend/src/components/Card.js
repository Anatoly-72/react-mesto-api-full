import { useContext } from 'react';
import CurrentUserContext from '../contexts/CurrentUserContext.js';

function Card({ card, onCardClick, onCardLike, onCardDelete }) {
  const currentUser = useContext(CurrentUserContext);

  const isOwn = card.owner._id === currentUser._id;

  const cardDeleteButtonClassName = `card__trash ${
    isOwn ? 'card__trash_visible' : ''
  }`;

  const isLiked = card.likes.some((i) => i._id === currentUser._id);

  const cardLikeButtonClassName = `card__icon ${
    isLiked ? 'card__icon_active' : ''
  }`;

  function handleClick() {
    onCardClick(card);
  }

  function handleLikeClick() {
    onCardLike(card);
  }

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
