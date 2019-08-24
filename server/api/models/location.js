const mongoose = require('mongoose');

const locationSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    lat : {type : Number },
    long : {type : Number},
    speed : {type : Number},
    cnum : {type : Number},
    from : {type : String},
    to : {type : String}
})

module.exports = mongoose.model('location',locationSchema);