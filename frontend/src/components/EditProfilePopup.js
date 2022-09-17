import { useState, useEffect, useContext } from 'react';
import PopupWithForm from './PopupWithForm';
import CurrentUserContext from '../contexts/CurrentUserContext';

function EditProfilePopup({ isOpen, onClose, onUpdateUser, isLoading }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const currentUser = useContext(CurrentUserContext);

  function handleNameChange(evt) {
    setName(evt.target.value);
  }

  function handleDescriptionChange(evt) {
    setDescription(evt.target.value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    onUpdateUser({
      name: name,
      about: description,
    });
  }

  useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, isOpen]);

  return (
    <PopupWithForm
      name="edit"
      form="profileEditingForm"
      title="Редактировать профиль"
      buttonText={isLoading ? 'Сохранение...' : 'Сохранить'}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <input
        id="name-input"
        className="popup__form-input"
        type="text"
        name="name"
        required
        minLength="2"
        maxLength="40"
        value={name ? name : ''}
        onChange={handleNameChange}
      />
      <span
        className="popup__error popup__error_place_top popup__error_visible"
        id="name-input-error"
      ></span>
      <input
        id="info-input"
        className="popup__form-input"
        type="text"
        name="about"
        required
        minLength="2"
        maxLength="200"
        value={description ? description : ''}
        onChange={handleDescriptionChange}
      />
      <span
        className="popup__error popup__error_place_bottom popup__error_visible"
        id="info-input-error"
      ></span>
    </PopupWithForm>
  );
}

export default EditProfilePopup;
