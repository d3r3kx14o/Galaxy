

var Aster = function(pos, velocity, radius, property, id, username, quadtreeNode){
    return {
        pos:{
            x : pos.x,
            y : pos.y
        },
        velocity:{
            x: velocity.x,
            y: velocity.y
        },
        radius : radius || 0,
        property : property || ASTERPROPERTY.NEUTRAL,
        id : id || 0,
        username : username || null,
        quadtreeNode : quadtreeNode || null,
        move: Aster.move,
        eject: Aster.eject,
        aabb: Aster.aabb
    }
};

Aster.move = function(){
    this.pos.x += this.velocity.x;
    this.pos.y += this.velocity.y;
}

Aster.eject = function(mass, velocity){
    GPhysics.divide(this, m, velocity);
}

Aster.aabb = function(){
    return GGeometry.Rect(this.pos.x - this.radius, this.pos.y - this.radius, this.radius * 2, this.radius * 2);
}
