const ValidationError = require('mongoose/lib/error/validation');
const { Component, Property } = require('../entities/Component');
const { Bot, Config } = require('../entities/Bot');
const { ComponentService, ComponentNotFoundError,
  ForbiddenComponentError, PropertyNotFoundError } = require ('./ComponentService');

class BotNotFoundError extends ValidationError {
  constructor(message) {
    super(message);
    this.name = 'BotNotFoundError';
    this.errors['_'] = { message: 'domain.bot.validation.bot_not_found' };
  }
}

class ForbiddenBotError extends ValidationError {
  constructor(message) {
    super(message);
    this.name = 'ForbiddenBotError';
    this.errors['_'] = { message: 'domain.bot.validation.forbidden_bot' };
  }
}

const BotService = {

  createConfig: async (componentParams) => {
    const component = await ComponentService.findComponentById(componentParams.component);
    let config = new Config({
      component: component._id,
      values: componentParams.values
    });
    return config;
  },

  createBot: async (category, name, description, features, price, status, username,
    botEngineParams, servicesParams, channelsParams) => {
    const botEngine = await BotService.createConfig(botEngineParams);
    let services = [];
    for (let i = 0; i < servicesParams.length; i++) {
      services.push(await BotService.createConfig(servicesParams[i]));
    }
    let channels = [];
    for (let i = 0; i < channelsParams.length; i++) {
      channels.push(await BotService.createConfig(channelsParams[i]));
    }
    let bot = new Bot({
      category,
      name,
      description,
      features,
      price,
      status,
      username,
      botEngine,
      services,
      channels
    });
    return await bot.save();
  },

  updateBot: async (username, bot) => {
    const savedBot = await BotService.findMyBotById(username, bot._id);
    return await bot.save();
  },

  findBotById: async (id) => {
    let bot = await Bot.findById(id).exec();
    if (!bot) {
      throw new BotNotFoundError();
    }
    return bot;
  },

  findMyBotById: async (username, id) => {
    let bot = await Bot.findById(id).exec();
    if (!bot) {
      throw new BotNotFoundError();
    }
    if (bot.username === username) {
      return bot;
    } else {
      throw new ForbiddenBotError('');
    }
  },

  findPaginatedBots: async (resultsPerPage, currentPage, username, search, status, sortBy, sortType) => {
    let query = {}
    let sorting = {}
    if (username !== '' ) {
      query['username'] = username;
    }
    if (search !== '') {
      query['$and'] = [{ $or: [{name: { $regex:  `.*${search}.*`, $options: 'i' }}, {description: { $regex:  `.*${search}.*`, $options: 'i' }}] }];
    }
    if (status !== '' ) {
      query['status'] = status;
    }
    if (sortBy !== '' ) {
      sorting[sortBy] = sortType;
    }
    const results = await Bot.find(query)
      .sort(sorting)
      .skip((resultsPerPage * currentPage) - resultsPerPage)
      .limit(resultsPerPage);
    const resultsCount = await Bot.countDocuments(query);
    const pagesCount = Math.ceil(resultsCount / resultsPerPage);
    return {
      results,
      resultsCount,
      currentPage,
      pagesCount,
    }
  },

  deleteBotById: async (username, id) => {
    let bot = await BotService.findMyBotById(username, id);
    return await Bot.deleteOne({_id: id});
  },

}

module.exports = {
  BotNotFoundError,
  ForbiddenBotError,
  BotService,
}
