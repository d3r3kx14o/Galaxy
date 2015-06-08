var StartLayer = cc.Layer.extend({
    ctor: function() {
        this._super();
        this.initLayer();
        this.gameStart();
        return true;
    },

    gameStart: function () {
        this.initPeerSprites();
        this.addListeners();
        this.schedule(this.update, 1 / globals.frameRate);
    },

    addCollideWithWallsEffect: function (direction, x, y) {
        var collisionParticleSystem = new cc.ParticleSystem(res.WallCollisionEffect_plist);
        collisionParticleSystem.setPositionType(cc.ParticleSystem.TYPE_FREE);

        var rotation = 0;
        var offset = null;
        switch (direction) {
        case "up":
            rotation = 270;
            offset = {x: 0, y: -100};
            break;
        case "down":
            rotation = 90;
            offset = {x: 0, y: 100};
            break;
        case "left":
            rotation = 180;
            offset = {x: 100, y: 0};
            break;
        default:
            offset = {x: -100, y: 0};
            break;
        }
        collisionParticleSystem.setRotation(rotation);
        collisionParticleSystem.setScale(0.1);
        collisionParticleSystem.attr({x: x, y: y});
        collisionParticleSystem.runAction(cc.MoveBy(100, offset));
        this.addChild(collisionParticleSystem);
    },

    addEjectionEffect: function (absortionPosition, angle) {
        var radius = this.ovariumDetails.radius;

        var ejectionPSScale = 0.1;
        var ps = new cc.ParticleSystem(res.ParticleTexture_plist);
        ps.setScale(ejectionPSScale * this.ovariumDetails.scale);
        ps.attr({
            sourcePos: cc.p(
                -440 + Math.cos(angle) * radius,
                420 + Math.sin(angle) * radius
                ),
            angle: (angle * 180) / Math.PI
        });
        ps.setPositionType(cc.ParticleSystem.TYPE_FREE);
        this.addChild(ps);
    },

    initPeerSprites: function () {
        for (var i = 0; i < this.peers.length; i ++) {
            var p = this.peers[i];
            this.addPeer(p.speed, p.position, p.radius, p.property, false);
        }
    },

    // TODO for Travis
    updatePeers: function () {
        if (this.peerSprites == undefined) return;
        for (var i = 0; i < this.peerSprites.length; i ++) {
            var sprite = this.peerSprites[i];
            var speed = sprite.getSpeed();
            sprite.runAction(cc.MoveBy(1 / globals.frameRate,
                speed.x - this.ovariumDetails.speed.x,
                speed.y - this.ovariumDetails.speed.y
            ));
        }
    },

    drawPeers: function () {
    },

    updateOvarium: function () {
        this.ovariumDetails.position.x += this.ovariumDetails.speed.x;
        this.ovariumDetails.position.y += this.ovariumDetails.speed.y;
    },

    updateWalls: function () {
        // update walls
        for (var i = 0; i < this.walls.length; i ++) {
            var _wall = this.walls[i];
            _wall.runAction(cc.MoveBy(1 / globals.frameRate,
                - this.ovariumDetails.speed.x,
                - this.ovariumDetails.speed.y
            ));
        }
//        cc.log(this.ovariumDetails.speed.x + ": " + this.ovariumDetails.speed.x);
    },

    updateBGSparkles: function () {
        var speed = this.ovariumDetails.speed;
        for (var i = 0; i < this.backgroundSparkles.length; i ++) {
            var sparkle = this.backgroundSparkles[i];
            sparkle.runAction(cc.MoveBy(1 / globals.frameRate,
                - speed.x,
                - speed.y
            ));
        }
//        cc.log("start");
    },

    // TODO for NyxSpirit
    checkCollisions: function () {
        // null point check
        if (this.peerSprites == undefined) return;

    },

//    test: 12324345,
    update: function () {
//        cc.log("asdfasdfs");
//        cc.log(this.test);

        this.updateBGSparkles();
        this.updateWalls();
        this.updatePeers();
        this.updateOvarium();
        this.checkCollisions();
    },

    connection: null,

    ovarium: null,
    ovariumShell: null,
    ovariumAurora_clock: null,
    ovariumAurora_anticlock: null,
    ovariumNucleus: null,
    ovariumEmergencePS: null,
    ovariumHaloTexture: null,
    peerTexture: null,
    ovariumDetails: {
        radius: 640,
        img_radius: 59.5,
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
    backgroundSparkles: [],
    walls: [],
    peerSprites: [],
    peers: [],
    playerPeers: [],

    viewCenter: {
        x: 0,
        y: 0
    },

    addPeer: function (speed, position, size, gang, sync) {
        if (sync) {
            this.connection.eject();
        }

        // TODO for Travis
        // different texture for different gang
        var sprite = new PeerSprite(this.peerTexture);
        sprite.setScale(size);
        sprite.setSpeed(speed);
//        cc.log(position.x + ": " + position.y);
        sprite.attr(position);
        this.addChild(sprite);
        this.peerSprites = this.peerSprites.concat(sprite);
    },

    initLayer: function () {

        var size = cc.winSize;
        this.viewCenter = {
            x: size.width / 2,
            y: size.height / 2
        };

        this.ovariumDetails.position = {
            x: this.viewCenter.x,
            y: this.viewCenter.y
        };

        this.connection = new Connection(this, globals.serverHost, globals.serverPort);
        this.connection.sync();
        cc.log(this.peers.length);

        this.renderOvarium();

        this.setupScene();

        this.cacheTextures();

        this.setScale(0.7);
    },

    cacheTextures: function () {
        this.ovariumHaloTexture = cc.textureCache.addImage(res.OvariumHalo_png);
        this.peerTexture = cc.textureCache.addImage(res.PeerSmall_tga);
    },

    setupScene: function () {
        this.setupBackground();
        this.setupWalls();
    },

    renderOvarium: function () {
        // Add and render ovarium
        this.ovariumShell = new cc.Sprite(res.OvariumParticleSmall_tga);
        this.ovariumShell.attr(this.viewCenter);
        this.addChild(this.ovariumShell, 1);

        this.ovarium = new cc.Sprite(res.Ovarium_tga);
        this.ovarium.attr(this.viewCenter);
        this.addChild(this.ovarium, 1);

        this.ovariumAurora_clock = new cc.Sprite(res.OvariumAurora_tga);
        this.ovariumAurora_clock.attr(this.viewCenter);
        this.addChild(this.ovariumAurora_clock, 1);
        var spinAction = cc.RepeatForever(
            cc.rotateBy(40, 360));
        this.ovariumAurora_clock.runAction(spinAction);

        this.ovariumAurora_anticlock = new cc.Sprite(res.OvariumAurora_tga);
        this.ovariumAurora_anticlock.attr(this.viewCenter);
        this.addChild(this.ovariumAurora_anticlock, 1);
        var reverseSpinAction = cc.RepeatForever(
            cc.rotateBy(40, - 360));
        this.ovariumAurora_anticlock.runAction(reverseSpinAction);

        this.ovariumNucleus = new cc.Sprite(res.OvariumNucleus_tga);
        this.ovariumNucleus.attr(this.viewCenter);
        var half_period = 3;
        this.ovariumNucleus.runAction(cc.RepeatForever(cc.sequence(
            cc.fadeTo(half_period, 125), cc.fadeTo(half_period, 200)
        )));
        this.ovariumNucleus.runAction(cc.RepeatForever(cc.sequence(
            cc.scaleTo(half_period, 0.8), cc.scaleTo(half_period, 1.3)
        )));
        this.ovariumNucleus.runAction(cc.RepeatForever(cc.sequence(
            cc.tintTo(half_period, 63, 126, 176), cc.tintTo(half_period, 255, 255, 255)
        )));
        this.addChild(this.ovariumNucleus, 1);

        this.ovariumEmergencePS = cc.ParticleSystem(res.EmergenceEffect_plist);
        this.ovariumEmergencePS.setPositionType(cc.ParticleSystem.TYPE_FREE);
        this.ovariumEmergencePS.attr(this.viewCenter);
        this.addChild(this.ovariumEmergencePS, 1);
        this.ovariumEmergencePS.setScale(0.1);
    },

    convertToViewpointSpace: function (coor) {
        return {
            x: coor.x - this.ovariumDetails.position.x + this.viewCenter.x,
            y: coor.y - this.ovariumDetails.position.y + this.viewCenter.y
        }
    },

    generateRandomAnchorPointInWorldSpace: function () {
        return cc.p(Math.random() * globals.playground.width, Math.random() * globals.playground.height);
    },

    generateRandomAnchorPointInViewSpace: function () {
        return this.convertToViewpointSpace(this.generateRandomAnchorPointInWorldSpace());
    },

    // add background sparkles
    setupBackground: function () {
        var sparkleTexture = cc.textureCache.addImage(res.BlobSparkles_tga);
        this.backgroundSparkles = [];
        for (var i = 0; i < 100; i ++) {
            var array = [];
            for (var j = 0; j < 5; j ++) array = array.concat(this.generateRandomAnchorPointInViewSpace());

            // shift action
            var action = cc.cardinalSplineBy(500, array, 0);
            var reverse = action.reverse();
            var sparkle = new cc.Sprite(sparkleTexture);
            var seq = cc.sequence(action, reverse);

            // scaling action
            var initScale = Math.max(Math.random() * 1.2, 0.5);
            sparkle.setScale(initScale);
            var scaleAction = cc.scaleBy(300, 0.9);
            var scaleBackAction = scaleAction.reverse();
            var seq1 = cc.sequence(scaleAction, scaleBackAction);

            // spin action
            var rotation = cc.rotateBy(100, 250 * (Math.random() + 0.1));
            if (Math.random() > 0.5) rotation = rotation.reverse();

            sparkle.runAction(cc.RepeatForever(rotation));
            sparkle.runAction(cc.RepeatForever(seq));
            sparkle.runAction(cc.RepeatForever(seq1));
            this.addChild(sparkle);
            this.backgroundSparkles = this.backgroundSparkles.concat(sparkle);
        }
    },
    setupWalls: function () {
        var wallTexture = cc.textureCache.addImage(res.WallPiece_tga);
        var wallPieceCorner = cc.textureCache.addImage(res.WallPieceCorner_tga);
        var scales = [
            // up, down, left, right
            globals.playground.width,
            globals.playground.width,
            globals.playground.height,
            globals.playground.height
        ]; // [x, y]
        var rotations = [90, 270, 0, 180, 90, 180, 270, 0];
        var locations = [
            // up, down, left, right
            {
                x: globals.playground.width / 2,
                y: globals.playground.height + globals.wallThickness / 2
            }, {
                x: globals.playground.width / 2,
                y: - globals.wallThickness / 2
            }, {
                x: - globals.wallThickness / 2,
                y: globals.playground.height / 2
            }, {
                x: globals.wallThickness / 2 + globals.playground.width,
                y: globals.playground.height / 2
            },
            // up-left, up-right, down-right, down-left
            {
                x: - globals.wallThickness / 2,
                y: globals.playground.height + globals.wallThickness / 2
            }, {
                x: globals.wallThickness / 2 + globals.playground.width,
                y: globals.playground.height + globals.wallThickness / 2
            }, {
                x: globals.wallThickness / 2 + globals.playground.width,
                y: - globals.wallThickness / 2
            }, {
                x: - globals.wallThickness / 2,
                y: - globals.wallThickness / 2
            }
        ];
        for (var i = 0; i < 8; i ++) {
            var wall = null;
            var s = globals.wallThickness / 128;
            if (i < 4) {
                wall = cc.Sprite(wallTexture);
                wall.setScaleX(s);
                wall.setScaleY(scales[i] / 128);
            } else {
                wall = cc.Sprite(wallPieceCorner);
                wall.setScale(s, s);
            }
            wall.setRotation(rotations[i]);
            wall.attr(locations[i]);
            this.addChild(wall);
            this.walls = this.walls.concat(wall);
        }
    },

    addListeners: function () {
        this.addTouchEventListener();
    },

    addAbsortionEffect: function (position, angle) {
        var absortionHalo = new cc.Sprite(this.ovariumHaloTexture);
        absortionHalo.setRotation(- angle * 180 / Math.PI + 90);
        absortionHalo.setScale(this.ovariumDetails.scale * 0.5);
        absortionHalo.attr(position);
        absortionHalo.runAction(cc.fadeOut(2));
        this.addChild(absortionHalo, 2);
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
//                cc.log(that.ovariumDetails.speed.x + ": " + that.ovariumDetails.speed.x);

                var absortionPosition = {
                    x: _offset.x * that.ovariumDetails.img_radius + that.viewCenter.x,
                    y: _offset.y * that.ovariumDetails.img_radius + that.viewCenter.y
                };

                that.addPeer({
                    x: that.ovariumDetails.speed.x + _offset.x * globals.ejectInitSpeed,
                    y: that.ovariumDetails.speed.y + _offset.y * globals.ejectInitSpeed
                }, absortionPosition, 0.1, Gang.NEUTRAL, true);
                that.addEjectionEffect(absortionPosition, eject_angle);

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
//                cc.log("keyCode" + keyCode);
            },
            onKeyReleased: function(keyCode, event){
//                cc.log("keyCode" + keyCode);
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
