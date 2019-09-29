var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var uuid4 = require('uuid4');
const { Component } = require('./Component');
const { Dotbot, DotbotPublisher, ServiceProp } = require('./Dotbot');

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
  values: {
    type: Map,
    of: String
  }
}, {timestamps: true});

BotSubscriptionSchema.post('save', async function(doc) {
  // Update greenhouse_bot_publisher
  let dotsub = await DotbotPublisher.findOne({_id: doc._id}).exec();
  if (!dotsub) {
    dotsub = new DotbotPublisher({ _id: doc._id });
  }
  dotsub.bot = doc.bot._id;
  dotsub.username = doc.username;
  dotsub.subscriptionType = doc.subscriptionType;
  dotsub.token = doc.token;
  await dotsub.save();

  // Update greenhouse_dotbot
  let dotbot = await Dotbot.findOne({_id: doc._id}).exec();
  if (!dotbot) {
    dotbot = new Dotbot({ _id: doc._id });
  }
  dotbot.id = doc.bot.botId;
  dotbot.name = doc.bot.name;
  dotbot.ownerId = doc.bot.username;
  dotbot.description = doc.bot.description;
  dotbot.status = doc.bot.status;
  dotbot.subscriptionType = doc.subscriptionType;
  dotbot.perUseCost = doc.bot.pricePerUse;
  dotbot.monthlyCost = doc.bot.pricePerMonth;

  // chatbot engine
  dotbot.chatbotEngine = [];
  let bot = await mongoose.model('Bots', BotSchema).findById(doc.bot);
  let component = await Component.findById(bot.botEngine.component);
  for (let i = 0; i < component.properties.length; i++) {
    let propertyId = `_${component.properties[i]._id}`;
    let value = '';
    switch (component.properties[i].valueType) {
      case 'fixed':
        value = component.properties[i].value;
        break;
      case 'developer':
        if (bot.botEngine.values.has()) {
          value = bot.botEngine.values.get(propertyId);
        }
        break;
      case 'publisher':
        if (doc.values.has()) {
          value = doc.values.get(propertyId);
        }
        break;
    }
    dotbot.chatbotEngine.set(component.properties[i].name, value);
  }

  // channels
  dotbot.channels = [];
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
          if (bot.channels[j].values.has()) {
            value = bot.channels[j].values.get(propertyId);
          }
          break;
        case 'publisher':
          if (doc.values.has()) {
            value = doc.values.get(propertyId);
          }
          break;
      }
      props.set(component.properties[i].name, value);
    }
    dotbot.channels.set(component.key, props);
  }

  // remote apis
  dotbot.remote_apis = [];
  for (let j = 0; j < bot.services.length; j++) {
    let component = await Component.findById(bot.services[j].component);
    let ra = new ServiceProp({});
    ra.id = component._id;
    ra.status = component.status;
    ra.headers = new Map();
    for (let i = 0; i < component.headers.length; i++) {
      let propertyId = `_${component.headers[i]._id}`;
      let value = '';
      switch (component.headers[i].valueType) {
        case 'fixed':
          value = component.headers[i].value;
          break;
        case 'developer':
          if (bot.services[j].values.has()) {
            value = bot.services[j].values.get(propertyId);
          }
          break;
        case 'publisher':
          if (doc.values.has()) {
            value = doc.values.get(propertyId);
          }
          break;
      }
      ra.headers.set(component.headers[i].name, value);
    }
    ra.mapped_vars = new Map();
    for (let i = 0; i < component.mappedVars.length; i++) {
      let propertyId = `_${component.mappedVars[i]._id}`;
      let value = '';
      switch (component.mappedVars[i].valueType) {
        case 'fixed':
          value = component.mappedVars[i].value;
          break;
        case 'developer':
          if (bot.services[j].values.has()) {
            value = bot.services[j].values.get(propertyId);
          }
          break;
        case 'publisher':
          if (doc.values.has()) {
            value = doc.values.get(propertyId);
          }
          break;
      }
      ra.mapped_vars.set(component.mappedVars[i].name, value);
    }
    ra.predefined_vars = new Map();
    for (let i = 0; i < component.predefinedVars.length; i++) {
      let propertyId = `_${component.predefinedVars[i]._id}`;
      let value = '';
      switch (component.predefinedVars[i].valueType) {
        case 'fixed':
          value = component.predefinedVars[i].value;
          break;
        case 'developer':
          if (bot.services[j].values.has()) {
            value = bot.services[j].values.get(propertyId);
          }
          break;
        case 'publisher':
          if (doc.values.has()) {
            value = doc.values.get(propertyId);
          }
          break;
      }
      ra.predefined_vars.set(component.predefinedVars[i].name, value);
    }
    dotbot.remote_apis.push(ra);
  }

  await dotbot.save();
});

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

module.exports = {
  Config: mongoose.model('Config', ConfigSchema),
  BotSubscription: mongoose.model('BotSubscriptions', BotSubscriptionSchema),
  Bot: mongoose.model('Bots', BotSchema)
}
