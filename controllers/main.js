const rest = require('./rest');

module.exports = {
    saveSocket : function(_id, cb){
        rest.saveData({'socket': _id}, cb)
    }
}