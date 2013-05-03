define(function(require) {
    var lastId = 0;
    var callbacks = {};
    var messageQueue = [];
    var socket = null;

    function start() {
        var params = {};

        var search = window.location.search.substring(1);
        var splitted_search = search.split("&");
        for (var i = 0; i < splitted_search.length; i++) {
            var splitted_param = splitted_search[i].split("=");
            params[splitted_param[0]] = splitted_param[1];
        }

        socket = new WebSocket("ws://localhost:" + params.port);

        socket.onopen = function() {
            socket.send(JSON.stringify({"method": "authenticate",
                                        "id": "authenticate",
                                        "params": [params.key]}));

            while (messageQueue.length > 0) {
                socket.send(messageQueue.pop());
            }
        };

        socket.onmessage = function(message) {
            var parsed = JSON.parse(message.data);
            var responseId = parsed.id;
            if (responseId in callbacks) {
                callbacks[responseId](parsed.result);
                delete callbacks[responseId];
            } 
        };
    }

    var Bus = {};

    Bus.sendMessage = function(method, params, callback) {
        if (socket === null) {
            start();
        }

        message = {"method": method,
                   "id": lastId,
                   "params": params};

        callbacks[lastId] = callback;

        var stringMessage = JSON.stringify(message);

        if (socket.readyState == WebSocket.OPEN) {
            socket.send(stringMessage);
        } else {
            messageQueue.push(stringMessage);
        }

        lastId++;
    };

    return Bus;
});
