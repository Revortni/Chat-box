$(function(){
	var socket=io();
	var username;
	var id;
	var lastsent="";
	if (username === undefined) {
        username = prompt("Enter a username:", "Thanos");
        if(username === null)
        {
        	username="User";
        }
        socket.emit('userConnect', username); //emit username to server
    }
    socket.on('usercount',(data)=>{
    	id=data.id;
    	var msg=document.createElement('li');
		$(msg).addClass('connect');
		$(msg).html("Welcome to Chat Box,"+data.name);
		$('#messages').append(msg);
		var info =msg.cloneNode(true);
		$(info).html(data.count+((data.count==1)?" user is currently connected":" users are currently connected"));
		$('#messages').append(info);
    });

	$('#msg').focus();
	$('form').submit(()=>{
		var message=$('#msg').val();
		socket.emit('chat msg',message);
		var newMsg=document.createElement('li');
		$(newMsg).addClass("sent");
		$(newMsg).html(message);
		$('#messages').append(newMsg);
		$('#msg').val('');
		return false;
	});

	socket.on('chat msg',function(data){
			var sender=document.createElement('li');
			$(sender).html(data.sender);
			var newMsg=document.createElement('li');
			$(newMsg).html(data.msg);
			$(sender).addClass("sender");
			$(newMsg).addClass("recieved");
			if(lastsent!=data.id){
				$('#messages').append(sender);
			}
			$('#messages').append(newMsg);
			lastsent=data.id;
			 // $('#messages').append($('<li>').text(msg));
	});

	socket.on('userConnect',(data)=>{
		lastsent="";
		(document.getElementById("typing")).style.display='none';
		var msg=document.createElement('li');
		$(msg).addClass('connect');
		$(msg).html(data.name+" has joined the chat box");
		$('#messages').append(msg);
		var info =msg.cloneNode(true);
		$(info).html(data.count+((data.count==1)?" user is currently connected":" users are currently connected"));
		$('#messages').append(info);
	});

	socket.on('userDisconnect',(data)=>{

		var msg=document.createElement('li');
		$(msg).addClass('connect');
		$(msg).html(data.name+" has left the chat box");
		$("#messages").append(msg);
		var info = msg.cloneNode(true);
		$(info).html(data.count+((data.count==1)?" user is currently connected":" users are currently connected"));
		$('#messages').append(info);
	});

	socket.on('typing',(props)=>{
		var x = document.getElementById("typing");
		x.style.display=props.show;
		$('#typing').html(props.id+' is typing');
	});

	var timer =null;
	$("#msg").keydown(function(){
		clearTimeout(timer);
		socket.emit("typing",'block');
		timer=setTimeout(send,900);
	});

	function send()
	{
		socket.emit("typing",'none');
	}
});
