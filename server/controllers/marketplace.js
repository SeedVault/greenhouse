const { BotService, BotSubscriptionNotFoundError } = require('../../domain/greenhouse/services/BotService');
const { ComponentService } = require('../../domain/greenhouse/services/ComponentService');
const ValidationError = require('mongoose/lib/error/validation');
const fs = require('fs');
const {resolve} = require("path");

const marketplace = {

  // GET - /api/markteplace/bots/:id
  marketplaceBotsList: async (req, res, next) => {
    if (!req.user) {
      return res.status(403).json('Forbidden');
    }
    try {
      const resultsPerPage = 10;
      const page = req.query.page || 1;
      const search = req.query.search || '';
      const subscription = req.query.subscription || '';
      let status = 'enabled';
      let sortBy = req.query.sortBy || '';
      if (sortBy !== 'name' && sortBy !== 'updatedAt') {
        sortBy = '';
      }
      let sortType = req.query.sortType || 'asc';
      if (sortType !== 'asc' && sortType !== 'desc') {
        sortType = 'asc';
      }
      let data = '';
      if (subscription === 'mine') {
        data = await BotService.findPaginatedBotSubscriptions(
          req.user.username,
          resultsPerPage,
          page,
          '',
          search,
          status,
          sortBy,
          sortType,
        );
      } else {
        data = await BotService.findPaginatedBots(
          resultsPerPage,
          page,
          '',
          search,
          status,
          sortBy,
          sortType,
        );
      }
      res.json(data);
    } catch (err) {
      next(err);
    }
  },


  // GET - /api/markteplace/bots/:id
  marketplaceBotsView: async (req, res, next) => {
    if (!req.user) {
      return res.status(403).json('Forbidden');
    }
    let data = {
      subscribed: false
    };
    try {
      data.bot = await BotService.findBotById(req.params.id);
      data.subscription = {};
    } catch (err) {
      next(err);
    }

    // find subscription
    try {
      data.subscription = await BotService.findSubscriptionByUserAndBot(req.user.username, req.params.id);
      data.subscribed = true;
    } catch (err) {
      if (err instanceof BotSubscriptionNotFoundError) {
        // there is no subscription yet
      } else {
        // next(err);
        return res.status(500).json(err);
      }
    }

    res.json(data);
  },


  // GET - /marketplace/components/list
  marketplaceComponentsList: async (req, res, next) => {
    if (!req.user) {
      return res.status(403).json('Forbidden');
    }
    try {
      const resultsPerPage = 10;
      const page = req.query.page || 1;
      const search = req.query.search || '';
      let username = '';
      let componentType = req.query.componentType || '';
      if (componentType !== 'botengine' && componentType !== 'service' && componentType !== 'channel') {
        componentType = '';
      }
      let status = 'enabled';
      let sortBy = req.query.sortBy || '';
      if (sortBy !== 'name' && sortBy !== 'updatedAt') {
        sortBy = '';
      }
      let sortType = req.query.sortType || 'asc';
      if (sortType !== 'asc' && sortType !== 'desc') {
        sortType = 'asc';
      }
      const data = await ComponentService.findPaginatedComponents(
        resultsPerPage,
        page,
        username,
        search,
        componentType,
        status,
        sortBy,
        sortType,
      );
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

}

module.exports = marketplace;
