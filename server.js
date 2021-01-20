const mongoose = require('mongoose')
const dotenv = require('dotenv');
const app = require('./app')

dotenv.config({ path: './config.env' })

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true
}).then(
  console.log('connection successful')
)

const port = 3000;

app.listen(port, () => {
  console.log('Listening at 3000');
});
