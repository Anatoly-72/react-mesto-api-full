import { useState, useEffect } from 'react';
import PopupWithForm from './PopupWithForm';

function AddPlacePopup({ isOpen, onClose, onAddPlace, isLoading }) {
  const [cardTitle, setCardTitle] = useState('');
  const [cardLink, setCardLink] = useState('');

  function handleCardTitle(evt) {
    setCardTitle(evt.target.value);
  }

  function handleCardLink(evt) {
    setCardLink(evt.target.value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();

    onAddPlace({
      name: cardTitle,
      link: cardLink,
    });
  }

  useEffect(() => {
    setCardLink('');
    setCardTitle('');
  }, [isOpen]);

  return (
    <PopupWithForm
      name="new-card"
      form="addCardForm"
      title="Новое место"
      buttonText={isLoading ? 'Сохранение...' : 'Создать'}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <input
        id="title-input"
        className="popup__form-input"
        type="text"
        name="name"
        placeholder="Название"
        required
        minLength="2"
        maxLength="30"
        onChange={handleCardTitle}
        value={cardTitle ? cardTitle : ''}
      />
      <span
        className="popup__error popup__error_place_top popup__error_visible"
        id="title-input-error"
      ></span>
      <input
        id="link-input"
        className="popup__form-input"
        type="url"
        name="link"
        placeholder="Ссылка на картинку"
        required
        onChange={handleCardLink}
        value={cardLink ? cardLink : ''}
      />
      <span
        className="popup__error popup__error_place_bottom popup__error_visible"
        id="link-input-error"
      ></span>
    </PopupWithForm>
  );
}

export default AddPlacePopup;
