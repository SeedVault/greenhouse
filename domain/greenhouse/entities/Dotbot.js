var mongoose = require('mongoose');

let rhizomeDbName = process.env.RHIZOME_DATABASE;
if (process.env.NODE_ENV === 'test') {
  rhizomeDbName = process.env.RHIZOME_TEST_DATABASE;
}
const rhizomeDb = mongoose.connection.useDb(rhizomeDbName);

const DotServiceSchema = mongoose.Schema({
  ownerName: {
    type: String,
    required: [true, 'validation.required'],
    trim: true
  },
  name: {
    type: String,
    required: [true, 'validation.required'],
    trim: true
  },
  title: {
    type: String,
    required: [true, 'validation.required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'validation.required'],
    trim: true
  },
  url: {
    type: String,
    // required: [true, 'validation.required'],
    trim: true
  },
  method: {
    type: String,
    required: [true, 'validation.required'],
    trim: true
  },
  timeout: {
    type: String,
    required: [true, 'validation.required'],
    trim: true
  },
  function_name: {
    type: String,
    required: [true, 'validation.required'],
    trim: true
  },
  subscriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'validation.required'],
    trim: true,
  },
  subscriptionType: {
    type: String,
    required: [true, 'validation.required'],
    trim: true
  },
  cost: {
    type: Number,
    min: [0, 'validation.option'],
    max: [9999, 'validation.option'],
    required: [true, 'validation.required'],
    default: 0,
    index: true
  },
  headers: {
    type: Map,
    of: String
  },
  predefined_vars: {
    type: Map,
    of: String
  },
  mapped_vars: {
    type: [String]
  }
});


const ServicePropSchema = mongoose.Schema({
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
  headers: {
    type: Map,
    of: String
  },
  predefined_vars: {
    type: Map,
    of: String
  },
  mapped_vars: {
    type: Map,
    of: String
  },
});


const DotbotPublisherSchema = mongoose.Schema({
  subscriptionId: {
    type: String,
    required: [true, 'validation.required'],
    index: true,
    trim: true
  },
  botId: {
    type: String,
    required: [true, 'validation.required'],
    index: true,
    trim: true
  },
  token: {
    type: String,
    required: [true, 'validation.required'],
    trim: true
  },
  publisherName: {
    type: String,
    required: [true, 'validation.required'],
    trim: true
  },
  botName: {
    type: String,
    required: [true, 'validation.required'],
    trim: true
  },
  subscriptionType: {
    type: String,
    required: [true, 'validation.required'],
    trim: true,
  },
  updatedAt: {
    type: Date,
    required: [true, 'validation.required'],
  },
  channels: {
    type: Map,
    of: { type: Map, of: String },
  },
  services: {
    type: [ DotServiceSchema ],
  }
});


const DotbotSchema = mongoose.Schema({
  botId: {
    type: String,
    required: [true, 'validation.required'],
    index: true,
    unique: true,
    trim: true
  },
  ownerName: {
    type: String,
    required: [true, 'validation.required'],
    trim: true,
  },
  name: {
    type: String,
    required: [true, 'validation.required'],
    index: true,
    trim: true
  },
  title: {
    type: String,
    required: [true, 'validation.required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'validation.required'],
    trim: true
  },
  chatbotEngine: {
    type: Map,
    of: String
  },
  pricingModel: {
    type: String,
    required: [true, 'validation.required'],
    enum:  {
      values: ['free', 'perUse', 'perMonth', 'perUse_perMonth'],
      message: 'validation.option'
    },
    trim: true,
    default: 'free'
  },
  perUseCost: {
    type: Number,
    min: [0, 'validation.option'],
    max: [9999, 'validation.option'],
    required: [true, 'validation.required'],
    default: 0,
  },
  perMonthCost: {
    type: Number,
    min: [0, 'validation.option'],
    max: [9999, 'validation.option'],
    required: [true, 'validation.required'],
    default: 0,
  },
  updatedAt: {
    type: Date,
    required: [true, 'validation.required'],
  }
});

module.exports = {
  ServiceProp: rhizomeDb.model('greenhouse_remote_api', ServicePropSchema),
  DotService: rhizomeDb.model('greenhouse_services', DotServiceSchema),
  DotbotPublisher: rhizomeDb.model('greenhouse_publisher_bot', DotbotPublisherSchema),
  Dotbot: rhizomeDb.model('greenhouse_dotbot', DotbotSchema),
}
