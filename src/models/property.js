const { DataTypes } = require('sequelize');
module.exports = (sequelize) => sequelize.define('property', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  groupId: DataTypes.UUID,
  address: DataTypes.TEXT,
  purchase_price: DataTypes.BIGINT,
  purchase_date: DataTypes.DATE,
  sale_price: DataTypes.BIGINT,
  sale_date: DataTypes.DATE,
  status: { type: DataTypes.ENUM('owned','listed','sold'), defaultValue: 'owned' }
},{ timestamps:true, tableName:'properties' });
