
/*!
* node-spatial
*
* The MIT License
*
* Copyright (c) 2010-2011 Stefan Pataky. All rights reserved.
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*/

/**
 * Grid constructor
 * @param {int} cellsize the w/h of each cell in the grid.
 * @constructor
 */
function Grid(cellsize) {
  this.grid = {};  //Grid hash
  this.ent = {};  //Raw entity list
  this.cellSize = cellsize;
};




/**
 * Gets the bucket key for a x, y pair
 * and returns the hash string
 *
 * @param {float} x x-coordinate.
 * @param {float} y y-coordinate.
 * @return {int} key.
 */
Grid.prototype._rawKey = function(x, y) {
  var cs = this.cellSize,
      a = Math.floor(x / cs),
      b = Math.floor(y / cs);

  return (b << 16) ^ a;
};


/**
 * Gets the bucket key for a x,y pair without cs lookup
 * @param {float} x xcoord.
 * @param {float} y ycoord.
 * @param {int} c cellSize of grid.
 * @return {int} key.
 */
Grid._key = function(x, y, c) {
  var a = Math.floor(x / c),
      b = Math.floor(y / c);

  return (b << 16) ^ a;
};


/**
 * Adds an entity to the zone entity list
 * 
 * An entity is an object with a 'pos' property of type { x, y } (Vector)
 * and a 'size' property describing the radius of the object
 * and a 'id' property that is unique among all other entities.
 *
 * @param {Entity} e Entity.
 * @param {function} _cb callback(err, entity.id).
 */
Grid.prototype.addEntity = function(e, _cb) {
  this.ent[e.id] = e;
  _cb(null, e.id);
};


/**
 * Returns an entity from the entity list based on its id
 *
 * @param {var} id Entity id.
 * @return {Entity} Matching entity.
 */
Grid.prototype.getEntity = function(id) {
  return this.ent[id];
};


/**
 * Deletes an entity from the entity list based on its id
 *
 * @param {var} id Entity id.
 */
Grid.prototype.delEntity = function(id) {
  delete this.ent[id];
  //  this.ent.splice(id,1);
};


/**
 * Returns entities in the same hash bucket as the given vector
 *
 * @param {Vector} vec Vector.
 * @param {function} _cb callback(error,result);.
 */
Grid.prototype.getClosest = function(vec, _cb) {
  if (!vec) _cb('No vector supplied');

  var key = this._rawKey(vec.x, vec.y);
  _cb(null, this.grid[key]);
};


/**
 * Get the keys of the buckets within range n from a given vector
 *
 * @param {Vector} vec Vector.
 * @param {float} n checking range.
 * @param {function} _cb callback(error,result).
 */
Grid.prototype.getAreaKeys = function(vec, n, _cb) {
  if (!vec || !n) _cb('No vector or distance supplied');

  var nwx = vec.x - n,
      nwy = vec.y - n,
      sex = vec.x + n,
      sey = vec.y + n,
      cs = this.cellSize,
      grid = this.grid,
      retval = [],
      rk = Grid._key;

  for (var x = nwx; x <= sex; x = x + cs) {
    for (var y = nwy; y <= sey; y = y + cs) {
      var g = rk(x, y, cs);
      retval.push(g);
    }
  }

  _cb(null, retval);
};


/**
 * Gets the Id of all entities within distance n of the given vector
 *
 * @param {Vector} vec Vector.
 * @param {float} n checking range.
 * @param {function} _cb callback(err,[ids]);.
 */
Grid.prototype.getAreaIds = function(vec, n, _cb) {
  if (!vec || !n) _cb('No vector or distance supplied');
  
  //Get all entities within a certain area around the supplied vector
  var anwx = vec.x - n,
      anwy = vec.y - n,
      asex = vec.x + n,
      asey = vec.y + n,
      cs = this.cellSize,
      retval = [],
      grid = this.grid,
      rk = Grid._key;
        

  //Step with this.cellSize in x/y, dump id of entities along the way
  //Subtract/add 1 to start/end positions to prevent float rounding issues
  //bug with entities falling out of AOI was caused by this
  for (var x = anwx - 1; x <= asex + 1; x = x + cs) {
    for (var y = anwy - 1; y <= asey + 1; y = y + cs) {     
      var g = grid[rk(x, y, cs)];      
      if(!g) continue;
      var gl = g.length;
      
      while(gl--){
        var thiseid = g[gl].id;
        if(retval.indexOf(thiseid) == -1) retval.push(thiseid);
      }                  
      
    }
  }

  _cb(null, retval);

};


/**
 * Rebuilds the grid hash
 *
 */
Grid.prototype.update = function() {
 
  delete this.grid;
  this.grid = {};
 
  var ent = this.ent,
      g = this.grid,
      cs = this.cellSize,
      atg = Grid.addToGrid;
  
  for (var e in ent) {
    atg(ent[e], g, cs);
  }

};


/**
 * Adds a raw entity to the grid hash
 *
 * @param {Entity} e Entity.
 * @param {Array} grid zone instance grid.
 * @param {int} cs grid cell size.
 */
Grid.addToGrid = function(e, grid, cs) {
  if (!e || !grid || !cs) return;

  //Data needed, entity position, checking distance
  var px = e.pos.x,
      py = e.pos.y,
      dist = e.size,
      distdist = dist + dist;

  //Add double the objects radius to the position to form padded AABB
  //we pad because the grid is not updated every tick, and the padding
  //prevents an entity from suddenly swithing cells between updates
  co = [px - distdist, py - distdist,
    px + distdist, py - distdist,
    px - distdist, py + distdist,
    px + distdist, py + distdist],

  //cells entity needs to be in
  ec = [],

  //local ref to key function
  rk = Grid._key;

  //For each corner of AABB check corners location
  //and add entity to all cells that the AABB corners are in
  //This does not allow for objects larger than cells.
  //To allow for such objects simply iterate nw->se corner and step
  //with distdist or something smaller than cellsize and add entity
  //to each iterated location.
  for (var c = 0; c < 8; c = c + 2) {
    var key = rk(co[c], co[c + 1], cs);
    if (ec.indexOf(key) == -1) {
      ec.push(key);
      var gk = grid[key];

      gk ? gk.push(e) : grid[key] = [e];
    }
  }
};


/**
 * Export module
 */
module.exports = Grid;
