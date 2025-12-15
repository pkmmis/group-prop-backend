const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  const User = sequelize.define('user', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password_hash: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('user','admin','superadmin'), defaultValue: 'user' }
  }, { timestamps: true, tableName: 'users' });

  User.prototype.verifyPassword = function(password){
    return bcrypt.compare(password, this.password_hash);
  };

  return User;
};
