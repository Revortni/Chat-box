$(function(){
	var socket=io();
	var username;
	if (username === undefined) {
        username = prompt("Enter a username:", "Thanos");
        socket.emit('userConnect', username); //emit username to server
    }

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

	socket.on('chat msg',function(msg){
			var newMsg=document.createElement('li');
			$(newMsg).html(msg);
			$(newMsg).addClass("recieved");
			$('#messages').append(newMsg);
			 // $('#messages').append($('<li>').text(msg));
	});

	socket.on('userConnect',(data)=>{
		(document.getElementById("typing")).style.display='none';
		var msg=document.createElement('li');
		$(msg).addClass('connect');
		$(msg).html(data.name+" has joined the chat box");
		$('#messages').append(msg);
		var info =msg.cloneNode(true);
		$(info).html(data.count+" users are currently connected");
		$('#messages').append(info);
	});

	socket.on('userDisconnect',(id)=>{

		var msg=document.createElement('li');
		$(msg).addClass('connect');
		$(msg).html(id+" has left the chat box");
		$('#messages').append(msg);

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
