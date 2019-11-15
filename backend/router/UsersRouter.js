const Router = require('./Router');
const Users = require('../class/Users');

const users = new Users();

class UsersRouter extends Router {
  route(router) {
    router.get('/', async (req, res) => {
      try {
        const result = await users.getList();
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
        const result = await users.create(req);
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
        const result = await users.delete(req);
        res.send(result);
      } catch (err) {
        this.sendErrorWithCode(
          res,
          500,
          err.toString(),
        );
      }
    });
    router.post('/edit', async (req, res) => {
      try {
        const result = await users.edit(req);
        res.send(result);
      } catch (err) {
        this.sendErrorWithCode(
          res,
          500,
          err.toString(),
        );
      }
    });
    router.post('/disable', async (req, res) => {
      try {
        const result = await users.changeStatus(req, 'inactive');
        res.send(result);
      } catch (err) {
        this.sendErrorWithCode(
          res,
          500,
          err.toString(),
        );
      }
    });
    router.post('/restore', async (req, res) => {
      try {
        const result = await users.changeStatus(req, 'active');
        res.send(result);
      } catch (err) {
        this.sendErrorWithCode(
          res,
          500,
          err.toString(),
        );
      }
    });
    router.post('/restore-password', async (req, res) => {
      try {
        const result = await users.sendEmail(req);
        res.send(result);
      } catch (err) {
        this.sendErrorWithCode(
          res,
          500,
          err.toString(),
        );
      }
    });
    router.get('/login', async (req, res) => {
      try {
        const result = await users.login(JSON.parse(req.query.item));
        res.send(result);
      } catch (err) {
        this.sendErrorWithCode(
          res,
          401,
          err.toString(),
        );
      }
    });
    router.post('/change-password', async (req, res) => {
      try {
        const result = await users.changePassword(req);
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

module.exports = UsersRouter;
