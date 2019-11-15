const multer = require('multer');
const Router = require('./Router');
const Catalog = require('../class/Catalog');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './upload');
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}.${file.mimetype.split('/')[1]}`);
  },
});
const upload = multer({
  storage,
});
const catalog = new Catalog();

class CatalogRouter extends Router {
  route(router) {
    router.get('/', async (req, res) => {
      try {
        const sort = (req.query.sort) ? JSON.parse(req.query.sort) : null;
        const result = await catalog.getList(sort);
        res.send(result);
      } catch (err) {
        this.sendErrorWithCode(
          res,
          500,
          err.toString(),
        );
      }
    });

    router.post('/create', upload.single('img'), async (req, res) => {
      try {
        if (process.env.NODE_ENV.trim() === 'production') {
          const result = await catalog.create(req);
          res.send(result);
        } else {
          const result = catalog.create(req);
          res.send(result);
        }
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
        const result = await catalog.delete(req);
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
        const result = await catalog.edit(req);
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

module.exports = CatalogRouter;
