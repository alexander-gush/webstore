const { ObjectID } = require('mongodb');
const Db = require('./Db');

const db = new Db({ dbName: 'Shop' });

class Orders {
  constructor() {
    this.collectionName = 'Orders';
  }

  async getList(id, role) {
    let user = null;
    if (role !== 'salesperson') {
      user = { userId: id };
    }
    try {
      return await db.db.collection(this.collectionName).find(user).toArray();
    } catch (error) {
      throw Error(error.message);
    }
  }

  async create(req) {
    const order = req.body;
    try {
      return await db.db.collection(this.collectionName).insertOne(order);
    } catch (error) {
      throw Error(error.message);
    }
  }

  async changeStatus(req) {
    const id = { _id: new ObjectID(req.body.id) };
    const order = {
      status: req.body.status,
    };
    try {
      await db.db.collection(this.collectionName).update(id, { $set: order });
      let details = null;
      if (req.body.role !== 'salesperson') {
        details = { userId: req.body.userId };
      }
      return await db.db.collection(this.collectionName).find(details).toArray();
    } catch (error) {
      throw Error(error.message);
    }
  }
}

module.exports = Orders;
