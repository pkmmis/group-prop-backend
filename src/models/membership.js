const { DataTypes } = require('sequelize');
module.exports = (sequelize) => sequelize.define('membership', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  groupId: DataTypes.UUID,
  userId: DataTypes.UUID,
  contribution_amount: { type: DataTypes.BIGINT, defaultValue: 0 },
  joined_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  active: { type: DataTypes.BOOLEAN, defaultValue: true }
},{ timestamps:true, tableName:'memberships' });
