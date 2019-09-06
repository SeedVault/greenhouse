var mongoose = require('mongoose');

const PropertiesSchema = new mongoose.Schema({
  // `socialMediaHandles` is a map whose values are strings. A map's
  // keys are always strings. You specify the type of values using `of`.
  properties: {
    type: Map,
    of: String
  }
});



module.exports = {
  PropertiesSchema,
}
