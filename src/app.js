var StartLayer = cc.Layer.extend({
    ctor: function() {
        this._super();
//        cc.log(Math.random());

        this.initLayer();

        // TODO
        // info of peers should download from server
        this.initPeers();

        this.addListeners();
        this.schedule(this.update, 1 / globals.frameRate);

        return true;
    },

    update: function () {
        if (this.peers == undefined) return;



        for (var i = 0; i < this.peers.length; i ++) {
            var sprite = this.peers[i];
            var speed = sprite.getSpeed();
            sprite.runAction(cc.MoveBy(1 / globals.frameRate,
                speed.x - this.ovariumDetails.speed.x,
                speed.y - this.ovariumDetails.speed.y
            ));
        }
    },

    ovarium: null,
    ovariumShell: null,
    ovariumDetails: {
        radius: 640,
        visionRange: 100,
        speed: {
            x: 0,
            y: 0
        },
        position: {
            x: 0,
            y: 0
        },
        scale: 1,
    },
    peers: [],
    ejectionParticleSystemTexture: null,

    viewCenter: {
        x: 0,
        y: 0
    },

    // For debug use
    initPeers: function () {
        var initCap = 10;
        this.peers = [];
        for (var i = 0; i < initCap; i ++) {
            this.addPeer({
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2
            }, {
                x: this.ovariumDetails.position.x + (Math.random() - 0.5) * 500,
                y: this.ovariumDetails.position.y + (Math.random() - 0.5) * 500
            }, Math.random());
        }
        this.addPeer({
            x: 0,
            y: 0
        }, {
            x: this.ovariumDetails.position.x - 100,
            y: this.ovariumDetails.position.y - 100
        }, 1);
        this.addPeer({
            x: 0,
            y: 0
        }, {
            x: this.ovariumDetails.position.x - 100,
            y: this.ovariumDetails.position.y + 100
        }, 1);
        this.addPeer({
            x: 0,
            y: 0
        }, {
            x: this.ovariumDetails.position.x + 100,
            y: this.ovariumDetails.position.y - 100
        }, 1);
        this.addPeer({
            x: 0,
            y: 0
        }, {
            x: this.ovariumDetails.position.x + 100,
            y: this.ovariumDetails.position.y + 100
        }, 1);
    },

    addPeer: function (speed, position, size) {
        var sprite = new PeerSprite(res.PeerSmall_tga);
        sprite.setScale(size);
        sprite.setSpeed(speed);
        cc.log(position.x + ": " + position.y);
        sprite.attr(position);
        this.addChild(sprite);
        this.peers = this.peers.concat(sprite);
    },

    initLayer: function () {
        var size = cc.winSize;
        this.viewCenter = {
            x: size.width / 2,
            y: size.height / 2
        };

        // Add and render ovarium

        this.ovariumShell = new cc.Sprite(res.OvariumParticleSmall_tga);
        this.ovariumShell.attr(this.viewCenter);
        this.addChild(this.ovariumShell, 1);

        this.ovarium = new cc.Sprite(res.Ovarium_tga);
        this.ovarium.attr(this.viewCenter);
        var spinAction = cc.RepeatForever(
            cc.rotateBy(20, 360));
        this.ovarium.runAction(spinAction);
        this.addChild(this.ovarium, 1);
        this.setupScene();
    },

    setupScene: function () {

    },

    addListeners: function () {
        this.addTouchEventListener();
    },

    addTouchEventListener: function () {
        var that = this;
        var touchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var pos = touch.getLocation();

                var eject_angle = Math.atan2(pos.y - that.viewCenter.y, pos.x - that.viewCenter.x);
                var _offset = {
                    x: Math.cos(eject_angle),
                    y: Math.sin(eject_angle)
                };
                // update ovarium speed
                that.ovariumDetails.speed = {
                    x: that.ovariumDetails.speed.x - _offset.x * globals.ejectForce,
                    y: that.ovariumDetails.speed.y - _offset.y * globals.ejectForce
                };
                var ejectionPSScale = 0.1;
                var ps = new cc.ParticleSystem(res.ParticleTexture_plist);
                ps.setScale(ejectionPSScale * that.ovariumDetails.scale);
                ps.attr({
                    sourcePos: cc.p(
                        -440 + _offset.x * that.ovariumDetails.radius,
                        420 + _offset.y * that.ovariumDetails.radius
                        ),
                    angle: (eject_angle * 180) / Math.PI
                });
                ps.setPositionType(cc.ParticleSystem.TYPE_FREE);
                that.addChild(ps);

                that.addPeer({
                    x: that.ovariumDetails.speed.x + _offset.x * globals.ejectInitSpeed,
                    y: that.ovariumDetails.speed.y + _offset.y * globals.ejectInitSpeed
                }, {
                    x: _offset.x * that.ovariumDetails.radius + that.viewCenter.x,
                    y: _offset.y * that.ovariumDetails.radius + that.viewCenter.y
                }, 0.1);
                var p = ps.getSourcePosition();
//                cc.log(p.x + ": " + p.y);

                return true;
            }
        });
        cc.eventManager.addListener(touchListener, this);
    },
    addKeyboardEventListener: function () {
        var that = this;
        var keydownListener = cc.EventListener.create({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed:  function(keyCode, event){
                cc.log("keyCode" + keyCode);
            },
            onKeyReleased: function(keyCode, event){
                cc.log("keyCode" + keyCode);
            }
        });
    }
});

var StartScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new StartLayer();
        this.addChild(layer);
    }
});
