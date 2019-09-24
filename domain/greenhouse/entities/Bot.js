var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
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

const BotSchema = mongoose.Schema({
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
      values: ['free', 'paid'],
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
  Bot: mongoose.model('Bots', BotSchema)
}
