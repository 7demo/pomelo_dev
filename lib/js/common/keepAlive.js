"undefined" === typeof connect && (connect = {});
(function(c){
	c.messageObservers = {};
	c.isConnecting = false
	c.init = function(ip, port, protocol, callback){
		c.ws = new WebSocket("ws://" + ip + ":" + port, protocol);

		c.ws.onopen = function() {
			console.log('WebSocket connect success!');
			c.isConnecting = true
			callback && callback();
		}

		c.ws.onmessage = function(event){
			var message = JSON.parse(event.data);

			for (var key in c.messageObservers[message.c]) {
				c.messageObservers[message.c][key](message.data);
			}
		}

		c.ws.onclose = function() { c.isConnected = false }		

	}

	c.register = function(command, func){
		if (c.messageObservers[command] == undefined) {
			c.messageObservers[command] = [];
		}
		c.messageObservers[command].push(func);
	}

	c.send = function(msg){
		if (c.ws != undefined && c.isConnecting)
			// console.log(JSON.stringify(msg))
			c.ws.send(JSON.stringify(msg));
	}
})(connect);