// var socket = io("https://chiefsmurph.com/", {
// 	transports:['websocket'],
// 	path: '/phonechat/socket.io',
// });

var socket = io("http://localhost:8000/", {
	transports:['websocket'],
	path: '/socket.io',
});


socket.on('welcome', function(data){
	console.log('welcome', { data });
	const { id, presenters = [] } = data;
	app.id = id;
	app.presenters = presenters;
	presenters.forEach(presenterId => {
		console.log('starting', presenterId);
		app.streamer.start(presenterId);
	});
	app.debug("Connected to the server!");
});

// Handle BufferHeader request/response
socket.on('bufferHeader', function(data){
	app.debug("Buffer header ("+data.type+") by", data.fromID);

	// Is request from Streamer?
	if(data.type === 'request')
		presenter.requestBufferHeader(data.fromID);

	// Is response from Presenter?
	else if(data.type === 'received')
		streamer.setBufferHeader(data.fromID, data.packet);
});

// Handle buffer stream from the presenter to streaming instance
socket.on('bufferStream', function(data){
	// From = data.presenterID
	streamer.receiveBuffer(data.presenterID, data.packet);
});

// Handle disconnected streamer
socket.on('streamerGone', function(id){
	var i = app.presenter.listener.indexOf(id);
	if(i !== -1){
		app.presenter.listener.splice(i, 1);
		app.debug("Listener with ID:", id, "was removed");
	}
});

socket.on('newPresenter', presenterId => {
	console.log('received a new presenter', presenterId);
	app.streamer.start(presenterId);
});

// Handle disconnected presenter
socket.on('presenterGone', function(id){
	if(app.streamer.listening[id] !== undefined){
		sf.Obj.delete(app.streamer.listening, id);
		app.debug("Listener with ID:", id, "was removed");
	}
});