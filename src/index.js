// require('dotenv').config();
// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const { sequelize } = require('./db');
// const authRoutes = require('./routes/auth');
// const groupsRoutes = require('./routes/groups');
// const adminRoutes = require('./routes/admin');
// const paymentsRoutes = require('./routes/payments');

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// app.use('/api/auth', authRoutes);
// app.use('/api/groups', groupsRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/payments', paymentsRoutes);

// const PORT = process.env.PORT || 4000;

// async function start(){
//   try {
//     await sequelize.authenticate();
//     console.log('DB connected');
//     await sequelize.sync();
//     app.listen(PORT, () => console.log(`Server running on ${PORT}`));
//   } catch (err) {
//     console.error('Failed to start', err);
//     process.exit(1);
//   }
// }
// start();
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize } = require('./db');
const authRoutes = require('./routes/auth');
const groupsRoutes = require('./routes/groups');
const adminRoutes = require('./routes/admin');
const paymentsRoutes = require('./routes/payments');
const testRoutes = require("./routes/test.routes");


const app = express();
app.use(cors());
app.use(bodyParser.json());

// =====================
// ROUTES
// =====================
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentsRoutes);
app.use("/api", testRoutes);

// =====================
// 👉 YAHI PAR ADD KARNA HAI
// =====================

// Root route
app.get('/', (req, res) => {
  res.send('Backend is running successfully 🚀');
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'backend' });
});

// =====================

const PORT = process.env.PORT || 4000;

async function start(){
  try {
    await sequelize.authenticate();
    console.log('DB connected');
    await sequelize.sync();
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  } catch (err) {
    console.error('Failed to start', err);
    process.exit(1);
  }
}

start();
