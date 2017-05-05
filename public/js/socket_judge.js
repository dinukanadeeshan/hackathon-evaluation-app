socket.emit('connection', 'judge');

socket.on('connection_status', function(data){
    console.log(data);
    if(data !== 'success'){
        window.location.replace('/');
    } else {
        socket.emit('get_judge_data');
        socket.on('project_data', function(_project_data){
            console.log('_project_data', _project_data)
        })
        socket.on('judge_data', function(_judge_data){
            console.log('_judge_data', _judge_data)
        })

        var name = localStorage.getItem('judge_name');
        if(name){
            judge_setName(name);
        } else {
            name = prompt('Please enter your name');
            judge_setName(name);
        }
    }
})

function judge_setName(name){
    localStorage.setItem('judge_name', name);
    socket.emit('judge_name', name);
    app.name = name;
}
function judge_sendScores(project_id, scores, comments){
          console.log('judge_sendScores')
    socket.emit('judge_scores', {
        'project_id': project_id,
        'scores': scores,
        'comments': comments,
    });
}