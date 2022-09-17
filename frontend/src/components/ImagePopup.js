function ImagePopup({card, onClose }) {
  return (
    <div
      className={`popup popup_type ${card} ${
        card && 'popup_active'
      }`}
    >
      <figure className="popup__container-image">
        <img
          className="popup__image"
          src={card?.link}
          alt={card ? card.name : ''}
        />
        <figcaption className="popup__figcaption">
          {card ? card.name : ''}
        </figcaption>
        <button
          className="popup__close"
          type="button"
          onClick={onClose}
        ></button>
      </figure>
    </div>
  );
}

export default ImagePopup;
