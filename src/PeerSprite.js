var PeerSprite = cc.Sprite.extend({
    onEnter: function () {
        this._super();
    },
    aster: null,

    setAster: function (aster) {
        this.aster = aster;
    },
    worldSpaceCoor: {
        x: 0,
        y: 0
    },
    getWorldSpaceCoor: function () {
        return this.worldSpaceCoor;
    },
    setWorldSpaceCoor: function (coor) {
        this.worldSpaceCoor = coor;
    }
});