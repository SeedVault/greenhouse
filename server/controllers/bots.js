const { BotService, BotSubscriptionNotFoundError } = require('../../domain/greenhouse/services/BotService');
const ValidationError = require('mongoose/lib/error/validation');
const fs = require('fs');
const {resolve} = require("path");

const bots = {

  // GET - /bots/list
  list: async (req, res, next) => {
    if (!req.user) {
      return res.status(403).json('Forbidden');
    }
    try {
      const resultsPerPage = 10;
      const page = req.query.page || 1;
      const search = req.query.search || '';
      let status = req.query.status || '';
      if (status !== 'enabled' && status !== 'disabled') {
        status = '';
      }
      let sortBy = req.query.sortBy || '';
      if (sortBy !== 'name' && sortBy !== 'updatedAt') {
        sortBy = '';
      }
      let sortType = req.query.sortType || 'asc';
      if (sortType !== 'asc' && sortType !== 'desc') {
        sortType = 'asc';
      }
      const data = await BotService.findPaginatedBots(
        resultsPerPage,
        page,
        req.user.username,
        search,
        status,
        sortBy,
        sortType,
      );
      res.json(data);
    } catch (err) {
      next(err);
    }
  },


  toComponentValues: async (c) => {
    let v = Object.values(c);
    return {
      component: v[0],
      subscriptionType: v[1],
      values: v[2]
    };
  },

  // POST - /bots/save
  save: async (req, res, next) => {
    if (!req.user) {
      return res.status(403).json('Forbidden');
    }
    try {
      let id = req.body.id;
      let botengine = await bots.toComponentValues(req.body.botengine);
      let services = [];
      for (let i = 0; i < req.body.services.length; i++) {
        services.push(await bots.toComponentValues(req.body.services[i]));
      }
      let channels = [];
      for (let i = 0; i < req.body.channels.length; i++) {
        channels.push(await bots.toComponentValues(req.body.channels[i]));
      }
      if (req.body.id === '') {
        const result = await BotService.createBot(
          req.body.category,
          req.body.botId,
          req.body.name,
          req.body.description,
          req.body.features,
          req.body.license,
          req.body.pricingModel,
          req.body.pricePerUse,
          req.body.pricePerMonth,
          req.body.status,
          req.user.username,
          botengine,
          services,
          channels,
        );
        id = result._id;
      } else {
        let bot = await BotService.findBotById(id);
        bot.category = req.body.category;
        bot.botId = req.body.botId;
        bot.name = req.body.name;
        bot.description = req.body.description;
        bot.features = req.body.features;
        bot.license = req.body.license;
        bot.pricingModel = req.body.pricingModel;
        bot.pricePerUse = req.body.pricePerUse;
        bot.pricePerMonth = req.body.pricePerMonth;
        bot.status = req.body.status;
        bot.botEngine = botengine;
        bot.services = services;
        bot.channels = channels;
        await BotService.updateBot(req.user.username, bot);
      }
      res.status(200).json({saved: true, id: id});
    } catch (err) {
      if (err instanceof ValidationError) {
        res.status(422).json(err);
      } else {
        return res.status(500).json(err);
      }
    }
  },

  // GET - /bots/:id
  view: async (req, res, next) => {
    if (!req.user) {
      return res.status(403).json('Forbidden');
    }
    try {
      const data = await BotService.findBotById(req.params.id);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  // POST - /bots/delete
  delete: async (req, res, next) => {
    if (!req.user) {
      return res.status(403).json('Forbidden');
    }
    try {
      const bot = await BotService.findMyBotById(req.user.username, req.body.id);
      const oldFile = resolve(`${__dirname}/../../public/uploads/${bot.picture}`);
      if (bot.picture !== '') {
        if (fs.existsSync(oldFile)) {
          fs.unlink(oldFile, (err) => {
            if (err) {
              console.error(err)
              return
            }
          })
        }
      }
      const data = await BotService.deleteBotById(req.user.username, req.body.id);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  // POST - /bots/:id/change-picture
  changePicture: async (req, res, next) => {
    if (!req.user) {
      return res.status(403).json('Forbidden');
    }
    try {
      const bot = await BotService.findMyBotById(req.user.username, req.params.id);
      const oldFile = resolve(`${__dirname}/../../public/uploads/${bot.picture}`);
      if (bot.picture !== '') {
        if (fs.existsSync(oldFile)) {
          fs.unlink(oldFile, (err) => {
            if (err) {
              console.error(err)
              return
            }
          })
        }
      }
      bot.picture = req.file.filename;
      const data = await BotService.updateBot(req.user.username, bot);
      res.status(200).json(oldFile);
    } catch (err) {
      next(err);
    }
  },

  // GET - /api/markteplace/bots/:id
  marketplaceList: async (req, res, next) => {
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
   marketplaceView: async (req, res, next) => {
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


  // POST - /api/subscriptions/bots/:id/subscribe
  subscribe: async (req, res, next) => {
    if (!req.user) {
      return res.status(403).json('Forbidden');
    }
    try {
      let botId = req.params.id;
      const subscriptionType = req.body.subscriptionType;
      let botengine = await bots.toComponentValues(req.body.botengine);
      let services = [];
      for (let i = 0; i < req.body.services.length; i++) {
        services.push(await bots.toComponentValues(req.body.services[i]));
      }
      let channels = [];
      for (let i = 0; i < req.body.channels.length; i++) {
        channels.push(await bots.toComponentValues(req.body.channels[i]));
      }
      const subscription = await BotService.subscribe(
        req.user.username,
        botId,
        subscriptionType,
        botengine,
        services,
        channels
      );
      res.status(200).json({saved: true, subscriptionId: subscription.id});
    } catch (err) {
      return res.status(500).json(err);
    }
  },

  // POST - /api/subscriptions/bots/:id/unsubscribe
  unsubscribe: async (req, res, next) => {
    if (!req.user) {
      return res.status(403).json('Forbidden');
    }
    try {
      let botId = req.params.id;
      await BotService.unsubscribe(req.user.username, botId);
      res.status(200).json({unsubscribed: true});
    } catch (err) {
      return res.status(500).json(err);
    }
  },
}

module.exports = bots;

