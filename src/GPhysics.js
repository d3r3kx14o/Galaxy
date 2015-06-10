GPhysics = {};

GPhysics.Sphere = function(pos, velocity, radius){
    this.pos.x = this.pos.x;
    this.pos.y = this.pos.y;
    this.radius = radius || 0;
    this.velocity = velocity || 0;

};

GGeometry.sphere = function(pos, velocity, radius) {
    if (pos == null || velocity == null)
        return null;
    return {
        pos : {
            x : pos.x,
            y : pos.y
        },
        velocity:{
            x : velocity.x,
            y : velocity.y
        },
        radius : radius,
    }
};

GPhysics.volumn = function(sphere) {
    return sphere.radius * sphere.radius * sphere.radius;
};

GPhysics.collisionResponse = function(sphere1, sphere2){
    if (sphere1.radius == sphere2.radius){
        this.perfectElasticCollision(sphere1, sphere2);
    }else{
        if((sphere1.property == ASTERPROPERTY.YIN && sphere2.property == ASTERPROPERTY.YANG) ||
            (sphere2.property == ASTERPROPERTY.YIN && sphere1.property == ASTERPROPERTY.YANG)){
                if(sphere1.radius < sphere2.radius){
                    var v = this.volumn(sphere2) - this.volumn(sphere1);
                    var d = GGeometry.pDistance(sphere1.pos, sphere2.pos);
                    if (d == 0) return ;
                    var x1 = (d * d - v)/2 / d;
                    if(x1 < GGeometry.POINT_EPSILON){
                        x1 = 0;
                    }
                    this.annihilation(sphere2, Math.pow(sphere1.radius, 3) - Math.pow(x1, 3), sphere1.velocity);
                    sphere1.radius = x1;
                }else{
                    var v = this.volumn(sphere1) - this.volumn(sphere2);
                    var d = GGeometry.pDistance(sphere1.pos, sphere2.pos);
                    if (d == 0) return ;
                    var x1 = (d * d - v)/2 / d;
                    if(x1 < 0){
                        x1 = 0;
                    }
                    this.annihilation(sphere1, Math.pow(sphere2.radius, 3) - Math.pow(x1, 3), sphere2.velocity);
                    sphere2.radius = x1;
                }


        }else{
            var v = this.volumn(sphere1) + this.volumn(sphere2);
            var d = GGeometry.pDistance(sphere1.pos, sphere2.pos);
            if (d == 0) return ;
            var x1;
            if(sphere1.radius < sphere2.radius){
                if(sphere2.radius + sphere1.radius * 2 < d){
                    x1 = 0;
                }else{
                    x1 = (3 * d * d - Math.sqrt(12 * d * v - 3 * d * d * d * d)) / (6 * d);
                }
                if(x1 < GGeometry.POINT_EPSILON) x1 = 0;
                this.inelasticCollision(sphere2, Math.pow(sphere1.radius, 3) - Math.pow(x1, 3), sphere1.velocity);
                sphere1.radius = x1;
            }else{
                if(sphere1.radius + sphere2.radius * 2 < d){
                    x1 = 0;
                }else{
                    x1 = (3 * d * d - Math.sqrt(12 * d * v - 3 * d * d * d * d)) / (6 * d);
                }
                if(x1 < GGeometry.POINT_EPSILON) x1 = 0;
                this.inelasticCollision(sphere1, Math.pow(sphere2.radius, 3) - Math.pow(x1, 3), sphere2.velocity);
                sphere2.radius = x1;
            }
        }

    }
}

GPhysics.perfectElasticCollision = function(sphere1, sphere2){
    var xdir = GGeometry.pSub(sphere1, sphere2);
    var ydir = GGeometry.pPerp(xdir);
    var px1 = GGeometry.pProject(sphere1.velocity, xdir);
    var px2 = GGeometry.pProject(sphere2.velocity, xdir);
    var py1 = GGeometry.pProject(sphere1.velocity, ydir);
    var py2 = GGeometry.pProject(sphere2.velocity, ydir);
    sphere1.velocity = GGeometry.pAdd(px2, py1);
    sphere2.velocity = GGeometry.pAdd(px1, py2);
}
/*
 * sphere absorb substance with velocity
 */
GPhysics.inelasticCollision = function(sphere, mass, velocity){
    var v = this.volumn(sphere);
    sphere.radius = Math.cbrt(v + mass);
    sphere.velocity = GGeometry.pMult(GGeometry.pAdd(GGeometry.pMult(sphere.velocity, v),GGeometry.pMult(velocity, mass)), 1/(v+mass));

}

GPhysics.divide = function(sphere, mass, velocity) {
    var v = this.volumn(sphere);
    sphere.radius = Math.cbrt(v - mass);
    sphere.velocity = GGeometry.pMult(GGeometry.pSub(GGeometry.pMult(sphere.velocity, v),GGeometry.pMult(velocity, mass)), 1/(v-mass));
}

GPhysics.checkCollision = function(sphere1, sphere2){
    var dis = GGeometry.pDistance(sphere1.pos, sphere2.pos);

    if(dis > sphere1.radius + sphere2.radius - this.COLLISIONRANGE)
        return false;
    else {
        cc.log("collide: " + dis + " (" + sphere1.radius + " + " + sphere2.radius + ") ");
        return true;
    }
}
GPhysics.COLLISIONRANGE = 1;
GPhysics.annihilation = function(sphere, mass, velocity){
    var v = this.volumn(sphere);
    sphere.radius = Math.cbrt(v - mass);
    sphere.velocity = GGeometry.pMult(GGeometry.pAdd(GGeometry.pMult(sphere.velocity, v),GGeometry.pMult(velocity, mass)), 1/(v+mass));
}