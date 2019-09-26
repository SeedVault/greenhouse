var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var uuid4 = require('uuid4');
const { Component } = require('./Component');

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
