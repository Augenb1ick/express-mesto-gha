const httpConstants = require('http2').constants;
const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(httpConstants.HTTP_STATUS_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }));
};

const createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.status(httpConstants.HTTP_STATUS_CREATED).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки.' });
      }
      return res.status(httpConstants.HTTP_STATUS_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        return res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена.' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Передан некорректный _id для удаления карточки.' });
      }
      return res.status(httpConstants.HTTP_STATUS_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((cards) => {
      if (!cards) {
        return res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки.' });
      }
      return res.send(cards);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      }
      return res.status(httpConstants.HTTP_STATUS_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((cards) => {
      if (!cards) {
        return res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки.' });
      }
      return res.send(cards);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные для снятия лайка.' });
      }
      return res.status(httpConstants.HTTP_STATUS_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports = {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
};
