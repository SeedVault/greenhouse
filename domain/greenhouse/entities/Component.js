var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const { DotService } = require('./Dotbot');

const PropertySchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'validation.required'],
    match: [/^[a-zA-Z_$][a-zA-Z_\-$0-9]*$/, 'validation.regex'],
    trim: true,
  },
  valueType: {
    type: String,
    required: [true, 'validation.required'],
    enum:  {
      values: ['fixed', 'developer', 'publisher'],
      message: 'validation.option'
    },
    trim: true,
    default: 'fixed'
  },
  inputType: {
    type: String,
    required: [true, 'validation.required'],
    enum:  {
      values: ['select', 'text', 'textarea'],
      message: 'validation.option'
    },
    trim: true,
    default: 'text',
  },
  options: {  // options: ["Ms", "Mr", "Mx", "Dr", "Madam", "Lord"]
    type: String,
    trim: true,
  },
  required: {
    type: String,
    required: [true, 'validation.required'],
    enum:  {
      values: ['yes', 'no'],
      message: 'validation.option'
    },
    trim: true,
    default: 'yes'
  },
  value: {
    type: String,
    trim: true
  },
  tooltip: {
    type: String,
    trim: true,
    default: ''
  },
});


const ComponentSchema = mongoose.Schema({
  componentType: {
    type: String,
    required: [true, 'validation.required'],
    enum:  {
      values: ['botengine', 'service', 'channel'],
      message: 'validation.option'
    },
    trim: true,
    index: true,
  },
  category: {
    type: String,
    required: [true, 'validation.required'],
    enum:  {
      values: [
        'coaching_and_training',
        'communication',
        'cryptocurrency',
        'customer_service',
        'design',
        'education',
        'entertainment',
        'events',
        'finance',
        'games',
        'general',
        'health_and_fitness',
        'healthcare',
        'marketing',
        'news',
        'personal',
        'security',
        'real_estate',
        'research',
        'retail',
        'support',
        'travel',
        'utilities',
        'weather',
      ],
      message: 'validation.option'
    },
    default: 'general',
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
  key: {
    type: String,
    required: [true, 'validation.required'],
    match: [/^[a-zA-Z_$][a-zA-Z_$0-9]*$/, 'validation.regex'],
    // match: [/^[^a-zA-Z_$]|[^\\w$]/, 'validation.regex'],
    index: true,
    unique: true,
    trim: true
  },
  functionName: {
    type: String,
    required: [true, 'validation.required'],
    match: [/^[a-zA-Z_$][a-zA-Z_$0-9]*$/, 'validation.regex'],
    trim: true
  },
  url: {
    type: String,
    // required: [true, 'validation.required'],
    trim: true
  },
  httpMethod: {
    type: String,
    required: [true, 'validation.required'],
    enum:  {
      values: ['GET', 'POST'],
      message: 'validation.option'
    },
    trim: true,
    default: 'GET'
  },
  timeout: {
    type: Number,
    min: [0, 'validation.option'],
    max: [9999, 'validation.option'],
    required: [true, 'validation.required'],
    default: 30,
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
    default: 'free'
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
  properties: {
    type: [ PropertySchema ],
  },
  headers: {
    type: [ PropertySchema ],
  },
  predefinedVars: {
    type: [ PropertySchema ],
  },
  mappedVars: {
    type: [ PropertySchema ],
  },
}, {timestamps: true});

ComponentSchema.set('toJSON', { getters: true, virtuals: true });
ComponentSchema.set('toObject', { getters: true, virtuals: true });

ComponentSchema.plugin(uniqueValidator, { message: 'domain.component.validation.unique_{PATH}' });

ComponentSchema.virtual('pictureUrl').get(function () {
  if (this.picture === '') {
    return '/images/component-default.png';
  } else {
    return `/uploads/${this.picture}`;
  }
});

ComponentSchema.virtual('hasPublisherProps').get(function () {
  for (let i = 0; i < this.properties.length; i++) {
    if (this.properties[i].valueType == 'publisher') {
      return true;
    }
  }
  for (let i = 0; i < this.headers.length; i++) {
    if (this.headers[i].valueType == 'publisher') {
      return true;
    }
  }
  for (let i = 0; i < this.predefinedVars.length; i++) {
    if (this.predefinedVars[i].valueType == 'publisher') {
      return true;
    }
  }
  for (let i = 0; i < this.mappedVars.length; i++) {
    if (this.mappedVars[i].valueType == 'publisher') {
      return true;
    }
  }
  return false;
});

module.exports = {
  PropertySchema,
  Component: mongoose.model('Components', ComponentSchema)
}
