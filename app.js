const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const errorHandler = require('./middlewares/errorHandler');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  autoIndex: true,
});
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { PORT = 3000 } = process.env;

app.use('/', require('./routes/index'));

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
