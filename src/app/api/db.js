import mysql from 'serverless-mysql';
import readCredentials from './readCredentials'

const configfromenvfile = {
  config: {
    host: process.env.host1,
    port: process.env.port1,
    database: process.env.database1,
    user: process.env.user1,
    password: process.env.password1,
  },
}
const configfromereadingFile = await readCredentials();
const db=(process.env.credentialsfromenv === '1')?mysql(configfromenvfile):mysql(configfromereadingFile.mysqlConfig);

// Attempt to connect to the database when this module is imported
(async () => {
  try {
    await db.query('SELECT 1');
    console.log('Connection to database successful!');
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
})();

const excuteQuery = async ({ query, values }) => {
  try {
    const results = await db.query(query, values);
    await db.end();
    return results;
  } catch (error) {
    return { error };
  }
};
export default excuteQuery;
