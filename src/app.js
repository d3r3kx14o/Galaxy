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

    initLayer: function () {
        this.quadtree = QUAD.init(quadtreeArgs);
        var size = cc.winSize;
        var self = this;
        this.viewCenter = {
            x: size.width / 2,
            y: size.height / 2
        };

//        this.connection = new Connection(this, globals.serverHost, globals.serverPort);
        self.connection = new Connection(self, globals.serverHost, globals.serverPort, next);
        function next() {
            self.renderOvarium();

            self.setupScene();

            self.cacheTextures();

            self.setScale(0.7);
            self.gameStart();
        }
        this.connection.sync();

//        cc.log(this.asters.length);

        this.ovarium = this.asters[0];
        this.ovarium.pos = {
            x: this.viewCenter.x,
            y: this.viewCenter.y
        };
        this.renderOvarium();

        this.setupScene();

        this.cacheTextures();

        this.setScale(0.7);
    },

    initPeerSprites: function () {
        // aster[0] is ovarium
        for (var i = 1; i < this.asters.length; i ++) {
            var p = this.asters[i];
            this.addSprite(p);
        }
    },

    // TODO for Travis
    //  scaling animation
    updatePeers: function () {
        if (this.peerSprites == undefined) return;

        for (var i = 0; i < this.asters.length; i ++) {
            var aster = this.asters[i];
            aster.move();
            aster.quadtreeNode.updateItem(aster);
        }
        for (var i = 0; i < this.peerSprites.length; i ++) {
            var sprite = this.peerSprites[i];
            var speed = sprite.aster.velocity;
            sprite.runAction(cc.MoveBy(1 / globals.frameRate,
                speed.x - this.ovarium.velocity.x,
                speed.y - this.ovarium.velocity.y
            ));

            sprite.setScale(sprite.aster.radius/globals.img_radius);
            // Color

        }
    },

    drawPeers: function () {
    },

    // TODO for Travis
    //  scaling animation
    updateOvarium: function () {
        this.ovarium.move();
        this.ovariumSprite.setScale(this.ovarium.radius / globals.img_radius);
    },

    updateWalls: function () {
        // update walls
        for (var i = 0; i < this.walls.length; i ++) {
            var _wall = this.walls[i];
            _wall.runAction(cc.MoveBy(1 / globals.frameRate,
                - this.ovarium.velocity.x,
                - this.ovarium.velocity.y
            ));
        }
//        cc.log(this.ovarium.velocity.x + ": " + this.ovarium.velocity.x);
    },

    updateBGSparkles: function () {
        var speed = this.ovarium.velocity;
        for (var i = 0; i < this.backgroundSparkles.length; i ++) {
            var sparkle = this.backgroundSparkles[i];
            sparkle.runAction(cc.MoveBy(1 / globals.frameRate,
                - speed.x,
                - speed.y
            ));
        }
//        cc.log("start");
    },

    updateQuadtree: function() {
        for (var i = 0; i < this.asters.length; i++) {
            var aster = this.asters[i];
            aster.quadtreeNode.updateItem(aster);
        }
    },

    // TODO for NyxSpirit
    simulateCollisions: function(){
        this.asterWallCollide();
        this.astersCollide(this.quadtree.root, []);
    },

    asterWallCollide : function() {
        for(var i = 0; i < this.asters.length; i++){
            var aster = this.asters[i];
            var v = aster.velocity;
            if((aster.pos.x - aster.radius) <= 0){
                this.addCollideWithWallsEffect()
            } || (aster.pos.x + aster.radius) >= globals.playground.width) v.x = -v.x;
            if(((aster.pos.y - aster.radius) <= 0) || (aster.pos.y + aster.radius) >= globals.playground.height) v.y = -v.y;
        }
    },

    astersCollide : function (treeNode, itemList) {
        var that = this;
         for (var j = 0; j < treeNode.items.length; j ++)
            for(var i = 0; i < itemList.length; i++){
                var aster1 = itemList[i];
                var aster2 = treeNode.items[j];
                if(GPhysics.checkCollision(aster1, aster2)){
                    GPhysics.collisionResponse(aster1, aster2);
                    if(aster1.radius == 0){
                        this.deleteAster(aster1);
//                        continue;
                    }
                    if(aster2.radius == 0){
                        this.deleteAster(aster2);
//                        continue;
                    }
                    var angle = GGeometry.pToAngle( GGeometry.pSub(aster1.pos, aster2.pos));
                    that.addAbsortionEffect(GGeometry.pLerp(aster1.pos, aster2.pos, aster1.radius/(aster1.radius + aster2.radius)),angle);
                }
            }
         for (var j = 0; j < treeNode.items.length; j ++)
             for(var i = j+1; i < treeNode.items.length; i++){
                 var aster1 = treeNode.items[i];
                 var aster2 = treeNode.items[j];
                 if(GPhysics.checkCollision(aster1, aster2)){
                     GPhysics.collisionResponse(aster1, aster2);
                     if(aster1.radius == 0){
                         this.deleteAster(aster1);
//                         continue;
                     }
                     if(aster2.radius == 0){
                         this.deleteAster(aster2);
//                         continue;
                     }
                     var angle = GGeometry.pToAngle( GGeometry.pSub(aster1.pos, aster2.pos));
                     var scale = aster1.radius/(aster1.radius + aster2.radius);
                     var vec = GGeometry.pLerp(aster1.pos, aster2.pos, 0);
                     that.addAbsortionEffect(vec,angle);
                 }
             }
         itemList = itemList.concat(treeNode.items);
         for(var i = 0; i < treeNode.nodes.length; i++){
             that.astersCollide(treeNode.nodes[i], itemList);
         }
    },
    deleteAster: function(aster, sync){
//        if(aster == null) return ;
        var i = this.asters.indexOf(aster);
//        if(i == -1) return;

        var message = {};
        if(sync == true) {
            message = this.connection.eject();
        }
        aster.quadtreeNode.deleteItem(aster);
        this.asters.splice(i, 1);
    },
    createAster : function(velocity, pos, radius, property, sync){
        var message = {};
        if(sync == true) {
            message = this.connection.eject();
        }
        if(message == null){
        }else{
            var aster = new Aster(pos, velocity, radius, property, message.id, message.username);
        }
        this.asters.push(aster)
        this.quadtree.insert(aster);
        this.addSprite(aster);
    },

    // TODO FOR Nyx_Spirit
    asterDie : function(aster){


    },

//    test: 12324345,
    update: function () {
//        cc.log("asdfasdfs");
//        cc.log(this.test);

        this.updateBGSparkles();
        this.updateWalls();
        this.updatePeers();
        this.updateOvarium();
//        this.updateQuadtree();
        this.simulateCollisions();
    },

    addSprite: function (aster) {

        // TODO for Travis
        // different texture for different gang
        var sprite = new PeerSprite(this.peerTexture);
        sprite.setAster(aster);
        sprite.setScale(aster.radius);
        var position = aster.pos;
        cc.log(position.x + ": " + position.y);
        sprite.attr(position);
        this.addChild(sprite);
        this.peerSprites = this.peerSprites.concat(sprite);
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

        this.ovariumSprite = new cc.Sprite(res.Ovarium_tga);
        this.ovariumSprite.attr(this.viewCenter);
        this.addChild(this.ovariumSprite, 1);

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
            x: coor.x - this.ovarium.pos.x + this.viewCenter.x,
            y: coor.y - this.ovarium.pos.y + this.viewCenter.y
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

    addListeners: function () {
        this.addTouchEventListener();
    },

    addAbsortionEffect: function (position, angle) {
        var absortionHalo = new cc.Sprite(this.ovariumHaloTexture);
        angle = - angle * 180 / Math.PI + 90;

        absortionHalo.setRotation((angle + 360)% 180);
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
                that.ovarium.velocity = {
                    x: that.ovarium.velocity.x - _offset.x * globals.ejectForce,
                    y: that.ovarium.velocity.y - _offset.y * globals.ejectForce
                };
//                cc.log(that.ovarium.velocity.x + ": " + that.ovarium.velocity.x);

                var absortionPosition = {
                    x: _offset.x * that.ovariumDetails.img_radius + that.viewCenter.x,
                    y: _offset.y * that.ovariumDetails.img_radius + that.viewCenter.y
                };
                that.createAster({
                    x: that.ovarium.velocity.x + _offset.x * globals.ejectInitSpeed,
                    y: that.ovarium.velocity.y + _offset.y * globals.ejectInitSpeed
                }, absortionPosition, 0.1, ASTERPROPERTY.NEUTRAL, true);
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
    },

        connection: null,
        ovariumSprite: null,
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
        ovarium: null,
        quadtree:{},
        backgroundSparkles: [],
        walls: [],
        peerSprites: [],
    //    peers: [],
    //    playerPeers: [],
        asters:[],
        viewCenter: {
            x: 0,
            y: 0
        }

});

var StartScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new StartLayer();
        this.addChild(layer);
    }
});
