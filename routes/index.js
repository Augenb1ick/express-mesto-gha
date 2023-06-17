const router = require('express').Router();
const httpConstants = require('http2').constants;

router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

router.use((req, res) => {
  res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({ message: 'Такой страницы не существует' });
});

module.exports = router;
