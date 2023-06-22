const router = require('express').Router();
const auth = require('../middlewares/auth');
const { celebrate, Joi, Segments } = require('celebrate');

const {
  getCards, deleteCard, createCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.use(auth);

router.get('/', getCards);

router.post(
  '/',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      link: Joi.string().required().pattern(/^https?:\/\/(www.)?[a-zA-Z0-9-.]+\.[a-zA-Z]{2,}([a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+)*#*$/),
    }),
  }),
  createCard,
);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
