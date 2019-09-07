var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const PropertySchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'validation.required'],
    match: [/^[a-zA-Z_$][a-zA-Z_$0-9]*$/, 'validation.regex'],
    trim: true,
  },
  label: {
    type: String,
    required: [true, 'validation.required'],
    trim: true,
  },
  inputType: {
    type: String,
    required: [true, 'validation.required'],
    enum:  {
      values: ['select', 'text'],
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
  }
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
      values: ['general', 'weather'],
      message: 'validation.option'
    },
    trim: true,
    index: true,
  },
  name: {
    type: String,
    required: [true, 'validation.required'],
    // match: [/^[a-zA-Z_$][a-zA-Z_$0-9]*$/, 'validation.regex'],
    match: [/^[^a-zA-Z_$]|[^\\w$]/, 'validation.regex'],
    index: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'validation.required'],
    trim: true
  },
  functionName: {
    type: String,
    required: [true, 'validation.required'],
    match: [/^[a-zA-Z_$][a-zA-Z_$0-9]*$/, 'validation.regex'],
    /*index: true,
    unique: true, */
    trim: true
  },
  url: {
    type: String,
    required: [true, 'validation.required'],
    /*index: true,
    unique: true,*/
    trim: true
  },
  price: {
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
  }
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

module.exports = {
  PropertySchema,
  Component: mongoose.model('Components', ComponentSchema)
}
