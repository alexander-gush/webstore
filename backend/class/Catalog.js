// eslint-disable-next-line
const path = require('path');
// eslint-disable-next-line
const { ObjectID } = require('mongodb');
// eslint-disable-next-line
const Db = require('./Db');

const db = new Db({ dbName: 'Shop' });

class Catalog {
  constructor() {
    this.collectionName = 'Catalog';
  }

  async getList(sort = null) {
    try {
      const result = await db.db.collection(this.collectionName)
        .find().sort(sort).collation({ locale: 'en_US', numericOrdering: true })
        .toArray();
      if (process.env.NODE_ENV.trim() === 'production') {
        const rootPath = path.join(__dirname, '../upload');
        for (let i = 0; i < result.length; i += 1) {
          result[i].img = path.join(rootPath, result[i].img);
        }
      }
      return result;
    } catch (error) {
      throw Error(error.message);
    }
  }

  async create(req) {
    const item = req.body;
    // item.price = parseInt(req.body.price, 10);
    item.img = req.file.filename;
    try {
      await db.db.collection(this.collectionName).insertOne(item);
      return this.getList();
    } catch (error) {
      throw Error(error.message);
    }
  }

  async delete(req) {
    const id = { _id: new ObjectID(req.body.id) };
    try {
      await db.db.collection(this.collectionName).remove(id);
      return this.getList();
    } catch (error) {
      throw Error(error.message);
    }
  }

  async edit(req) {
    const id = { _id: new ObjectID(req.body.id) };
    const details = { title: req.body.title, desc: req.body.desc };
    try {
      await db.db.collection(this.collectionName).update(id, { $set: details });
      return this.getList();
    } catch (error) {
      throw Error(error.message);
    }
  }
}

module.exports = Catalog;
