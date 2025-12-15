const express = require('express');
const { Group, Membership, User, Contribution, Property, SellRequest } = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

// create a group
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, total_target_amount } = req.body;
    const g = await Group.create({ name, description, total_target_amount: total_target_amount || 0, createdBy: req.user.id });
    await Membership.create({ groupId: g.id, userId: req.user.id, contribution_amount: 0 });
    res.json({ group: g });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// list groups
router.get('/', auth, async (req, res) => {
  const groups = await Group.findAll();
  res.json({ groups });
});

// group detail (with members)
router.get('/:id', auth, async (req, res) => {
  const group = await Group.findByPk(req.params.id, {
    include: [{ model: Membership, include: [User] }, Property]
  });
  if (!group) return res.status(404).json({ error: 'Group not found' });
  res.json({ group });
});

// join group
router.post('/:id/join', auth, async (req, res) => {
  try {
    const groupId = req.params.id;
    const { contribution_amount } = req.body;
    let membership = await Membership.findOne({ where: { groupId, userId: req.user.id } });
    if (!membership) {
      membership = await Membership.create({ groupId, userId: req.user.id, contribution_amount: contribution_amount || 0 });
    } else {
      membership.contribution_amount = (Number(membership.contribution_amount) || 0) + (Number(contribution_amount) || 0);
      await membership.save();
    }
    const contribution = await Contribution.create({ membershipId: membership.id, amount: contribution_amount, status: 'pending', provider: 'stub' });
    res.json({ contribution, paymentIntent: { id: `pi_stub_${contribution.id}`, client_secret: `secret_${contribution.id}`, provider: 'stub' }});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// create sell request
router.post('/:id/sell-requests', auth, async (req, res) => {
  const groupId = req.params.id;
  const { amount, asking_price } = req.body;
  const membership = await Membership.findOne({ where: { groupId, userId: req.user.id } });
  if (!membership) return res.status(400).json({ error: 'Not a member' });
  if (Number(amount) > Number(membership.contribution_amount)) return res.status(400).json({ error: 'Amount exceeds your contribution' });
  const sr = await SellRequest.create({ groupId, sellerId: req.user.id, amount, asking_price });
  res.json({ sellRequest: sr });
});

module.exports = router;
