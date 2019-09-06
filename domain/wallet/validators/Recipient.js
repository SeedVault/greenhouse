var mongoose = require('mongoose');

const RecipientSchema = mongoose.Schema({
  to: {
    type: String,
    required: [true, 'validation.required'],
    trim: true
  },
  amount: {
    type: Number,
    match: [/^[0-9\\.]+$/, 'validation.regex'],
    required: [true, 'validation.required'],
    min: [0, 'validation.greater_than_zero'],
    trim: true,
    /*validate : {
      validator : Number.isInteger,
      message   : '{VALUE} is not an integer value'
    }*/
  },
});

RecipientSchema.statics.check = function(credentials) {
	return new Promise((res, rej) => {
		const pObj = new this(credentials);
		pObj.validate(err => {
			if (err) {
				return rej(err);
			} else
				return res('success');
		});
	});
}

module.exports = mongoose.model('Recipient', RecipientSchema);
