const Db = require('./Db');

const db = new Db({ dbName: 'Shop' });

class Carts {
  constructor() {
    this.collectionName = 'Carts';
  }

  async getItem(id) {
    const user = { userId: id };
    try {
      return await db.db.collection(this.collectionName).findOne(user);
    } catch (error) {
      throw Error(error.message);
    }
  }

  async change(req) {
    const user = { userId: req.body.id };
    const item = { userId: req.body.id, items: req.body.items };
    try {
      await db.db.collection(this.collectionName).update(user, item, { upsert: true });
      return await this.getItem(req.body.id);
    } catch (error) {
      throw Error(error.message);
    }
  }

  async delete(req) {
    const user = { userId: req.body.id };
    try {
      return await db.db.collection(this.collectionName).remove(user);
    } catch (error) {
      throw Error(error.message);
    }
  }
}

module.exports = Carts;
