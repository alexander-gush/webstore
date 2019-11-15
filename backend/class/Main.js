// eslint-disable-next-line
const bodyParser = require('body-parser');
const cors = require('cors');

require('../utils/RouterGroup.js');
const express = require('express');
const CatalogRouter = require('../router/CatalogRouter');
const UsersRouter = require('../router/UsersRouter');
const CartsRouter = require('../router/CartsRouter');
const OrdersRouter = require('../router/OrdersRouter');
const Db = require('./Db');

const catalogRouter = new CatalogRouter();
const usersRouter = new UsersRouter();
const cartsRouter = new CartsRouter();
const ordersRouter = new OrdersRouter();
const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

const db = new Db({ dbName: 'Shop' });

class Main {
  // eslint-disable-next-line
  async run() {
    db.connect().then(() => {
      app.use('/status', (req, res) => {
        res.status(200).send('OK');
      });

      app.group('/catalog', catalogRouter.getRoute());
      app.group('/users', usersRouter.getRoute());
      app.group('/carts', cartsRouter.getRoute());
      app.group('/orders', ordersRouter.getRoute());

      app.listen(port, err => {
        if (err) {
          console.log('error', err);
          return;
        }
        console.log(`Server is listening on ${port}`);
      });
    });
  }
}

module.exports = Main;
