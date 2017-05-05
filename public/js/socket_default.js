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