const Router = require('./Router');
const Carts = require('../class/Carts');

const carts = new Carts();

class CartsRouter extends Router {
  route(router) {
    router.get('/', async (req, res) => {
      try {
        const result = await carts.getItem(req.query.id);
        res.send(result);
      } catch (err) {
        this.sendErrorWithCode(
          res,
          500,
          err.toString(),
        );
      }
    });
    router.post('/change', async (req, res) => {
      try {
        const result = await carts.change(req);
        res.send(result);
      } catch (err) {
        this.sendErrorWithCode(
          res,
          500,
          err.toString(),
        );
      }
    });
    router.post('/delete', async (req, res) => {
      try {
        const result = await carts.delete(req);
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

module.exports = CartsRouter;
