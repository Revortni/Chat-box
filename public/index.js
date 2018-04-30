$(function(){
	var socket=io();
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

	socket.on('userConnect',(id)=>{
		var msg=document.createElement('li');
		$(msg).addClass('connect');
		$(msg).html(id+" has joined the chat box.");
		$('#messages').append(msg);
	});

	socket.on('userDisconnect',(id)=>{
		var msg=document.createElement('li');
		$(msg).addClass('connect');
		$(msg).html(id+" has left the chat box.");
		$('#messages').append(msg);
	});

});
