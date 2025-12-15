const express = require('express');
const { sequelize, Group, Property, Membership, Expense, Transaction } = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

function requireAdmin(req, res, next){
  if (req.user.role === 'superadmin' || req.user.role === 'admin') return next();
  return res.status(403).json({ error: 'Admin access required' });
}

router.post('/groups/:id/property/:pid/sell', auth, requireAdmin, async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const groupId = req.params.id;
    const pid = req.params.pid;
    const { sale_price, sale_date, deductions } = req.body;
    if (!sale_price) throw new Error('sale_price required');

    const property = await Property.findOne({ where: { id: pid, groupId }, transaction: t });
    if (!property) throw new Error('Property not found');

    property.sale_price = sale_price;
    property.sale_date = sale_date || new Date();
    property.status = 'sold';
    await property.save({ transaction: t });

    let totalDeductions = 0;
    if (Array.isArray(deductions)) {
      for (const d of deductions) {
        const amount = Number(d.amount) || 0;
        if (amount <= 0) continue;
        await Expense.create({ groupId, amount, type: d.type || 'other', description: d.description || '', date: d.date || new Date() }, { transaction: t });
        totalDeductions += amount;
      }
    }

    const netProceeds = Number(sale_price) - Number(totalDeductions);
    if (netProceeds < 0) throw new Error('Deductions exceed sale price');

    const memberships = await Membership.findAll({ where: { groupId }, transaction: t, lock: t.LOCK.UPDATE });
    const totalContributed = memberships.reduce((s,m) => s + Number(m.contribution_amount), 0);
    if (totalContributed <= 0) throw new Error('No contributions found for this group');

    let sumDistributed = 0;
    for (const m of memberships) {
      const share = Number(m.contribution_amount) / totalContributed;
      const payout = Math.floor(netProceeds * share);
      if (payout > 0) {
        await Transaction.create({ groupId, userId: m.userId, type: 'payout', amount: payout, reference: `property_sale_${pid}` }, { transaction: t });
      }
      sumDistributed += payout;
    }

    let remainder = netProceeds - sumDistributed;
    if (remainder > 0) {
      const sorted = memberships.sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt));
      let i = 0;
      while (remainder > 0 && i < sorted.length) {
        await Transaction.create({ groupId, userId: sorted[i].userId, type: 'payout', amount: 1, reference: `property_sale_${pid}_remainder` }, { transaction: t });
        remainder -= 1;
        i++;
        if (i >= sorted.length && remainder > 0) i = 0;
      }
    }

    const group = await Group.findByPk(groupId, { transaction: t });
    group.status = 'sold';
    await group.save({ transaction: t });

    await t.commit();
    res.json({ ok: true, sale_price, totalDeductions, netProceeds });
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(400).json({ ok: false, error: err.message });
  }
});

module.exports = router;
