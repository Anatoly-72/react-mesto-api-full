import PopupWithForm from './PopupWithForm';

function PopupWithConfirmation({ isOpen, onClose, card, onSubmit, isLoading }) {

   function handleConfirmiation(evt) {
      evt.preventDefault();
      onSubmit(card);
   };

   return (
      <PopupWithForm
         name="prevent"
         form="formPrevent"
         title="Вы уверены?"
         onClose={onClose}
         buttonText={isLoading ? 'Удаляем...' : 'Да'}
         isOpen={isOpen}
         onSubmit={handleConfirmiation}
      >
      </PopupWithForm>
   )
}

export default PopupWithConfirmation;