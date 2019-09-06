var mongoose = require('mongoose');

const LoginCredentialsSchema = mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    required: [true, 'validation.required'],
    match: [/\S+@\S+\.\S+/, 'validation.email'],
    trim: true
  },
  password: {
    type: String,
    required: [true, 'validation.required'],
    trim: true
  },
});

LoginCredentialsSchema.statics.check = function(credentials) {
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

module.exports = mongoose.model('LoginCredentials', LoginCredentialsSchema);
