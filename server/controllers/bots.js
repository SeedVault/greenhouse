const { BotService } = require('../../domain/greenhouse/services/BotService');
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

  // POST - /bots/save
  save: async (req, res, next) => {
    if (!req.user) {
      return res.status(403).json('Forbidden');
    }
    try {
      let id = req.body.id;
      if (req.body.id === '') {
        const result = await BotService.createBot(
          req.body.category,
          req.body.name,
          req.body.description,
          req.body.features,
          req.body.price,
          req.body.status,
          req.user.username
        );
        id = result._id;
      } else {
        let bot = await BotService.findBotById(id);
        bot.category = req.body.category;
        bot.name = req.body.name;
        bot.description = req.body.description;
        bot.features = req.body.features;
        bot.price = req.body.price;
        bot.status = req.body.status;
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
}

module.exports = bots;

