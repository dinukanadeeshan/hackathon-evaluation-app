const controller = require('./main');

module.exports = function(http){
    var io = require('socket.io')(http);

    io.on('connection', function(socket){
        console.log('[socket.js] a user connected');
        // controller.saveSocket({'socket': socket.id}, function(result){
        //     console.log('[socket.js] data saved')
        // })


        socket.on('connection', function(connection_type){
            console.log('[socket.js]', 'connection_type', connection_type);

        // █████╗ ██████╗ ███╗   ███╗██╗███╗   ██╗
        // ██╔══██╗██╔══██╗████╗ ████║██║████╗  ██║
        // ███████║██║  ██║██╔████╔██║██║██╔██╗ ██║
        // ██╔══██║██║  ██║██║╚██╔╝██║██║██║╚██╗██║
        // ██║  ██║██████╔╝██║ ╚═╝ ██║██║██║ ╚████║
        // ╚═╝  ╚═╝╚═════╝ ╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝
                                                

            if(connection_type == 'admin'){
                if(!controller.hasAdmin()){
                    controller.setAdmin(socket.id);
                    socket.emit('status', 'connection success')
                    socket.emit('connection_status', 'success')
                    console.log('[socket.js] admins');
                    console.log('--------------------');
                    console.log(controller.getAdmins());
                } else {
                    socket.emit('status', 'connection failed.. admin already exists')
                    socket.emit('connection_status', 'failure')
                    console.log('[socket.js] admin already exists');

                }
                

                socket.on('get_admin_data', function(){
                    controller.getProjectsData(function(data){
                        socket.emit('project_data', data);
                    })
                    controller.getJudges(function(data){
                        socket.emit('judges_data', data);
                    })
                    controller.getJudgesMapping(function(data){
                        socket.emit('judges_mapping_data', data);
                    })
                });

                socket.on('state_updated_need_info', function(){
                    controller.getProjectsData(function(data){
                        socket.emit('project_data', data);
                    })
                    controller.getJudges(function(data){
                        socket.emit('judges_data', data);
                    })
                    controller.getJudgesMapping(function(data){
                        socket.emit('judges_mapping_data', data);
                    })
                });

                socket.on('refresh', function(){
                    socket.broadcast.emit('refresh');
                });

                socket.on('reload_judge', function(id){
                    console.log('[reload_judge]', id)
                    socket.to(id).emit('refresh');
                });

                socket.on('new_judge', function(data){
                    controller.newJudge(data, function(){
                        socket.emit('state_updated');
                    });
                });
                socket.on('new_project', function(data){
                    controller.newProject(data, function(){
                        socket.emit('state_updated');
                    });
                });

                socket.on('edit_judge_mapping', function(data){
                    controller.editJudges(data, function(){
                        io.emit('state_updated');
                    });
                });
                socket.on('edit_project_mapping', function(data){
                    controller.editProjects(data, function(){
                        io.emit('state_updated');
                    });

                });
                socket.on('set_active_project', function(id){
                    controller.setActiveProject(id, function(active_project_data){
                        io.emit('update_active_project', active_project_data);
                    });
                });

                socket.on('kick_judge', function(kick_socket_id){
                    socket.to(kick_socket_id).emit('kick');
                });

                socket.on('disconnect', function(){
                    controller.unsetAdmin()
                    console.log('[socket.js] admins');
                    console.log('--------------------');
                    console.log(controller.getAdmins());
                });

            }

            //      ██╗██╗   ██╗██████╗  ██████╗ ███████╗
            //      ██║██║   ██║██╔══██╗██╔════╝ ██╔════╝
            //      ██║██║   ██║██║  ██║██║  ███╗█████╗  
            // ██   ██║██║   ██║██║  ██║██║   ██║██╔══╝  
            // ╚█████╔╝╚██████╔╝██████╔╝╚██████╔╝███████╗
            //  ╚════╝  ╚═════╝ ╚═════╝  ╚═════╝ ╚══════╝
                                          
            if(connection_type == 'judge'){

                controller.addJudge(socket.id, function(){
                    io.emit('state_updated');
                    socket.emit('connection_status', 'success');
                });
                
                
                socket.on('get_judge_data', function(){
                    controller.getActiveProject(function(active_project_data){
                        io.emit('update_active_project', active_project_data);
                    });
                    controller.getJudges(function(data){
                        socket.emit('judge_data', data);
                    })
                    controller.getJudgesMapping_single(socket.id, function(data){
                        console.log(data);
                        socket.to(data[socket_id]).emit('judges_mapping_data', data);
                    })
                });

                socket.on('judge_name', function(_name){
                    controller.setJudgeName(socket.id, _name);
                    io.emit('state_updated');
                    
                });

                socket.on('judge_scores', function(data){
                    controller.setJudgeScores(socket.id, data, function(){
                        io.emit('state_updated');
                        
                    });
                    
                });


                socket.on('state_updated_need_info', function(){
                    controller.getActiveProject(function(active_project_data){
                        io.emit('update_active_project', active_project_data);
                    });
                    controller.getJudges(function(data){
                        socket.emit('judge_data', data);
                    })
                    controller.getJudgesMapping_single(socket.id, function(_data){
                        console.log(_data);
                        socket.emit('judges_mapping_data', _data);
                    })
                })

                socket.on('disconnect', function(){
                    controller.unsetJudge(socket.id)
                    console.log('[socket.js] judge went offline');
                    io.emit('state_updated');
                });
            }
        })
    });

    console.log('socket connection started');
};
