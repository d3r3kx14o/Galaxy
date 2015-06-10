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
<<<<<<< HEAD
    this.layer.peers = [];
    this.layer.asters = [];
    var peer = this.layer.ovariumDetails;
    var aster = new Aster(peer.position, peer.speed, peer.scale * globals.img_radius, peer.property)
    this.layer.asters.push(aster);
    this.layer.quadtree.insert(aster);
    for (var i = 0; i < 10; i ++) {
        peer = {
=======
    this.layer.peers = {};
    for (var i = 0; i < 5; i ++) {
        var peer = {
>>>>>>> origin/master
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
            property: ASTERPROPERTY.NEUTRAL
        };
<<<<<<< HEAD
        aster = new Aster(peer.position, peer.speed, peer.radius * globals.img_radius, peer.property);
        this.layer.asters.push(aster);
        cc.log("New Aster:"+aster.pos.x+"   "+aster.radius);
        this.layer.quadtree.insert(aster);
=======
        this.layer.peers[i] = peer;
>>>>>>> origin/master
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
Connection.prototype.eject = function (ejectedMessage) {
    var recievedMessage = {};
    recievedMessage = {
        id : 100,
        username: "NICE"
    };
    return recievedMessage;
};