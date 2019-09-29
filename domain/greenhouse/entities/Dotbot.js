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


const DotbotPublisherSchema = mongoose.Schema({
  bot: {
    type: String,
    required: [true, 'validation.required'],
    index: true,
    trim: true
  },
  username: {
    type: String,
    required: [true, 'validation.required'],
    trim: true
  },
  subscriptionType: {
    type: String,
    required: [true, 'validation.required'],
    trim: true,
  },
  token: {
    type: String,
    required: [true, 'validation.required'],
    trim: true
  },
});


const RemoteApiSchema = mongoose.Schema({
  id: {
    type: String,
    required: [true, 'validation.required'],
    trim: true
  },
  status: {
    type: String,
    required: [true, 'validation.required'],
    trim: true
  },
  mapped_vars: {
    type: Map,
    of: String
  },
});


const DotbotSchema = mongoose.Schema({
  id: {
    type: String,
    required: [true, 'validation.required'],
    index: true,
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
/*  volley_cost: {
    type: Number,
    min: [0, 'validation.option'],
    max: [9999, 'validation.option'],
    required: [true, 'validation.required'],
    default: 0,
  }, */
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
    of: { type: Map, of: String },
  },
  remote_apis: {
    type: [ RemoteApiSchema ],
  }
});

module.exports = {
  RemoteApi: rhizomeDb.model('greenhouse_remote_api', RemoteApiSchema),
  Dotfunc: rhizomeDb.model('greenhouse_services', DotfuncSchema),
  DotbotPublisher: rhizomeDb.model('greenhouse_bot_publisher', DotbotPublisherSchema),
  Dotbot: rhizomeDb.model('greenhouse_dotbot', DotbotSchema),
}
