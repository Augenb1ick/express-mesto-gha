require('dotenv').config();
const jwt = require('jsonwebtoken');

const DeniedError = require('../errors/denied-err');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new DeniedError('Необходимо авторизоваться');
  }

  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
  } catch (err) {
    throw new DeniedError('Необходимо авторизоваться');
  }

  req.user = payload;
  next();
};

module.exports = auth;
