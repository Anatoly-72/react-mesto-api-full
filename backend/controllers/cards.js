const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const DelCardError = require('../errors/del-card-err');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

// Создаем карточку по id
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Ошибка валидации данных'));
      } else {
        next(err);
      }
    });
};

// Удаляем карточку
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(
      () => new NotFoundError('Пользователь с указанным id не существует'),
    )
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        Card.findByIdAndRemove({
          _id: req.params.cardId,
        })
          .then((delCard) => res.send({ data: delCard }))
          .catch(next);
      } else {
        throw new DelCardError('Нельзя удалить чужую карточку');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Ошибка валидации данных'));
      } else {
        next(err);
      }
    });
};

// Ставим лайк карточке
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточки с таким id не найдено'));
      }
      return res.send(card);
    })
    .catch(next);
};

// Убираем лайк у карточки
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточки с таким id не найдено'));
      }
      return res.send(card);
    })
    .catch(next);
};
