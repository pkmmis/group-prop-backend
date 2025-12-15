const { DataTypes } = require('sequelize');
module.exports = (sequelize) => sequelize.define('expense', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  groupId: DataTypes.UUID,
  amount: { type: DataTypes.BIGINT, allowNull: false },
  type: { type: DataTypes.STRING, defaultValue: 'other' },
  description: DataTypes.TEXT,
  date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
},{ timestamps:true, tableName:'expenses' });
