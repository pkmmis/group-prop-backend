const { DataTypes } = require('sequelize');
module.exports = (sequelize) => sequelize.define('group', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: DataTypes.STRING,
  description: DataTypes.TEXT,
  total_target_amount: { type: DataTypes.BIGINT, defaultValue: 0 },
  createdBy: DataTypes.UUID,
  status: { type: DataTypes.ENUM('open','closed','property_acquired','sold'), defaultValue: 'open' }
},{ timestamps:true, tableName:'groups' });
