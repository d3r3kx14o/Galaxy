var PeerSprite = cc.Sprite.extend({
    onEnter: function () {
        this._super();
    },
    speed: {
        x: 0,
        y: 0
    },
    getSpeed: function () {
        return this.speed;
    },
    setSpeed: function (speed) {
        this.speed = speed;
    }
});