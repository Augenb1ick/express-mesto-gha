require('dotenv').config();
const jwt = require('jsonwebtoken');

const DeniedError = require('../errors/denied-err');

const { NODE_ENV, JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return
const auth = (req, res, next) => {
  const authorization = req.headers.cookie;

  if (!authorization || !authorization.startsWith('jwt')) {
    return next(new DeniedError('Необходимо авторизоваться'));
  }

  const token = authorization.replace('jwt=', '');

  let payload;
  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
  } catch (err) {
    return next(new DeniedError('Необходимо авторизоваться'));
  }

  req.user = payload;
  next();
};

module.exports = auth;
