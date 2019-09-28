var mongoose = require('mongoose');

let rhizomeDbName = process.env.RHIZOME_DATABASE;
if (process.env.NODE_ENV === 'testing') {
  rhizomeDbName = process.env.RHIZOME_TEST_DATABASE;
}
const rhizomeDb = mongoose.connection.useDb(rhizomeDbName);

const DotfuncSchema = mongoose.Schema({
  componentId: {
    type: String,
    required: [true, 'validation.required'],
    index: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'validation.required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'validation.required'],
    trim: true,
  },
  function_name: {
    type: String,
    required: [true, 'validation.required'],
    trim: true
  },
  method: {
    type: String,
    required: [true, 'validation.required'],
    trim: true,
    default: 'get'
  },
  timeout: {
    type: String,
    required: [true, 'validation.required'],
    trim: true,
    default: 3
  },
  headers: {
    type: Map,
    of: String
  },
  predefined_vars: {
    type: Map,
    of: String
  },
  /* subscriptionType: {
    type: String,
    required: [true, 'validation.required'],
    trim: true,
  }, */
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
  perUseCost: {
    type: Number,
    min: [0, 'validation.option'],
    max: [9999, 'validation.option'],
    required: [true, 'validation.required'],
    default: 0,
    index: true
  },
  monthlyCost: {
    type: Number,
    min: [0, 'validation.option'],
    max: [9999, 'validation.option'],
    required: [true, 'validation.required'],
    default: 0,
    index: true
  },
});


const DotbotSchema = mongoose.Schema({
  botId: {
    type: String,
    required: [true, 'validation.required'],
    index: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'validation.required'],
    trim: true
  },
  ownerId: {
    type: String,
    required: [true, 'validation.required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'validation.required'],
    trim: true
  },
  status: {
    type: String,
    required: [true, 'validation.required'],
    trim: true,
    default: 'enabled'
  },
  volley_cost: {
    type: Number,
    min: [0, 'validation.option'],
    max: [9999, 'validation.option'],
    required: [true, 'validation.required'],
    default: 0,
  },
  subscriptionType: {
    type: String,
    required: [true, 'validation.required'],
    trim: true,
    default: 'per_use'
  },
  chatbotEngine: {
    type: Map,
    of: String
  },
  channels: {
    type: Map,
    of: String
  },
  remote_apis: {
    type: Map,
    of: String
  }
});

module.exports = {
  Dotfunc: rhizomeDb.model('greenhouse_services', DotfuncSchema),
  Dotbot: rhizomeDb.model('greenhouse_dotbot', DotbotSchema)
}
