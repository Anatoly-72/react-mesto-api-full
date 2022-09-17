import { useRef, useEffect } from 'react';
import PopupWithForm from './PopupWithForm';

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar, isLoading }) {
  const avatarRef = useRef('');

  useEffect(() => {
    avatarRef.current.value = '';
  }, [isOpen]);

  function handleSubmit(evt) {
    evt.preventDefault();

    onUpdateAvatar({
      avatar: avatarRef.current.value,
    });
  }

  return (
    <PopupWithForm
      name="avatar"
      form="formAvatar"
      title="Обновить аватар"
      buttonText={isLoading ? 'Сохранение...' : 'Сохранить'}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <input
        id="avatar-input"
        className="popup__form-input"
        type="url"
        name="avatar"
        placeholder="Ссылка на картинку"
        required
        ref={avatarRef}
      />
      <span
        className="popup__error popup__error_place_top popup__error_visible"
        id="avatar-input-error"
      ></span>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;
