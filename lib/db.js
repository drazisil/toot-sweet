import { Sequelize } from 'sequelize';
import config from "./config.js"

/**
 * Connect and return the sequelize instance
 * @returns {Promise<Sequelize>}
 */
export async function connectDB() {

  const sequelize = new Sequelize({
    dialect: config["DATABASE_DIALECT"]
  })

  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  return sequelize
}
