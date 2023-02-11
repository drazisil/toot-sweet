import { Sequelize } from 'sequelize';

// Option 1: Passing a connection URI


/**
 * Connect and return the sequelize instance
 * @returns {Promise<Sequelize>}
 */
export async function connectDB() {
  const sequelize = new Sequelize('sqlite::memory:') // Example for sqlite

  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  return sequelize
}
