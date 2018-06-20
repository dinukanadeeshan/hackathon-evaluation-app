socket.emit('connection', 'judge');

socket.on('connection_status', function(data){
    console.log(data);
    if(data !== 'success'){
        window.location.replace('/');
    } else {

        console.log('continuing')
        socket.emit('get_judge_data');
        socket.on('project_data', function(_project_data){
            console.log('_project_data', _project_data)
        })
        socket.on('judge_data', function(_judge_data){
            console.log('_judge_data', _judge_data)
        })

        socket.on('judges_mapping_data', function(_judge_mapping_data){
            console.log('judges_mapping_data', _judge_mapping_data);
            app.judgeDetails = _judge_mapping_data;
            //socket.emit('get_prev_score_for_project', _judge_mapping_data.id);
        });

        // socket.on('judges_prev_score', function(_prev_scores){
        //     console.log('[judges previous scores]', _prev_scores);
        //     app.scores = _prev_scores;
        // });

        var name = localStorage.getItem('judge_name');
        if(name){
            judge_setName(name);
        } else {
            name = prompt('Please enter your name');
            if(name) judge_setName(name);
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