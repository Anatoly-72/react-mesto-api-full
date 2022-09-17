function PopupWithForm({
  name,
  title,
  form,
  children,
  buttonText,
  isOpen,
  onClose,
  onSubmit,
}) {
  return (
    <div className={`popup popup_type ${name} ${isOpen && 'popup_active'}`}>
      <div className="popup__container">
        <h3 className="popup__title">{title}</h3>
        <form
          className="popup__form"
          name={`${form}`}
          onSubmit={onSubmit}
        >
          {children}
          <button className="popup__form-btn" type="submit">
            {buttonText}
          </button>
        </form>
        <button
          className="popup__close"
          type="button"
          onClick={onClose}
        ></button>
      </div>
    </div>
  );
}

export default PopupWithForm;
