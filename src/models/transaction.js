const { DataTypes } = require('sequelize');
module.exports = (sequelize) => sequelize.define('transaction', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  groupId: DataTypes.UUID,
  userId: DataTypes.UUID,
  type: DataTypes.STRING,
  amount: { type: DataTypes.BIGINT },
  reference: DataTypes.STRING
},{ timestamps:true, tableName:'transactions' });
