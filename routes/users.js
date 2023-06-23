const { celebrate, Joi, Segments } = require('celebrate');
const router = require('express').Router();

const auth = require('../middlewares/auth');

const {
  getUsers, getUserById, updateUser, updateAvatar, getCurrentUser,
} = require('../controllers/users');

router.use(auth);

router.get('/', getUsers);

router.get('/me', getCurrentUser);

router.get(
  '/:userId',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      userId: Joi.string().hex().length(24).required(),
    }),
  }),
  getUserById,
);

router.patch(
  '/me',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(/^https?:\/\/(www.)?[a-zA-Z0-9-.]+\.[a-zA-Z]{2,}([a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+)*#*$/),
      email: Joi.string().email(),
      password: Joi.string().min(6),
    }),
  }),
  updateUser,
);

router.patch(
  '/me/avatar',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      avatar: Joi.string().pattern(/^https?:\/\/(www.)?[a-zA-Z0-9-.]+\.[a-zA-Z]{2,}([a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+)*#*$/),
    }),
  }),
  updateAvatar,
);

module.exports = router;
