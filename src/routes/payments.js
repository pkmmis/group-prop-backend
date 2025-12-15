const express = require('express');
const router = express.Router();
const { Contribution, Membership, Transaction } = require('../db');

router.post('/webhook', async (req, res) => {
  try {
    const { contributionId, status } = req.body;
    const contribution = await Contribution.findByPk(contributionId);
    if (!contribution) return res.status(404).json({ error: 'Not found' });
    contribution.status = status || 'completed';
    await contribution.save();

    if (contribution.status === 'completed') {
      const membership = await Membership.findByPk(contribution.membershipId);
      if (membership) {
        membership.contribution_amount = Number(membership.contribution_amount) + Number(contribution.amount);
        await membership.save();
        await Transaction.create({ groupId: membership.groupId, userId: membership.userId, type: 'contribution', amount: contribution.amount, reference: `contrib_${contribution.id}` });
      }
    }

    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
