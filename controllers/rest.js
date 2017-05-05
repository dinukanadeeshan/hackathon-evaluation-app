const MongoClient = require('mongodb').MongoClient;
const Config_db = require('../config/database');

var db;
var MONGO_COLLECTION_NAME = Config_db.collection_name;
var MONGO_URL = Config_db.connection_url;

module.exports = {
    saveData: function (data, cb) {
        MongoClient.connect(MONGO_URL, (err, database) => {
            if (err) return console.log(err)
            db = database;

            db.collection(MONGO_COLLECTION_NAME).save(data, (err, result) => {
                if (err) return console.log(err)
                cb(result);
            });
        })
    },

    getData: function (cb) {
        MongoClient.connect(MONGO_URL, (err, database) => {
            if (err) return console.log(err)
            db = database;
            db.collection(MONGO_COLLECTION_NAME).find({}).toArray(function (err, data) {
                if (err) return console.log(err)
                cb(data);
            });
        });

    }
};

