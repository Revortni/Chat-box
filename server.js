var express=require('express');//function handler
var app = express();
var http = require('http').Server(app);
var io=require('socket.io')(http);
app.use(express.static('public'));

//home page routing
app.get('/',(req,res)=>	res.sendFile(__dirname+'/public/index.html'));

var userCount=0;
var userlist={};
io.on('connection',newconnection);

//functions to call on connection
function newconnection(socket){
	
	//when user connects
	socket.on('userConnect', (username) => {
        userlist[socket.id] = username;
        var data = {
            name: username,
            count: userCount,
            id:socket.id,
        };
        socket.emit('usercount',data);
        socket.broadcast.emit('userConnect', data);
        userCount++;
    });
    console.log("Number of after connect:"+userCount);
	
	//when user sends a message
	socket.on('chat msg',function(msg){
		var data={
			msg:msg,
			sender:userlist[socket.id],
			id:socket.id,
		};
		socket.broadcast.emit('chat msg',data);
	});

	//when user starts to type into the input panel
	socket.on("typing",(val)=>{
		var data={
			show:val,// show or hide typing
			id:userlist[socket.id],
		};
		socket.broadcast.emit("typing",data)
	});

	//when user disconnects from server
	socket.on("disconnect",()=>{
		userCount--;
		var data = {
            name: userlist[socket.id],
            count: userCount,
        };
		socket.broadcast.emit('userDisconnect',data);
		console.log("Number of users after disconnect:"+userCount);
	});
}

http.listen(3000,function(){
	console.log('listening on port 3000');
});

