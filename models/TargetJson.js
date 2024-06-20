const mongoose = require('mongoose');

const TargetJsonSchema = new mongoose.Schema({
    json: { type: Object, required: true }
});

module.exports = mongoose.model('TargetJson', TargetJsonSchema);
