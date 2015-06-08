var Connection = Connection || {};

Connection = function (layer, host, port) {
    this.host = host, this.port = port;
    this.layer = layer;
    // TODO for THU-wyw
    // connect to server
};

Connection.prototype.addLayer = function (layer) {
},

// get the latest data from server
Connection.prototype.sync = function () {
    // TODO for THU-wyw
//    this.layer.peers = // position, speed, radius, property (Gang.RED|BULE)
    this.layer.peers = [];
    for (var i = 0; i < 10; i ++) {
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
        this.layer.peers = this.layer.peers.concat(peer);
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