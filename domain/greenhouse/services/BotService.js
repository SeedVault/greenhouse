const ValidationError = require('mongoose/lib/error/validation');
const { Component, Property } = require('../entities/Component');
const { Bot, BotSubscription, Config } = require('../entities/Bot');
const { Dotbot, DotbotPublisher } = require('../entities/Dotbot');
const uuid4 = require('uuid4');
const { ComponentService, ComponentNotFoundError,
  ForbiddenComponentError, PropertyNotFoundError } = require ('./ComponentService');
const ObjectId = require('mongodb').ObjectID;

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

class BotEngineRequiredError extends ValidationError {
  constructor(message) {
    super(message);
    this.name = 'BotEngineRequiredError';
    this.errors['_'] = { message: 'domain.bot.validation.bot_engine_required' };
  }
}

class ChannelRequiredError extends ValidationError {
  constructor(message) {
    super(message);
    this.name = 'ChannelRequiredError';
    this.errors['_'] = { message: 'domain.bot.validation.channel_required' };
  }
}

class BotSubscriptionNotFoundError extends ValidationError {
  constructor(message) {
    super(message);
    this.name = 'BotSubscriptionNotFoundError';
    this.errors['_'] = { message: 'domain.bot.validation.bot_subscription_not_found' };
  }
}

const BotService = {

  createConfig: async (componentParams) => {
    if (typeof componentParams.component == 'undefined') {
      return {};
    }
    const component = await ComponentService.findComponentById(componentParams.component);
    let config = new Config({
      component: component._id,
      subscriptionType: componentParams.subscriptionType,
      values: componentParams.values
    });
    return config;
  },

  checkComponents: async (bot) => {
    if (typeof bot.botEngine.component == 'undefined') {
      throw new BotEngineRequiredError();
    }
    if (bot.channels.length === 0) {
      throw new ChannelRequiredError();
    }
  },

  createBot: async (category, botId, name, description, features, license, pricingModel, pricePerUse,
    pricePerMonth, status, username, botEngineParams, servicesParams, channelsParams) => {
    const botEngine = await BotService.createConfig(botEngineParams);
    let services = [];
    for (let i = 0; i < servicesParams.length; i += 1) {
      services.push(await BotService.createConfig(servicesParams[i]));
    }
    let channels = [];
    for (let i = 0; i < channelsParams.length; i += 1) {
      channels.push(await BotService.createConfig(channelsParams[i]));
    }
    let bot = new Bot({
      category,
      botId,
      name,
      description,
      features,
      license,
      pricingModel,
      pricePerUse,
      pricePerMonth,
      status,
      username,
      botEngine,
      services,
      channels
    });
    await BotService.checkComponents(bot);
    const result = await bot.save();
    if (typeof result.id !== 'undefined') {
      let subscriptionType = '';
      switch(pricingModel) {
        case 'pay_per_use':
          subscriptionType = 'use';
          break;
        case 'pay_per_month':
          subscriptionType = 'month';
          break;
        case 'pay_per_use_or_month':
          subscriptionType = 'use';
          break;
        default:
          subscriptionType = 'free';
          break;
      }
      const subscription = await BotService.subscribe(username, result._id, subscriptionType);
    }
    return result;
  },

  updateBot: async (username, bot) => {
    await BotService.checkComponents(bot);
    await BotService.findMyBotById(username, bot._id);
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

  findPaginatedBots: async (resultsPerPage, currentPage, username, search, status, sortBy, sortType, category) => {
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
    if (category !== '' ) {
      query['category'] = category;
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
    await BotService.findMyBotById(username, id);
    const result = await Bot.deleteOne({_id: id});
    await BotSubscription.deleteMany({'bot': id}).exec();
    await Dotbot.deleteOne({botId: id});
    await DotbotPublisher.deleteMany({botId: id});
    return result;
  },

  createSubscriptionConfig: async (componentParams) => {
    if (typeof componentParams == 'undefined') {
      return {};
    }
    if (typeof componentParams.component == 'undefined') {
      return {};
    }
    const component = await ComponentService.findComponentById(componentParams.component);
    let config = new Config({
      component: component._id,
      values: componentParams.values
    });
    return config;
  },

  subscribe: async (username, botId, subscriptionType,
    botEngineParams, servicesParams, channelsParams) => {
      if (typeof servicesParams == 'undefined') {
        servicesParams = [];
      }
      if (typeof channelsParams == 'undefined') {
        channelsParams = [];
      }
      const botEngine = await BotService.createSubscriptionConfig(botEngineParams);
      let services = [];
      for (let i = 0; i < servicesParams.length; i += 1) {
        services.push(await BotService.createSubscriptionConfig(servicesParams[i]));
      }
      let channels = [];
      for (let i = 0; i < channelsParams.length; i += 1) {
        channels.push(await BotService.createSubscriptionConfig(channelsParams[i]));
      }
    const bot = await BotService.findBotById(botId);
    let subscription = new BotSubscription({});
    try {
      subscription = await BotService.findSubscriptionByUserAndBot(username, botId);
      subscription.subscriptionType = subscriptionType;
      subscription.botEngine = botEngine;
      subscription.services = services;
      subscription.channels = channels;

    } catch (err) {
      if (err instanceof BotSubscriptionNotFoundError) {
        const token = uuid4();
        subscription = new BotSubscription({
          token,
          username,
          bot,
          subscriptionType,
          botEngine,
          services,
          channels,
        });
      } else {
        throw err;
      }
    }
    return await subscription.save();
  },

  findSubscriptionByUserAndBot: async (username, botId) => {
    let subscription = await BotSubscription.findOne({username: username, 'bot': botId}).exec();
    if (!subscription) {
      throw new BotSubscriptionNotFoundError();
    }
    return subscription;
  },

  unsubscribe: async (username, botId) => {
    let subscription = await BotSubscription.findOne({username: username, 'bot': botId}).exec();
    if (!subscription) {
      throw new BotSubscriptionNotFoundError();
    }
    const result = await BotSubscription.deleteOne({_id: subscription._id});
    try {
      await DotbotPublisher.deleteOne({botId: botId, publisherName: username});
    } catch (err) {
      // do nothing
    }
    return result;
  },

  findSubscriptionByUser: async (username) => {
    const subscriptions = await BotSubscription.find({username: username}).exec();
    return subscriptions;
  },

  findPaginatedBotSubscriptions: async (currentUsername, resultsPerPage, currentPage, username, search, status, sortBy, sortType, category) => {
    const subscriptions = await BotService.findSubscriptionByUser(currentUsername);
    const ids = [];
    for (let i = 0; i < subscriptions.length; i += 1) {
      ids.push(ObjectId(subscriptions[i].bot));
    }
    let query = {}
    let sorting = {}
    query['_id'] = { $in: ids };
    if (username !== '' ) {
      query['username'] = username;
    }
    if (search !== '') {
      query['$and'] = [{ $or: [{name: { $regex:  `.*${search}.*`, $options: 'i' }}, {description: { $regex:  `.*${search}.*`, $options: 'i' }}] }];
    }
    if (status !== '' ) {
      query['status'] = status;
    }
    if (category !== '' ) {
      query['category'] = category;
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

  normalizePropertyErrors(err) {
    if (err.errors) {
      let keys = Object.keys(err.errors);
      let values = Object.values(err.errors);
      for (let i = 0; i < keys.length; i += 1) {
        if (keys[i].startsWith('properties.')) {
          let parts = keys[i].split('.');
          err.errors[keys[i]] = parts[2];
          Object.defineProperty(err.errors, parts[2],
            Object.getOwnPropertyDescriptor(err.errors, keys[i]));
            err.errors[parts[2]] = values[i];
            delete err.errors[keys[i]];
        }
      }
    }
    return err;
  },

  addProperty: async (username, id, property) => {
    let bot = await BotService.findMyBotById(username, id);
    bot.properties.push(property);
    try {
      return await bot.save();
    } catch (err) {
      if (err instanceof ValidationError) {
        throw BotService.normalizePropertyErrors(err);
      }
    }
  },

  findProperty: async (bot, propertyId) => {
    let p = await bot.properties.id(propertyId);
    if (p === null) {
      throw new PropertyNotFoundError();
    } else {
      return p;
    }
  },

  updateProperty: async (username, id, property) => {
    let bot = await BotService.findMyBotById(username, id);
    let p = await BotService.findProperty(bot, property._id);
    p.name = property.name;
    p.valueType = property.valueType;
    p.inputType = property.inputType;
    p.options = property.options;
    p.required = property.required;
    p.value = property.value;
    p.tooltip = property.tooltip;
    try {
      await bot.save();
    } catch (err) {
      if (err instanceof ValidationError) {
        throw BotService.normalizePropertyErrors(err);
      }
    }
  },

  deleteProperty: async (username, id, property) => {
    let bot = await BotService.findMyBotById(username, id);
    let p = await BotService.findProperty(bot, property._id);
    p.remove();
    return await bot.save();
  },

  reorderProperties: async (username, id, propertyIds) => {
    let bot = await BotService.findMyBotById(username, id);
    let p = new Array(propertyIds.length);
    for (let i = 0; i < propertyIds.length; i += 1) {
      p[i] = await BotService.findProperty(bot, propertyIds[i]);
    }
    bot.properties = p;
    return await bot.save();
  }
}

module.exports = {
  BotNotFoundError,
  ForbiddenBotError,
  BotEngineRequiredError,
  ChannelRequiredError,
  BotSubscriptionNotFoundError,
  BotService,
}
