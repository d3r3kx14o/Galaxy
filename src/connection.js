var Connection = Connection || {};

Connection = function (layer, host, port, next) {
    var self = this;
    this.host = host, this.port = port;
    this.layer = layer;
    this.pomelo = window.pomelo;
    var route = 'gate.gateHandler.queryEntry'
    pomelo.init({
        host: host,
        port: port,
        log: true
    }, function() {
        self.pomelo.request(route, { }, function(data) {
            self.startConnectorSession(data.host, data.port, next);
        })
    })
};

Connection.prototype.startConnectorSession = function(host, port, next) {
    var self = this;
    var pomelo = window.pomelo;
    var route = 'connector.entryHandler.entry';
    pomelo.init({
        host: host,
        port: port,
        log: true
    }, function() {
        pomelo.request(route, {
        }, function(data) {
            console.log(data);
            pomelo.request('gameHall.playerHandler.addToGame', { }, function(data) {
                self.layer.peers = {};
                for (var i in data) {
                    self.layer.peers[data[i].entityId] = data[i];
                }
            console.log(self.layer.peers);
            next();
            })
        });
    });
};

Connection.prototype.addLayer = function (layer) {
},

// get the latest data from server
Connection.prototype.sync = function () {
    // TODO for THU-wyw
//    this.layer.peers = // position, speed, radius, property (Gang.RED|BULE)
    this.layer.peers = {};
    for (var i = 0; i < 5; i ++) {
        var peer = {
            position: {
                x: Math.random() * globals.playground.width,
                y: Math.random() * globals.playground.height
            },
            speed: {
                x: Math.random() * 3,
                y: Math.random() * 3
            },
            // recommend init value of radius to be 0~1
            radius: Math.random(),
            property: Gang.NEUTRAL
        };
        this.layer.peers[i] = peer;
    }
//    this.layer.playerPeers =
    // TODO for THU-wyw
//    this.layer.ovariumDetails = // lookup detailed structure in StartLayer.ovariumDetails

    // on completion of sync, call the following method
};

// TODO for THU-wyw
Connection.prototype.addListeners = function () {

};

// TODO for THU-wyw
// Called when local ejection event is evoked
// Maybe the whole list of peer should be updated
Connection.prototype.eject = function () {
};