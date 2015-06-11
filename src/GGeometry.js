var GGeometry = {};
/**
 * smallest such that 1.0+FLT_EPSILON != 1.0
 * @constant
 * @type Number
 */
GGeometry.POINT_EPSILON = parseFloat('1.192092896e-07F');

/**
 * Returns opposite of point.
 * @param {GGeometry.Point} point
 * @return {GGeometry.Point}
 */
GGeometry.pNeg = function (point) {
    return GGeometry.p(-point.x, -point.y);
};

/**
 * Calculates sum of two points.
 * @param {GGeometry.Point} v1
 * @param {GGeometry.Point} v2
 * @return {GGeometry.Point}
 */
GGeometry.pAdd = function (v1, v2) {
    return GGeometry.p(v1.x + v2.x, v1.y + v2.y);
};

/**
 * Calculates difference of two points.
 * @param {GGeometry.Point} v1
 * @param {GGeometry.Point} v2
 * @return {GGeometry.Point}
 */
GGeometry.pSub = function (v1, v2) {
    return GGeometry.p(v1.x - v2.x, v1.y - v2.y);
};

/**
 * Returns point multiplied by given factor.
 * @param {GGeometry.Point} point
 * @param {Number} floatVar
 * @return {GGeometry.Point}
 */
GGeometry.pMult = function (point, floatVar) {
    return GGeometry.p(point.x * floatVar, point.y * floatVar);
};

/**
 * Calculates midpoint between two points.
 * @param {GGeometry.Point} v1
 * @param {GGeometry.Point} v2
 * @return {GGeometry.pMult}
 */
GGeometry.pMidpoint = function (v1, v2) {
    return GGeometry.pMult(GGeometry.pAdd(v1, v2), 0.5);
};

/**
 * Calculates dot product of two points.
 * @param {GGeometry.Point} v1
 * @param {GGeometry.Point} v2
 * @return {Number}
 */
GGeometry.pDot = function (v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
};

/**
 * Calculates cross product of two points.
 * @param {GGeometry.Point} v1
 * @param {GGeometry.Point} v2
 * @return {Number}
 */
GGeometry.pCross = function (v1, v2) {
    return v1.x * v2.y - v1.y * v2.x;
};

/**
 * Calculates perpendicular of v, rotated 90 degrees counter-clockwise -- cross(v, perp(v)) >= 0
 * @param {GGeometry.Point} point
 * @return {GGeometry.Point}
 */
GGeometry.pPerp = function (point) {
    return GGeometry.p(-point.y, point.x);
};

/**
 * Calculates perpendicular of v, rotated 90 degrees clockwise -- cross(v, rperp(v)) <= 0
 * @param {GGeometry.Point} point
 * @return {GGeometry.Point}
 */
GGeometry.pRPerp = function (point) {
    return GGeometry.p(point.y, -point.x);
};

/**
 * Calculates the projection of v1 over v2.
 * @param {GGeometry.Point} v1
 * @param {GGeometry.Point} v2
 * @return {GGeometry.pMult}
 */
GGeometry.pProject = function (v1, v2) {
    return GGeometry.pMult(v2, GGeometry.pDot(v1, v2) / GGeometry.pDot(v2, v2));
};

/**
 * Rotates two points.
 * @param  {GGeometry.Point} v1
 * @param  {GGeometry.Point} v2
 * @return {GGeometry.Point}
 */
GGeometry.pRotate = function (v1, v2) {
    return GGeometry.p(v1.x * v2.x - v1.y * v2.y, v1.x * v2.y + v1.y * v2.x);
};

/**
 * Unrotates two points.
 * @param  {GGeometry.Point} v1
 * @param  {GGeometry.Point} v2
 * @return {GGeometry.Point}
 */
GGeometry.pUnrotate = function (v1, v2) {
    return GGeometry.p(v1.x * v2.x + v1.y * v2.y, v1.y * v2.x - v1.x * v2.y);
};

/**
 * Calculates the square length of a GGeometry.Point (not calling sqrt() )
 * @param  {GGeometry.Point} v
 *@return {Number}
 */
GGeometry.pLengthSQ = function (v) {
    return GGeometry.pDot(v, v);
};

/**
 * Calculates the square distance between two points (not calling sqrt() )
 * @param {GGeometry.Point} point1
 * @param {GGeometry.Point} point2
 * @return {Number}
 */
GGeometry.pDistanceSQ = function(point1, point2){
    return GGeometry.pLengthSQ(GGeometry.pSub(point1,point2));
};

/**
 * Calculates distance between point an origin
 * @param  {GGeometry.Point} v
 * @return {Number}
 */
GGeometry.pLength = function (v) {
    return Math.sqrt(GGeometry.pLengthSQ(v));
};

/**
 * Calculates the distance between two points
 * @param {GGeometry.Point} v1
 * @param {GGeometry.Point} v2
 * @return {Number}
 */
GGeometry.pDistance = function (v1, v2) {
    return GGeometry.pLength(GGeometry.pSub(v1, v2));
};

/**
 * Returns point multiplied to a length of 1.
 * @param {GGeometry.Point} v
 * @return {GGeometry.Point}
 */
GGeometry.pNormalize = function (v) {
    var n = GGeometry.pLength(v);
    return n === 0 ? GGeometry.p(v) : GGeometry.pMult(v, 1.0 / n);
};

/**
 * Converts radians to a normalized vector.
 * @param {Number} a
 * @return {GGeometry.Point}
 */
GGeometry.pForAngle = function (a) {
    return GGeometry.p(Math.cos(a), Math.sin(a));
};

/**
 * Converts a vector to radians.
 * @param {GGeometry.Point} v
 * @return {Number}
 */
GGeometry.pToAngle = function (v) {
    return Math.atan2(v.y, v.x);
};

/**
 * Clamp a value between from and to.
 * @param {Number} value
 * @param {Number} min_inclusive
 * @param {Number} max_inclusive
 * @return {Number}
 */
GGeometry.clampf = function (value, min_inclusive, max_inclusive) {
    if (min_inclusive > max_inclusive) {
        var temp = min_inclusive;
        min_inclusive = max_inclusive;
        max_inclusive = temp;
    }
    return value < min_inclusive ? min_inclusive : value < max_inclusive ? value : max_inclusive;
};

/**
 * Clamp a point between from and to.
 * @param {Point} p
 * @param {Number} min_inclusive
 * @param {Number} max_inclusive
 * @return {GGeometry.Point}
 */
GGeometry.pClamp = function (p, min_inclusive, max_inclusive) {
    return GGeometry.p(GGeometry.clampf(p.x, min_inclusive.x, max_inclusive.x), GGeometry.clampf(p.y, min_inclusive.y, max_inclusive.y));
};

/**
 * Quickly convert GGeometry.Size to a GGeometry.Point
 * @param {GGeometry.Size} s
 * @return {GGeometry.Point}
 */
GGeometry.pFromSize = function (s) {
    return GGeometry.p(s.width, s.height);
};

/**
 * Run a math operation function on each point component <br />
 * Math.abs, Math.fllor, Math.ceil, Math.round.
 * @param {GGeometry.Point} p
 * @param {Function} opFunc
 * @return {GGeometry.Point}
 * @example
 * //For example: let's try to take the floor of x,y
 * var p = GGeometry.pCompOp(GGeometry.p(10,10),Math.abs);
 */
GGeometry.pCompOp = function (p, opFunc) {
    return GGeometry.p(opFunc(p.x), opFunc(p.y));
};

/**
 * Linear Interpolation between two points a and b
 * alpha == 0 ? a
 * alpha == 1 ? b
 * otherwise a value between a..b
 * @param {GGeometry.Point} a
 * @param {GGeometry.Point} b
 * @param {Number} alpha
 * @return {GGeometry.pAdd}
 */
GGeometry.pLerp = function (a, b, alpha) {
    return GGeometry.pAdd(GGeometry.pMult(a, 1 - alpha), GGeometry.pMult(b, alpha));
};

/**
 * @param {GGeometry.Point} a
 * @param {GGeometry.Point} b
 * @param {Number} variance
 * @return {Boolean} if points have fuzzy equality which means equal with some degree of variance.
 */
GGeometry.pFuzzyEqual = function (a, b, variance) {
    if (a.x - variance <= b.x && b.x <= a.x + variance) {
        if (a.y - variance <= b.y && b.y <= a.y + variance)
            return true;
    }
    return false;
};

/**
 * Multiplies a nd b components, a.x*b.x, a.y*b.y
 * @param {GGeometry.Point} a
 * @param {GGeometry.Point} b
 * @return {GGeometry.Point}
 */
GGeometry.pCompMult = function (a, b) {
    return GGeometry.p(a.x * b.x, a.y * b.y);
};

/**
 * @param {GGeometry.Point} a
 * @param {GGeometry.Point} b
 * @return {Number} the signed angle in radians between two vector directions
 */
GGeometry.pAngleSigned = function (a, b) {
    var a2 = GGeometry.pNormalize(a);
    var b2 = GGeometry.pNormalize(b);
    var angle = Math.atan2(a2.x * b2.y - a2.y * b2.x, GGeometry.pDot(a2, b2));
    if (Math.abs(angle) < GGeometry.POINT_EPSILON)
        return 0.0;
    return angle;
};

/**
 * @param {GGeometry.Point} a
 * @param {GGeometry.Point} b
 * @return {Number} the angle in radians between two vector directions
 */
GGeometry.pAngle = function (a, b) {
    var angle = Math.acos(GGeometry.pDot(GGeometry.pNormalize(a), GGeometry.pNormalize(b)));
    if (Math.abs(angle) < GGeometry.POINT_EPSILON) return 0.0;
    return angle;
};

/**
 * Rotates a point counter clockwise by the angle around a pivot
 * @param {GGeometry.Point} v v is the point to rotate
 * @param {GGeometry.Point} pivot pivot is the pivot, naturally
 * @param {Number} angle angle is the angle of rotation cw in radians
 * @return {GGeometry.Point} the rotated point
 */
GGeometry.pRotateByAngle = function (v, pivot, angle) {
    var r = GGeometry.pSub(v, pivot);
    var cosa = Math.cos(angle), sina = Math.sin(angle);
    var t = r.x;
    r.x = t * cosa - r.y * sina + pivot.x;
    r.y = t * sina + r.y * cosa + pivot.y;
    return r;
};

/**
 * A general line-line intersection test
 * indicating successful intersection of a line<br />
 * note that to truly test intersection for segments we have to make<br />
 * sure that s & t lie within [0..1] and for rays, make sure s & t > 0<br />
 * the hit point is        p3 + t * (p4 - p3);<br />
 * the hit point also is    p1 + s * (p2 - p1);
 * @param {GGeometry.Point} A A is the startpoint for the first line P1 = (p1 - p2).
 * @param {GGeometry.Point} B B is the endpoint for the first line P1 = (p1 - p2).
 * @param {GGeometry.Point} C C is the startpoint for the second line P2 = (p3 - p4).
 * @param {GGeometry.Point} D D is the endpoint for the second line P2 = (p3 - p4).
 * @param {GGeometry.Point} retP retP.x is the range for a hitpoint in P1 (pa = p1 + s*(p2 - p1)), <br />
 * retP.y is the range for a hitpoint in P3 (pa = p2 + t*(p4 - p3)).
 * @return {Boolean}
 */
GGeometry.pLineIntersect = function (A, B, C, D, retP) {
    if ((A.x === B.x && A.y === B.y) || (C.x === D.x && C.y === D.y)) {
        return false;
    }
    var BAx = B.x - A.x;
    var BAy = B.y - A.y;
    var DCx = D.x - C.x;
    var DCy = D.y - C.y;
    var ACx = A.x - C.x;
    var ACy = A.y - C.y;

    var denom = DCy * BAx - DCx * BAy;

    retP.x = DCx * ACy - DCy * ACx;
    retP.y = BAx * ACy - BAy * ACx;

    if (denom === 0) {
        if (retP.x === 0 || retP.y === 0) {
            // Lines incident
            return true;
        }
        // Lines parallel and not incident
        return false;
    }

    retP.x = retP.x / denom;
    retP.y = retP.y / denom;

    return true;
};

/**
 * GGeometrypSegmentIntersect return YES if Segment A-B intersects with segment C-D.
 * @param {GGeometry.Point} A
 * @param {GGeometry.Point} B
 * @param {GGeometry.Point} C
 * @param {GGeometry.Point} D
 * @return {Boolean}
 */
GGeometry.pSegmentIntersect = function (A, B, C, D) {
    var retP = GGeometry.p(0, 0);
    if (GGeometry.pLineIntersect(A, B, C, D, retP))
        if (retP.x >= 0.0 && retP.x <= 1.0 && retP.y >= 0.0 && retP.y <= 1.0)
            return true;
    return false;
};

/**
 * GGeometrypIntersectPoint return the intersection point of line A-B, C-D
 * @param {GGeometry.Point} A
 * @param {GGeometry.Point} B
 * @param {GGeometry.Point} C
 * @param {GGeometry.Point} D
 * @return {GGeometry.Point}
 */
GGeometry.pIntersectPoint = function (A, B, C, D) {
    var retP = GGeometry.p(0, 0);

    if (GGeometry.pLineIntersect(A, B, C, D, retP)) {
        // Point of intersection
        var P = GGeometry.p(0, 0);
        P.x = A.x + retP.x * (B.x - A.x);
        P.y = A.y + retP.x * (B.y - A.y);
        return P;
    }

    return GGeometry.p(0,0);
};

/**
 * check to see if both points are equal
 * @param {GGeometry.Point} A A GGeometryp a
 * @param {GGeometry.Point} B B GGeometryp b to be compared
 * @return {Boolean} the true if both GGeometryp are same
 */
GGeometry.pSameAs = function (A, B) {
    if ((A != null) && (B != null)) {
        return (A.x === B.x && A.y === B.y);
    }
    return false;
};



// High Perfomance In Place Operationrs ---------------------------------------

/**
 * sets the position of the point to 0
 * @param {GGeometry.Point} v
 */
GGeometry.pZeroIn = function(v) {
    v.x = 0;
    v.y = 0;
};

/**
 * copies the position of one point to another
 * @param {GGeometry.Point} v1
 * @param {GGeometry.Point} v2
 */
GGeometry.pIn = function(v1, v2) {
    v1.x = v2.x;
    v1.y = v2.y;
};

/**
 * multiplies the point with the given factor (inplace)
 * @param {GGeometry.Point} point
 * @param {Number} floatVar
 */
GGeometry.pMultIn = function(point, floatVar) {
    point.x *= floatVar;
    point.y *= floatVar;
};

/**
 * subtracts one point from another (inplace)
 * @param {GGeometry.Point} v1
 * @param {GGeometry.Point} v2
 */
GGeometry.pSubIn = function(v1, v2) {
    v1.x -= v2.x;
    v1.y -= v2.y;
};

/**
 * adds one point to another (inplace)
 * @param {GGeometry.Point} v1
 * @param {GGeometry.point} v2
 */
GGeometry.pAddIn = function(v1, v2) {
    v1.x += v2.x;
    v1.y += v2.y;
};

/**
 * normalizes the point (inplace)
 * @param {GGeometry.Point} v
 */
GGeometry.pNormalizeIn = function(v) {
    GGeometry.pMultIn(v, 1.0 / Math.sqrt(v.x * v.x + v.y * v.y));
};

GGeometry.vertexLineIntersect = function (Ax, Ay, Bx, By, Cx, Cy, Dx, Dy) {
    var distAB, theCos, theSin, newX;

    // FAIL: Line undefined
    if ((Ax === Bx && Ay === By) || (Cx === Dx && Cy === Dy))
        return {isSuccess:false, value:0};

    //  Translate system to make A the origin
    Bx -= Ax;
    By -= Ay;
    Cx -= Ax;
    Cy -= Ay;
    Dx -= Ax;
    Dy -= Ay;

    // Length of segment AB
    distAB = Math.sqrt(Bx * Bx + By * By);

    // Rotate the system so that point B is on the positive X axis.
    theCos = Bx / distAB;
    theSin = By / distAB;
    newX = Cx * theCos + Cy * theSin;
    Cy = Cy * theCos - Cx * theSin;
    Cx = newX;
    newX = Dx * theCos + Dy * theSin;
    Dy = Dy * theCos - Dx * theSin;
    Dx = newX;

    // FAIL: Lines are parallel.
    if (Cy === Dy) return {isSuccess:false, value:0};

    // Discover the relative position of the intersection in the line AB
    var t = (Dx + (Cx - Dx) * Dy / (Dy - Cy)) / distAB;

    // Success.
    return {isSuccess:true, value:t};
};

/**
 * GGeometry.Point is the class for point object, please do not use its constructor to create points, use GGeometry.p() alias function instead.
 * @class GGeometry.Point
 * @param {Number} x
 * @param {Number} y
 * @see GGeometry.p
 */
GGeometry.Point = function (x, y) {
    this.x = x || 0;
    this.y = y || 0;
};

/**
 * Helper function that creates a GGeometry.Point.
 * @function
 * @param {Number|GGeometry.Point} x a Number or a size object
 * @param {Number} y
 * @return {GGeometry.Point}
 * @example
 * var point1 = GGeometry.p();
 * var point2 = GGeometry.p(100, 100);
 * var point3 = GGeometry.p(point2);
 * var point4 = GGeometry.p({x: 100, y: 100});
 */
GGeometry.p = function (x, y) {
    // This can actually make use of "hidden classes" in JITs and thus decrease
    // memory usage and overall performance drastically
    // return GGeometry.p(x, y);
    // but this one will instead flood the heap with newly allocated hash maps
    // giving little room for optimization by the JIT,
    // note: we have tested this item on Chrome and firefox, it is faster than GGeometry.p(x, y)
    if (x === undefined)
        return {x: 0, y: 0};
    if (y === undefined)
        return {x: x.x, y: x.y};
    return {x: x, y: y};
};

/**
 * Check whether a point's value equals to another
 * @function
 * @param {GGeometry.Point} point1
 * @param {GGeometry.Point} point2
 * @return {Boolean}
 */
GGeometry.pointEqualToPoint = function (point1, point2) {
    return point1 && point2 && (point1.x === point2.x) && (point1.y === point2.y);
};


/**
 * GGeometry.Size is the class for size object, please do not use its constructor to create sizes, use GGeometry.size() alias function instead.
 * @class GGeometry.Size
 * @param {Number} width
 * @param {Number} height
 * @see GGeometry.size
 */
GGeometry.Size = function (width, height) {
    this.width = width || 0;
    this.height = height || 0;
};

/**
 * Helper function that creates a GGeometry.Size.
 * @function
 * @param {Number|GGeometry.Size} w width or a size object
 * @param {Number} h height
 * @return {GGeometry.Size}
 * @example
 * var size1 = GGeometry.size();
 * var size2 = GGeometry.size(100,100);
 * var size3 = GGeometry.size(size2);
 * var size4 = GGeometry.size({width: 100, height: 100});
 */
GGeometry.size = function (w, h) {
    // This can actually make use of "hidden classes" in JITs and thus decrease
    // memory usage and overall performance drastically
    //return GGeometry.size(w, h);
    // but this one will instead flood the heap with newly allocated hash maps
    // giving little room for optimization by the JIT
    // note: we have tested this item on Chrome and firefox, it is faster than GGeometry.size(w, h)
    if (w === undefined)
        return {width: 0, height: 0};
    if (h === undefined)
        return {width: w.width, height: w.height};
    return {width: w, height: h};
};

/**
 * Check whether a point's value equals to another
 * @function
 * @param {GGeometry.Size} size1
 * @param {GGeometry.Size} size2
 * @return {Boolean}
 */
GGeometry.sizeEqualToSize = function (size1, size2) {
    return (size1 && size2 && (size1.width === size2.width) && (size1.height === size2.height));
};


/**
 * GGeometry.Rect is the class for rect object, please do not use its constructor to create rects, use GGeometry.rect() alias function instead.
 * @class GGeometry.Rect
 * @param {Number} width
 * @param {Number} height
 * @see GGeometry.rect
 */
GGeometry.Rect = function (x, y, width, height) {
    this.x = x||0;
    this.y = y||0;
    this.width = width||0;
    this.height = height||0;
};

/**
 * Helper function that creates a GGeometry.Rect.
 * @function
 * @param {Number|GGeometry.Rect} x a number or a rect object
 * @param {Number} y
 * @param {Number} w
 * @param {Number} h
 * @returns {GGeometry.Rect}
 * @example
 * var rect1 = GGeometry.rect();
 * var rect2 = GGeometry.rect(100,100,100,100);
 * var rect3 = GGeometry.rect(rect2);
 * var rect4 = GGeometry.rect({x: 100, y: 100, width: 100, height: 100});
 */
GGeometry.rect = function (x, y, w, h) {
    if (x === undefined)
        return {x: 0, y: 0, width: 0, height: 0};
    if (y === undefined)
        return {x: x.x, y: x.y, width: x.width, height: x.height};
    return {x: x, y: y, width: w, height: h };
};

/**
 * Check whether a rect's value equals to another
 * @function
 * @param {GGeometry.Rect} rect1
 * @param {GGeometry.Rect} rect2
 * @return {Boolean}
 */
GGeometry.rectEqualToRect = function (rect1, rect2) {
    return rect1 && rect2 && (rect1.x === rect2.x) && (rect1.y === rect2.y) && (rect1.width === rect2.width) && (rect1.height === rect2.height);
};

GGeometry._rectEqualToZero = function(rect){
    return rect && (rect.x === 0) && (rect.y === 0) && (rect.width === 0) && (rect.height === 0);
};

/**
 * Check whether the rect1 contains rect2
 * @function
 * @param {GGeometry.Rect} rect1
 * @param {GGeometry.Rect} rect2
 * @return {Boolean}
 */
GGeometry.rectContainsRect = function (rect1, rect2) {
    if (!rect1 || !rect2)
        return false;
    return !((rect1.x >= rect2.x) || (rect1.y >= rect2.y) ||
        ( rect1.x + rect1.width <= rect2.x + rect2.width) ||
        ( rect1.y + rect1.height <= rect2.y + rect2.height));
};

/**
 * Returns the rightmost x-value of a rect
 * @function
 * @param {GGeometry.Rect} rect
 * @return {Number} The rightmost x value
 */
GGeometry.rectGetMaxX = function (rect) {
    return (rect.x + rect.width);
};

/**
 * Return the midpoint x-value of a rect
 * @function
 * @param {GGeometry.Rect} rect
 * @return {Number} The midpoint x value
 */
GGeometry.rectGetMidX = function (rect) {
    return (rect.x + rect.width / 2.0);
};
/**
 * Returns the leftmost x-value of a rect
 * @function
 * @param {GGeometry.Rect} rect
 * @return {Number} The leftmost x value
 */
GGeometry.rectGetMinX = function (rect) {
    return rect.x;
};

/**
 * Return the topmost y-value of a rect
 * @function
 * @param {GGeometry.Rect} rect
 * @return {Number} The topmost y value
 */
GGeometry.rectGetMaxY = function (rect) {
    return(rect.y + rect.height);
};

/**
 * Return the midpoint y-value of `rect'
 * @function
 * @param {GGeometry.Rect} rect
 * @return {Number} The midpoint y value
 */
GGeometry.rectGetMidY = function (rect) {
    return rect.y + rect.height / 2.0;
};

/**
 * Return the bottommost y-value of a rect
 * @function
 * @param {GGeometry.Rect} rect
 * @return {Number} The bottommost y value
 */
GGeometry.rectGetMinY = function (rect) {
    return rect.y;
};

/**
 * Check whether a rect contains a point
 * @function
 * @param {GGeometry.Rect} rect
 * @param {GGeometry.Point} point
 * @return {Boolean}
 */
GGeometry.rectContainsPoint = function (rect, point) {
    return (point.x >= GGeometry.rectGetMinX(rect) && point.x <= GGeometry.rectGetMaxX(rect) &&
        point.y >= GGeometry.rectGetMinY(rect) && point.y <= GGeometry.rectGetMaxY(rect)) ;
};

/**
 * Check whether a rect intersect with another
 * @function
 * @param {GGeometry.Rect} rectA
 * @param {GGeometry.Rect} rectB
 * @return {Boolean}
 */
GGeometry.rectIntersectsRect = function (ra, rb) {
    var maxax = ra.x + ra.width,
        maxay = ra.y + ra.height,
        maxbx = rb.x + rb.width,
        maxby = rb.y + rb.height;
    return !(maxax < rb.x || maxbx < ra.x || maxay < rb.y || maxby < ra.y);
};

/**
 * Check whether a rect overlaps another
 * @function
 * @param {GGeometry.Rect} rectA
 * @param {GGeometry.Rect} rectB
 * @return {Boolean}
 */
GGeometry.rectOverlapsRect = function (rectA, rectB) {
    return !((rectA.x + rectA.width < rectB.x) ||
        (rectB.x + rectB.width < rectA.x) ||
        (rectA.y + rectA.height < rectB.y) ||
        (rectB.y + rectB.height < rectA.y));
};

/**
 * Returns the smallest rectangle that contains the two source rectangles.
 * @function
 * @param {GGeometry.Rect} rectA
 * @param {GGeometry.Rect} rectB
 * @return {GGeometry.Rect}
 */
GGeometry.rectUnion = function (rectA, rectB) {
    var rect = GGeometry.rect(0, 0, 0, 0);
    rect.x = Math.min(rectA.x, rectB.x);
    rect.y = Math.min(rectA.y, rectB.y);
    rect.width = Math.max(rectA.x + rectA.width, rectB.x + rectB.width) - rect.x;
    rect.height = Math.max(rectA.y + rectA.height, rectB.y + rectB.height) - rect.y;
    return rect;
};

/**
 * Returns the overlapping portion of 2 rectangles
 * @function
 * @param {GGeometry.Rect} rectA
 * @param {GGeometry.Rect} rectB
 * @return {GGeometry.Rect}
 */
GGeometry.rectIntersection = function (rectA, rectB) {
    var intersection = GGeometry.rect(
        Math.max(GGeometry.rectGetMinX(rectA), GGeometry.rectGetMinX(rectB)),
        Math.max(GGeometry.rectGetMinY(rectA), GGeometry.rectGetMinY(rectB)),
        0, 0);

    intersection.width = Math.min(GGeometry.rectGetMaxX(rectA), GGeometry.rectGetMaxX(rectB)) - GGeometry.rectGetMinX(intersection);
    intersection.height = Math.min(GGeometry.rectGetMaxY(rectA), GGeometry.rectGetMaxY(rectB)) - GGeometry.rectGetMinY(intersection);
    return intersection;
};


