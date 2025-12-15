const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false
});

const User = require('./models/user')(sequelize);
const Group = require('./models/group')(sequelize);
const Membership = require('./models/membership')(sequelize);
const Property = require('./models/property')(sequelize);
const Expense = require('./models/expense')(sequelize);
const Contribution = require('./models/contribution')(sequelize);
const SellRequest = require('./models/sellRequest')(sequelize);
const Transaction = require('./models/transaction')(sequelize);

// Associations
Group.hasMany(Membership, { foreignKey: 'groupId' });
Membership.belongsTo(Group, { foreignKey: 'groupId' });

User.hasMany(Membership, { foreignKey: 'userId' });
Membership.belongsTo(User, { foreignKey: 'userId' });

Group.hasMany(Property, { foreignKey: 'groupId' });
Property.belongsTo(Group, { foreignKey: 'groupId' });

Group.hasMany(Expense, { foreignKey: 'groupId' });
Expense.belongsTo(Group, { foreignKey: 'groupId' });

Group.hasMany(Transaction, { foreignKey: 'groupId' });
Transaction.belongsTo(Group, { foreignKey: 'groupId' });

User.hasMany(Transaction, { foreignKey: 'userId' });
Transaction.belongsTo(User, { foreignKey: 'userId' });

module.exports = { sequelize, User, Group, Membership, Property, Expense, Contribution, SellRequest, Transaction };
