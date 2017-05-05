var socket = io();

socket.on('status', function(data){
    console.log(data);
})

socket.on('refresh', function(data){
    location.reload();
})
socket.on('kick', function(data){
    window.location.replace('/');
})
socket.on('update_active_project', function(data){
	if(app){
		app.activeProject = data;
	}
})

socket.on('state_updated', function(){
    socket.emit('state_updated_need_info');
})