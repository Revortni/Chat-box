var express=require('express');//function handler
var app = express();
var http = require('http').Server(app);
var io=require('socket.io')(http);
app.use(express.static('public'));

//home page routing
app.get('/',(req,res)=>	res.sendFile(__dirname+'/public/index.html'));

var userCount=0;

io.on('connection',newconnection);

//functions to call on connection
function newconnection(socket){
	var user=socket.id;
	userCount++;

	console.log("Number of users connected:"+userCount);
	//when user connects
	socket.broadcast.emit('userConnect',user);

	//when user sends a message
	socket.on('chat msg',function(msg){
		socket.broadcast.emit('chat msg',msg);
	});

	//when user starts to type into the input panel
	socket.on("typing",(val)=>{
		var props={
			show:val,// show or hide typing
			id:user
		};
		socket.broadcast.emit("typing",props)
	});

	//when user disconnects from server
	socket.on("disconnect",()=>{
		socket.broadcast.emit('userDisconnect',user);
		userCount--;
		console.log("Number of users connected:"+userCount);
	});
}

http.listen(3000,function(){
	console.log('listening on port 3000');
});

