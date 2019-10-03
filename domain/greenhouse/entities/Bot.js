var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var uuid4 = require('uuid4');
const { Component } = require('./Component');
const { Dotbot, DotbotPublisher, DotService, ServiceProp } = require('./Dotbot');

const ConfigSchema = mongoose.Schema({
  component: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Components'
  },
  subscriptionType: {
    type: String,
    required: [true, 'validation.required'],
    enum:  {
      values: ['free', 'month', 'use'],
      message: 'validation.option'
    },
    trim: true,
  },
  values: {
    type: Map,
    of: String
  }
});

const BotSubscriptionConfigSchema = mongoose.Schema({
  component: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Components'
  },
  values: {
    type: Map,
    of: String
  }
});

const BotSubscriptionSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, 'validation.required'],
    index: true,
  },
  bot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bots',
    required: [true, 'validation.required'],
  },
  subscriptionType: {
    type: String,
    required: [true, 'validation.required'],
    enum:  {
      values: ['free', 'month', 'use'],
      message: 'validation.option'
    },
    trim: true,
  },
  token: {
    type: String,
    required: [true, 'validation.required'],
    default: uuid4(),
    trim: true,
  },
  botEngine: {
    type: BotSubscriptionConfigSchema,
  },
  services: {
    type: [ BotSubscriptionConfigSchema ],
  },
  channels: {
    type: [ BotSubscriptionConfigSchema ],
  }
}, {timestamps: true});

const BotSchema = mongoose.Schema({
  botId: {
    type: String,
    required: [true, 'validation.required'],
    match: [/^[a-zA-Z_$][a-zA-Z_\-$0-9]*$/, 'validation.regex'],
    // match: [/^[^a-zA-Z_$]|[^\\w$]/, 'validation.regex'],
    index: true,
    unique: true,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'validation.required'],
    enum:  {
      values: ['general', 'weather'],
      message: 'validation.option'
    },
    trim: true,
    index: true,
  },
  name: {
    type: String,
    required: [true, 'validation.required'],
    index: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'validation.required'],
    trim: true
  },
  features: {
    type: String,
    required: [true, 'validation.required'],
    trim: true
  },
  license: {
    type: String,
    required: [true, 'validation.required'],
    trim: true
  },
  pricingModel: {
    type: String,
    required: [true, 'validation.required'],
    enum:  {
      values: ['free', 'pay_per_use', 'pay_per_month', 'pay_per_use_or_month'],
      message: 'validation.option'
    },
    trim: true,
    index: true,
  },
  pricePerUse: {
    type: Number,
    min: [0, 'validation.option'],
    max: [9999, 'validation.option'],
    required: [true, 'validation.required'],
    default: 0,
    index: true
  },
  pricePerMonth: {
    type: Number,
    min: [0, 'validation.option'],
    max: [9999, 'validation.option'],
    required: [true, 'validation.required'],
    default: 0,
    index: true
  },
  status: {
    type: String,
    required: [true, 'validation.required'],
    enum:  {
      values: ['enabled', 'disabled'],
      message: 'validation.option'
    },
    trim: true,
    index: true,
  },
  picture: {
    type: String,
    trim: true,
    default: '',
  },
  username: {
    type: String,
    required: [true, 'validation.required'],
    match: [/^[a-zA-Z0-9]+$/, 'validation.regex'],
    index: true,
    trim: true
  },
  botEngine: {
    type: ConfigSchema,
    required: [true, 'validation.required'],
  },
  services: {
    type: [ ConfigSchema ],
  },
  channels: {
    type: [ ConfigSchema ],
  }
}, {timestamps: true});

BotSchema.set('toJSON', { getters: true, virtuals: true });
BotSchema.set('toObject', { getters: true, virtuals: true });

BotSchema.plugin(uniqueValidator, { message: 'domain.bot.validation.unique_{PATH}' });

BotSchema.virtual('pictureUrl').get(function () {
  if (this.picture === '') {
    return '/images/bot-default.png';
  } else {
    return `/uploads/${this.picture}`;
  }
});


BotSchema.post('save', async function(doc) {
  await Dotbot.deleteOne({botId: doc._id});
  let dotbot = new Dotbot({ botId: doc._id });
  dotbot.ownerName = doc.username;
  dotbot.name = doc.botId;
  dotbot.title = doc.name;
  dotbot.description = doc.description;
  // chatbot engine
  dotbot.chatbotEngine = [];
  let component = await Component.findById(doc.botEngine.component);
  for (let i = 0; i < component.properties.length; i++) {
    let propertyId = `_${component.properties[i]._id}`;
    let value = '';
    switch (component.properties[i].valueType) {
      case 'fixed':
        value = component.properties[i].value;
        break;
      case 'developer':
        if (doc.botEngine.values.has(propertyId)) {
          value = doc.botEngine.values.get(propertyId);
        }
        break;
      /*case 'publisher':
        if (doc.values.has(propertyId)) {
          value = doc.values.get(propertyId);
        }
        break; */
    }
    dotbot.chatbotEngine.set(component.properties[i].name, value);
  }
  switch (doc.pricingModel) {
    case 'free':
      dotbot.pricingModel = 'free';
      break;
    case 'pay_per_use':
      dotbot.pricingModel = 'perUse';
      break;
    case 'pay_per_month':
      dotbot.pricingModel = 'perMonth';
      break;
    case 'pay_per_use_or_month':
      dotbot.pricingModel = 'perUse_perMonth';
      break;
  }
  dotbot.perUseCost = doc.pricePerUse;
  dotbot.perMonthCost = doc.pricePerMonth;
  dotbot.updatedAt = doc.updatedAt;
  await dotbot.save();
});

/* BotSubscriptionSchema.post('remove', async function(doc) {
  await DotbotPublisher.deleteOne({botId: doc.bot._id, publisherName: doc.username});
}); */

BotSubscriptionSchema.post('save', async function(doc) {
  await DotbotPublisher.deleteOne({botId: doc.bot._id, publisherName: doc.username});
  let dotsub = new DotbotPublisher({botId: doc.bot._id, publisherName: doc.username});
  let botModel = mongoose.model('Bots', BotSchema);
  const bot = await botModel.findById(doc.bot);
  dotsub.token = doc.token;
  dotsub.botName = bot.botId;
  switch (doc.subscriptionType) {
    case 'free':
      dotsub.subscriptionType = 'free';
      break;
    case 'use':
      dotsub.subscriptionType = 'perUse';
      break;
    case 'month':
      dotsub.subscriptionType = 'perMonth';
      break;
  }
  dotsub.updatedAt = doc.updatedAt;
  // channels
  dotsub.channels = [];
  for (let j = 0; j < bot.channels.length; j++) {
    let component = await Component.findById(bot.channels[j].component);
    let props = new Map();
    for (let i = 0; i < component.properties.length; i++) {
      let propertyId = `_${component.properties[i]._id}`;
      let value = '';
      switch (component.properties[i].valueType) {
        case 'fixed':
          value = component.properties[i].value;
          break;
        case 'developer':
          if (bot.channels[j].values.has(propertyId)) {
            value = bot.channels[j].values.get(propertyId);
          }
          break;
        /* case 'publisher':
          if (doc.channels.has(propertyId)) {
            value = doc.channels.get(propertyId);
          }
          break; */
      }
      props.set(component.properties[i].name, value);
    }
    dotsub.channels.set(component.key, props);
  }
  // Services
  dotsub.services = [];
  if (bot.services.length > 0) {
    for (let j = 0; j < bot.services.length; j++) {
      let component = await Component.findById(bot.services[j].component);
      let service = new DotService({});
      service.ownerName = component.username;
      service.name = component.key;
      service.title = component.name;
      service.category = component.category;
      service.url = component.url;
      service.method = component.httpMethod.toLowerCase();
      service.timeout = component.timeout;
      service.function_name = component.functionName;
      switch (bot.services[j].subscriptionType) {
        case 'free':
          service.subscriptionType = 'free';
          service.cost = 0;
          break;
        case 'use':
          service.subscriptionType = 'perUse';
          service.cost = component.pricePerUse;
          break;
        case 'month':
          service.subscriptionType = 'perMonth';
          service.cost = component.pricePerMonth;
          break;
      }
      // Headers
      service.headers = new Map();
      for (let i = 0; i < component.headers.length; i++) {
        let propertyId = `_${component.headers[i]._id}`;
        let value = '';
        switch (component.headers[i].valueType) {
          case 'fixed':
            value = component.headers[i].value;
            break;
          case 'developer':
            if (doc.services[j].values.has(propertyId)) {
              value = doc.services[j].values.get(propertyId);
            }
            break;
          /*case 'publisher':
            if (doc.headers.has(propertyId)) {
              value = doc.headers.get(propertyId);
            }
            break; */
          case 'publisher':
            for (let k = 0; k < doc.services.length; k++) {
              if (component._id.toString() == doc.services[k].component.toString()) {
                if (doc.services[k].values.has(propertyId)) {
                  value = doc.services[k].values.get(propertyId);
                }
                break;
              }
            }
            break;
        }
        service.headers.set(component.headers[i].name, value);
      }

      // Predefined vars
      service.predefined_vars = new Map();
      for (let i = 0; i < component.predefinedVars.length; i++) {
        let propertyId = `_${component.predefinedVars[i]._id}`;
        let value = '';
        switch (component.predefinedVars[i].valueType) {
          case 'fixed':
            value = component.predefinedVars[i].value;
            break;
          case 'developer':
            if (doc.services[j].values.has(propertyId)) {
              value = doc.services[j].values.get(propertyId);
            }
            break;
          case 'publisher':
            for (let k = 0; k < doc.services.length; k++) {
              if (component._id.toString() == doc.services[k].component.toString()) {
                if (doc.services[k].values.has(propertyId)) {
                  value = doc.services[k].values.get(propertyId);
                }
                break;
              }
            }
            break;
        }
        service.predefined_vars.set(component.predefinedVars[i].name, value);
      }

      // Mapped vars
      service.mapped_vars = [];
      for (let i = 0; i < component.mappedVars.length; i++) {
        // let value = '';
        /*let propertyId = `_${component.mappedVars[i]._id}`;
        let value = '';
        switch (component.mappedVars[i].valueType) {
          case 'fixed':
            value = component.mappedVars[i].value;
            break;
          case 'developer':
            if (doc.services[j].values.has(propertyId)) {
              value = doc.services[j].values.get(propertyId);
            }
            break;
          case 'publisher':
            for (let k = 0; k < doc.services.length; k++) {
              if (component._id.toString() == doc.services[k].component.toString()) {
                if (doc.services[k].values.has(propertyId)) {
                  value = doc.services[k].values.get(propertyId);
                }
                break;
              }
            }
            break;
        }*/
        // service.mapped_vars.set(component.mappedVars[i].name, value);
        service.mapped_vars.push(component.mappedVars[i].name);
      }
      // Save service
      dotsub.services.push(service);
    }
  }
  await dotsub.save();
});

module.exports = {
  Config: mongoose.model('Config', ConfigSchema),
  BotSubscription: mongoose.model('BotSubscriptions', BotSubscriptionSchema),
  Bot: mongoose.model('Bots', BotSchema),
  BotSubscriptionConfig: mongoose.model('BotSubscriptionConfig', BotSubscriptionConfigSchema)
}
