var QUAD = {};
QUAD.init = function(args) {
    var TOP_LEFT = 0;
    var TOP_RIGHT = 1;
    var BOTTOM_LEFT = 2;
    var BOTTOM_RIGHT = 3;
    var PARENT = 4;
    var SELF = 5;

//    var maxChildren = args.maxChildren || 2;
    var maxDepth = args.maxDepth || 6;

    function Node(x, y, w, h, depth, parent) {
        this.rect = new GGeometry.Rect(x, y, w, h);
        this.depth = depth;
        this.parent = parent;
        this.items = [];
        this.nodes = [];
    }
    Node.prototype = {rect : 0,depth: 0,parent: null, items: null,nodes: null

        ,insert: function(item) {
            if (this.nodes.length == 0 && this.depth < maxDepth) {
                this.divide();
            };
            if (this.depth >= maxDepth){
                this.items.push(item);
                item.quadtreeNode = this;
            }else{
                var i = this.findInsertNode(item);
                if( i != SELF){
                    this.nodes[i].insert(item);
                }else{
                    this.items.push(item);
                    item.quadtreeNode = this;
                }
            }
            return item;
        },findInsertNode: function(item) {
            if (item.pos.x + item.radius <  this.rect.x + (this.rect.width / 2)) {
                if (item.pos.y - item.radius > this.rect.y + (this.rect.height / 2)) {
                    return TOP_LEFT;
                }
                if( item.pos.y + item.radius < this.rect.y + (this.rect.height / 2)) {
                    return BOTTOM_LEFT;
                }
            }
            if (item.pos.x - item.radius >  this.rect.x + (this.rect.width / 2)) {
                if (item.pos.y - item.radius > this.rect.y + (this.rect.height / 2)) {
                    return TOP_RIGHT;
                }
                if( item.pos.y + item.radius < this.rect.y + (this.rect.height / 2)) {
                    return BOTTOM_RIGHT;
                }
            }
            return SELF;
        },divide: function() {
            var childrenDepth = this.depth + 1;
            var width = (this.rect.width / 2);
            var height = (this.rect.height / 2);
            this.nodes.push(new Node(this.rect.x, this.rect.y + height, width, height, childrenDepth, this));
            this.nodes.push(new Node(this.rect.x + width, this.rect.y + height, width, height, childrenDepth, this));
            this.nodes.push(new Node(this.rect.x, this.rect.y, width, height, childrenDepth, this));
            this.nodes.push(new Node(this.rect.x + width, this.rect.y, width, height, childrenDepth, this));

        },searchRegion: function(rect) {
            var result = [];
            if(this.nodes.length != 0) {
                if(rect.right < this.rect.x + this.rect.width / 2) {
                    if(rect.bottom > this.rect.y + this.rect.height /2)  result = result.concat(this.nodes[TOP_LEFT].searchRegion(rect));
                    if(rect.up < this. y + this.rect.height / 2) result = result.concat(this.nodes[BOTTOM_LEFT].searchRegion(rect));
                }
                if(rect.left > this.rect.x + this.rect.width / 2) {
                    if(rect.bottom > this.rect.y + this.rect.height /2)  result = result.concat(this.nodes[TOP_RIGHT].searchRegion(rect));
                    if(rect.up < this. y + this.rect.height / 2) result = result.concat(this.nodes[BOTTOM_RIGHT].searchRegion(rect));
                }
                for (var i = 0; i < this.items.length; i++){
                       if(GGeometry.rectContainsRect(rect, this.items[i].aabb())) {
                            result.push(this.item([i]));
                       }
                }

            }
            return result;
        },updateItem: function(item){
            var i = this.items.indexOf(item);
            if(GGeometry.rectContainsRect(this.rect, item.aabb())){
                if (i == -1){
                    this.insert(item);
                }else{
                    var k = findInsertNode(item);
                    if (k != SELF){
                        this.items.splice(i, 1);
                        this.insert(item);
                    }
                }
            }else {
                if(this.depth != 0)
                   this.parent.updateItem(item);
            }
        },deleteItem: function(item){
            var i = this.items.indexOf(item);
            if(i != -1){
                this.items.splice(i, 1);
            }
        },clear: function() {
            for (var i = 0; i < this.nodes.length; i++) {
                this.nodes[i].clear();
            }
            this.items.length = 0;
            this.nodes.length = 0;
        }};
    return {root: (function() {
            return new Node(args.minX, args.minY, args.maxX - args.minX, args.maxY - args.minY, 0);
        }()),insert: function(item) {
            this.root.insert(item);
        },clear: function() {
            this.root.clear();
        }};
};
