var express=require('express');//function handler
var app = express();
var http = require('http').Server(app);
var socket=require('socket.io');
var io = socket(http);
app.use(express.static('public'));
app.get('/',(req,res)=>	res.sendFile(__dirname+'/public/index.html'));

// io.on('connection',msgHandler);
io.on('connection',newconnection);

function newconnection(socket){
	var user=socket.id;
	socket.broadcast.emit('userConnect',user);
	socket.on('chat msg',function(msg){
		socket.broadcast.emit('chat msg',msg);
	});
	socket.on("typing",(val)=>{
		var props={
			show:val,
			id:user
		};
		socket.broadcast.emit("typing",props)
	});
	socket.on("disconnect",()=>socket.broadcast.emit('userDisconnect',user));
}

http.listen(3000,function(){
	console.log('listening on port 3000');
});