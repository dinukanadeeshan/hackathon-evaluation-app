const MongoClient = require('mongodb').MongoClient;
const Config_db = require('../config/database');

var db;
var MONGO_URL = Config_db.connection_url;

module.exports = {
    saveSocket: function (data, cb) {
        MongoClient.connect(MONGO_URL, (err, database) => {
            if (err) return console.log(err)
            db = database;

            db.collection('Sockets').save(data, (err, result) => {
                if (err) return console.log(err)
                cb(result);
            });
        })
    },

    setJudgesData: function (data, cb) {
        MongoClient.connect(MONGO_URL, (err, database) => {
            if (err) return console.log(err)
            db = database;

            data._id = 101;
            db.collection('Judges').save(data, (err, result) => {
                if (err) return console.log(err)
                cb(result);
            });
        })

    },

    getJudgesData: function (cb) {
        MongoClient.connect(MONGO_URL, (err, database) => {
            if (err) return console.log(err)
            db = database;
            db.collection('Judges').findOne({_id:101}, function (err, data) {
                if (err) return console.log(err)
                if(!data){
                    return;
                }

                delete data._id;
                // console.log(data)
                cb(data);
            });
        });

    },

    setProjectsData: function (data, cb) {
        MongoClient.connect(MONGO_URL, (err, database) => {
            if (err) return console.log(err)
            db = database;

            data._id = 101;
            db.collection('Projects').save(data, (err, result) => {
                if (err) return console.log(err)
                cb(result);
            });
        })

    },

    getProjectsData: function (cb) {
        MongoClient.connect(MONGO_URL, (err, database) => {
            if (err) return console.log(err)
            db = database;
            db.collection('Projects').findOne({_id:101}, function (err, data) {
                if (err) return console.log(err)
                if(!data) return;
            
                delete data._id;
                console.log(data)
                cb(data);
            });
        });

    }
};

