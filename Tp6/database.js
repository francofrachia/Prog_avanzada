const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('usersdb', 'postgres', 'river151204', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432,
  logging: false
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a PostgreSQL LOCAL establecida correctamente');
  } catch (error) {
    console.error('❌ Error conectando a la base de datos LOCAL:', error);
  }
};

module.exports = { sequelize, testConnection };