socket.emit('connection', 'admin');

socket.on('connection_status', function(data){
    console.log(data);
    if(data !== 'success'){
        window.location.replace('/');
    } else {
        socket.emit('get_admin_data');
        socket.on('project_data', function(_project_data){
            console.log('_project_data', _project_data)
            if(!_project_data) return;
            delete _project_data['_id'];
            app.projects = _project_data;
            _projects_count = _.size(app.projects)
        })
        socket.on('judges_data', function(_judges_data){
            console.log('_judges_data', _judges_data)
            if(!_judges_data) return;
            delete _judges_data['_id'];
            app.judges = _judges_data;
        })
        socket.on('judges_mapping_data', function(_judges_data){
            console.log('_judges_mapping_data', _judges_data)

            if(!_judges_data) return;

            delete _judges_data['_id'];
            app.judges_mapping = _judges_data;

            _judges_count = _.size(app.judges_mapping)
        })
    }
})


var _judges_count = 0;
var _projects_count = 0;

function reloadAllClients(){
    socket.emit('refresh');
}

function addJudge(_name, _company, _socket_id){
    _judges_count++;
    socket.emit('new_judge', {'id': _judges_count, 'name': _name, 'company': _company, 'socket_id': _socket_id})
}
function sendJudgeEdits(_judges_mapping_data){
    socket.emit('edit_judge_mapping', _judges_mapping_data);
    
    _judges_count = _.size(app.judges_mapping)
    
}
function socket_kickJudge(_socket_id){
    socket.emit('kick_judge', _socket_id)
}
function socket_reloadJudge(_socket_id){
    socket.emit('reload_judge', _socket_id)
}


function addProject(idea_title, idea_description, student_name, cumulative_marks){
    _projects_count++;
    socket.emit('new_project', {'id': _projects_count, 'idea_title': idea_title, 'idea_description': idea_description,
        'student_name': student_name, 'cumulative_marks': cumulative_marks});
}

function sendProjectEdits(_project_data){
    socket.emit('edit_project_mapping', _project_data);
    
    _projects_count = _.size(app.projects_mapping)
    
}
function sendActiveProject(id){
    socket.emit('set_active_project', id);
}

function clearMarks(projects){
    socket.emit('edit_project_mapping', projects);
}