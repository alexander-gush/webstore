// eslint-disable-next-line
const { MongoClient } = require('mongodb');
const config = require('../config/index');

let instance = null;

class Db {
  constructor({ dbName }) {
    if (!instance) {
      instance = this;
    }

    this.db = null;
    this.client = null;
    this.dbName = dbName;

    return instance;
  }

  get() {
    return this.db;
  }

  async connect() {
    try {
      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        connectTimeoutMS: 1500,
        reconnectInterval: 1500,
        reconnectTries: 1,
      };
      const url = `mongodb+srv://${config.user}:${config.pass}@shop-lddqc.mongodb.net/test?retryWrites=true&w=majority`;

      this.client = await MongoClient.connect(url, options);
      this.client.on('close', () => {
        this.db = null;
      });

      this.db = this.client.db(this.dbName);
      return true;
    } catch (err) {
      console.log(err);
    }
    return false;
  }
}

module.exports = Db;
