import Sequelize from 'sequelize';
import mongoose from 'mongoose';

import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';
import CargoPacking from '../app/models/CargoPacking';
import Customer from '../app/models/Customer';

import databaseConfig from '../config/database';

/**
 * Array including all models
 */
const models = [User, File, Appointment, CargoPacking, Customer];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }

  mongo() {
    this.mongoConnection = mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true, // investigate later
    });
    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  }
}

export default new Database();
