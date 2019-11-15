const Router = require('./Router');
const Orders = require('../class/Orders');

const orders = new Orders();

class OrdersRouter extends Router {
  route(router) {
    router.get('/', async (req, res) => {
      try {
        const result = await orders.getList(req.query.id, req.query.role);
        res.send(result);
      } catch (err) {
        this.sendErrorWithCode(
          res,
          500,
          err.toString(),
        );
      }
    });
    router.post('/create', async (req, res) => {
      try {
        const result = await orders.create(req);
        res.send(result);
      } catch (err) {
        this.sendErrorWithCode(
          res,
          500,
          err.toString(),
        );
      }
    });
    router.post('/change-status', async (req, res) => {
      try {
        const result = await orders.changeStatus(req);
        res.send(result);
      } catch (err) {
        this.sendErrorWithCode(
          res,
          500,
          err.toString(),
        );
      }
    });
  }
}

module.exports = OrdersRouter;
