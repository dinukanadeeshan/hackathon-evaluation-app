const rest = require('./rest');
const _ = require('lodash');

var all_projects  = {};

global.admins = {
    socket_id: null
}
var judges = {};
var judges_map = {}
var projects = {}
var activeProjectId = 1;


rest.getJudgesData(function(data){
    if(data){

        if(data._id) delete data._id;

        judges_map = data;
        console.log('[main]', 'judges mapping loaded')

    }
});

rest.getProjectsData(function(data){
    if(data){

        if(data._id) delete data._id;

        projects = data;
        console.log('[main]', 'projects loaded')

    }
});

module.exports = {
    saveSocket : function(_id, cb){
        // rest.saveSocket({'socket': _id}, cb)
    },
    getLastProject : function(cb) {
        rest.getProjectState(cb);
    },

    // admins

    hasAdmin: function(){
        return !!global.admins.socket_id;
    },
    setAdmin: function(socket_id){
        global.admins.socket_id = socket_id
    },
    unsetAdmin: function(socket_id){
        global.admins.socket_id = null;
    },
    getAdmins: function(socket_id){
        return global.admins;
    },

    // rest
    getJudges: function(cb){
        cb(judges);
        // console.log('[socket.js] judges');
        // console.log('--------------------');
        // console.log(judges);
    },

    addJudge: function(_socket_id, cb){
        judges[_socket_id] = {'socket_id': _socket_id};
        cb();
    },

    setJudgeName: function(_socket_id, _name){
        judges[_socket_id].name = _name;
    },
    
    unsetJudge: function(socket_id){
        delete judges[socket_id];
    },

    // judges map
    newJudge: function(data, cb){
        judges_map[data.id] = data;
        rest.setJudgesData(judges_map, function(){
            cb();
        });
    },
    
    getJudgesMapping: function(cb){
        cb(judges_map);
    },
    getJudgesMapping_single: function(_id, cb){
        let _judge_info = _.find(judges_map, function(o) { return _.isEqual(o.socket_id, _id); });

        if(_judge_info){
            cb(judges_map[_judge_info.id]);
        } else {
            console.log(_id, 'not found');
            // console.log('----------------');
            // console.log(judges_map);
            // console.log('----------------');
        }

    },
    
    editJudges: function(data, cb){
        judges_map = data;

        rest.setJudgesData(judges_map, function(){
            cb();
        });
        
    },


    newProject: function(data, cb){
        projects[data.id] = data;
        rest.setProjectsData(projects, function(){
            cb();
        });
    },
    
    getProjectsData: function(cb){
        cb(projects);
    },

    editProjects: function(data, cb){
        projects = data;

        rest.setProjectsData(projects, function(){
            cb();
        });
        
    },

    setActiveProject: function(id, cb){
        this.activeProjectId = id;
        cb(projects[id]);
    },
    getActiveProject: function(cb){
        cb(projects[this.activeProjectId]);
    },

    setJudgeScores: function(socket_id, data, cb){
        let judge = _.find(judges_map, function(o) { return _.isEqual(o.socket_id, socket_id) });
        
        // console.log(judge);
        if(!judge) {return;}
        
        let judge_id= judge.id;
        let _project_id = data.project_id;
        let _scores = data.scores;
        let _comments = data.comments;

        if(!projects[_project_id]['scores']) projects[_project_id]['scores'] = {}
        if(!projects[_project_id]['scores'][judge_id]) projects[_project_id]['scores'][judge_id] = {}
        projects[_project_id]['scores'][judge_id].scores = _scores;
        projects[_project_id]['scores'][judge_id].comments= _comments;

        
        rest.setProjectsData(projects, function(){
            cb();
        });
    }
    
}