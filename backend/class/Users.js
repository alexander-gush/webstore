const { ObjectID } = require('mongodb');
const nodemailer = require('nodemailer');
const Db = require('./Db');
const Carts = require('../class/Carts');

const carts = new Carts();
const db = new Db({ dbName: 'Shop' });
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'testonlinestore2019@gmail.com',
    pass: 'Aa12345123',
  },
});


class Users {
  constructor() {
    this.collectionName = 'Users';
  }

  async getList() {
    try {
      return await db.db.collection(this.collectionName).find().toArray();
    } catch (error) {
      throw Error(error.message);
    }
  }

  async create(req) {
    const { user } = req.body;
    const { registration } = req.body;
    try {
      if (registration) {
        return await db.db.collection(this.collectionName).insertOne(user);
      }
      await db.db.collection(this.collectionName).insertOne(user);
      return await this.getList();
    } catch (error) {
      throw Error(error.message);
    }
  }

  async delete(req) {
    const user = { _id: new ObjectID(req.body.id) };
    try {
      await db.db.collection(this.collectionName)
        .remove(user);
      return await this.getList();
    } catch (error) {
      throw Error(error.message);
    }
  }

  async edit(req) {
    // eslint-disable-next-line
    const id = { _id: new ObjectID(req.body._id) };
    const user = {
      role: req.body.role,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };
    try {
      await db.db.collection(this.collectionName).update(id, user);
      return await this.getList();
    } catch (error) {
      throw Error(error.message);
    }
  }

  async changeStatus(req, status) {
    const id = { _id: new ObjectID(req.body.id) };
    const details = {
      status,
    };
    try {
      await db.db.collection(this.collectionName).update(id, { $set: details });
      return await this.getList();
    } catch (error) {
      throw Error(error.message);
    }
  }

  async sendEmail(req) {
    const details = { email: req.body.email };
    try {
      const result = await db.db.collection(this.collectionName).findOne(details);
      if (!result) {
        throw Error('User with with email not found');
      }
      return await transporter.sendMail({
        from: 'testonlinestore2019@gmail.com',
        to: result.email,
        subject: 'Restore password',
        text: `Your password is: ${result.password}.`,
        html: `<b>Your password is: ${result.password}.</b>`,
      });
    } catch (error) {
      throw Error(error.message);
    }
  }

  async login(user) {
    try {
      const result = await db.db.collection(this.collectionName).findOne(user);
      if (!result) {
        throw Error('User not found');
      }
      if (result.status === 'inactive') {
        throw Error('User inactive');
      }
      if (result.role !== 'user') {
        return { user: result };
      }
      // eslint-disable-next-line
      const cart = await carts.getItem(result._id.toString());
      return { user: result, cart };
    } catch (error) {
      throw Error(error.message);
    }
  }

  async changePassword(req) {
    const id = { _id: new ObjectID(req.body.id) };
    const details = {
      password: req.body.password,
    };
    try {
      await db.db.collection(this.collectionName).update(id, { $set: details });
      return await db.db.collection(this.collectionName).findOne(id);
    } catch (error) {
      throw Error(error.message);
    }
  }
}

module.exports = Users;
