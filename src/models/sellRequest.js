const { DataTypes } = require('sequelize');
module.exports = (sequelize) => sequelize.define('sell_request', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  groupId: DataTypes.UUID,
  sellerId: DataTypes.UUID,
  amount: DataTypes.BIGINT,
  asking_price: DataTypes.BIGINT,
  status: { type: DataTypes.ENUM('open','accepted','rejected','cancelled'), defaultValue: 'open' },
  buyerId: DataTypes.UUID
},{ timestamps:true, tableName:'sell_requests' });
