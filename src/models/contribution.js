const { DataTypes } = require('sequelize');
module.exports = (sequelize) => sequelize.define('contribution', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  membershipId: DataTypes.UUID,
  amount: { type: DataTypes.BIGINT },
  provider: DataTypes.STRING,
  providerPaymentId: DataTypes.STRING,
  status: { type: DataTypes.ENUM('pending','completed','failed'), defaultValue: 'pending' }
},{ timestamps:true, tableName:'contributions' });
