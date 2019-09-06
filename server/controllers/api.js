const { WalletService } = require('../../domain/wallet/services/WalletService');
const ValidationError = require('mongoose/lib/error/validation');

const api = {

  // GET - /api/dashboard
  getDashboard: async (req, res, next) => {
    if (!req.user) {
      return res.status(403).json('Forbidden');
    }
    try {
      const data = await WalletService.getDashboardInfo(req.user.username);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },
}

module.exports = api;
