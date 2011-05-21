
/**
 * @param {float} x x-coordinate
 * @param {float} y y-coordinate
 * @constructor
 */
function Vector(x, y) {
	this.x = x || 0;
	this.y = y || 0;
};


Vector.lerp = function(v1,v2,t) {
  return new Vector(v1.x + ((v2.x - v1.x) * t), v1.y + ((v2.y - v1.y) * t));
};

/**
 * Transforms a vector by the given matrix
 * @param {Vector} vec Vector to transform
 * @param {Matrix[9]} mat Transformation matrix
 */
Vector.transform = function(vec,mat){
  var vy = vec.y, vx = vec.x,
	  tx = (mat[0] * vx) + (mat[3] * vy) + mat[6];
	  ty = (mat[1] * vx) + (mat[4] * vy) + mat[7];
	    
  vec.set(tx,ty);	
};

/**
 * Projects a vector onto another
 * @param {Vector} vec1 Vector1
 * @param {Vector} vec2 Vector2
 * @return {Vector} vec1 projected onto vec2
 */
Vector.project = function(vec1,vec2) {
  var v2x = vec2.x, 
      v2y = vec2.y,
      abdot = (vec1.x * v2x) + (vec1.y * v2y),
      blensq = (v2x * v2x) + (v2y * v2y),
      tmp = abdot/blensq;

  return new Vector(v2x * tmp, v2y * tmp);
};

/**
 * Returns the relative rotation direction
 * of current vector related to another vector
 * @param {Vector} vec2
 * @return {int} 1 = clockwise, -1 = anticlockwise
 */
Vector.prototype.sign = function(vec2) {
  if (this.y * vec2.x > this.x * vec2.y) {
    return -1 
  } else {
    return 1;
 }
};

/**
 * Add a vector to this vector
 * @param {Vector} vec2 Other vector
 */
Vector.prototype.add = function(vec2) {
  this.x += vec2.x;
  this.y += vec2.y;
};

/**
 * Subtract a vector from this vector
 * @param {Vector} vec2 Other vector
 */
Vector.prototype.sub = function(vec2) {
  this.x -= vec2.x;
  this.y -= vec2.y;
};

/**
 * Multiply this vector with another vector or scalar
 * @param {Vector, float} v Other vector or scalar
 */
Vector.prototype.mult = function(v) {
  if(typeof v === 'number') {
    this.x *= v;
    this.y *= v;
  } else if (typeof v === 'object') {
    this.x *= v.x;
    this.y *= v.y;
  }
  return this;
};

/**
 * Divide this vector by another vector or scalar
 * @param {Vector,float} v Other vector or scalar
 */
Vector.prototype.div = function(v) {
  if(typeof v === 'number') {
    this.x /= v;
    this.y /= v;
  } else if (typeof v === 'object') {
    this.x /= v.x;
    this.y /= v.y;
  }
};

/**
 * Limit the magnitude of this vector
 * @param {float} scalar Value to limit
 */
Vector.prototype.limit = function(scalar) {
  if(this.length() > scalar) {
    this.normalize();
    this.mult(scalar);
  }
};

/**
 * Normalize this vector
 * @return {Vector} this vector
 */
Vector.prototype.normalize = function() {
  var l = this.length();
  if (l > 0) {
    this.div(l);
  }
  
  return this;
};

/**
 * Returns the dot product of current
 * and supplied vector
 * @param {Vector} v2 Other vector
 * @return {float} dot product
 */
Vector.prototype.dot = function(v2) {
  return this.x * v2.x + this.y * v2.y;    
};

/**
 * @deprecated
 * Returns a plain JSON version of this vector
 * @return {JSON} this vector
 */
Vector.prototype.plain = function() {
 return { x : this.x, y : this.y};
};

/**
 * Add to or remove from the vector X position
 */
Vector.prototype.addX = function(x) {
	this.x += x;
};

/**
 * Add to or remove from the vector Y position
 */
Vector.prototype.addY = function(y) {
	this.y += y;
};

/**
 * Set the vector x,y values
 * @param {float} x x-coordinate
 * @param {float} y y-coordinate
 */
Vector.prototype.set = function(x, y) {
	this.x = x; 
	this.y = y;
};

/**
 * Calculate the length/magnitude of this vector
 * @return {float} vector length
 */
Vector.prototype.length = function(){
  return Math.sqrt(this.x * this.x + this.y * this.y);
};

/**
 * Calculate the unsquared length of this vector
 * @return {float} vector length unsqrt
 */
Vector.prototype.length_sq = function() {
  return this.x * this.x + this.y * this.y;
};

/**
 * Calculate the heading of this vector
 * @return {rad} vector heading
 */
Vector.prototype.heading = function() {
  return (-Math.atan2(-this.y, this.x));
};

/**
 * Vector as string
 * @return {string} vector
 */
Vector.prototype.toString = function() {
  return this.x + ' ' + this.y;
};

/**
 * Perp-dot product
 * @param {Vector} vec2 Other vector
 * @return {Float} product
 */
Vector.prototype.perp_dot = function(vec2) {
  return this.x * vec2.y - this.y * vec2.x;    
};


Vector.prototype.copy = function() {
  return new Vector(this.x,this.y);
}

/**
 * Subtract two given vectors
 * @param {Vector} vec1 Vector1
 * @param {Vector} vec2 Vector2
 * @return {Vector} result vector
 */
Vector.sub = function(vec1, vec2) {
	var tmpVec = new Vector(vec1.x, vec1.y);
	
	tmpVec.x -= vec2.x;
	tmpVec.y -= vec2.y;
	
	return tmpVec;
};

/**
 * Add two given vectors
 * @param {Vector} vec1 Vector1
 * @param {Vector} vec2 Vector2
 * @return {Vector} result vector
 */
Vector.add = function(vec1,vec2) {
  var tmpVec = new Vector(vec1.x, vec1.y);
  tmpVec.x += vec2.x;
  tmpVec.y += vec2.y;
  return tmpVec;
};

/**
 * Calculate the perp-dot product of two given vectors
 * @param {Vector} vec1 Vector1
 * @param {Vector} vec2 Vector2
 * @return {float} result
 */
Vector.perp_dot = function(vec1,vec2) {
 return vec1.x * vec2.y - vec1.y * vec2.x;
};

/**
 * Calculate the perp-dot product of two given vectors
 * @param {Vector} vec1 Vector1
 * @param {Vector} vec2 Vector2
 * @return {float} result
 */
Vector.dot = function(vec1,vec2) {
  return vec1.x * vec2.x + vec1.y * vec2.y;
};

/**
 * Return a normalized version of the given vector
 * @param {Vector} vec Vector to normalize
 * @return {Vector} Normalized vector
 */
Vector.normalize = function(vec){
 var l = vec.length();
 return new Vector(vec.x/l, vec.y/l);
};

/**
 * Distance between to vectors
 * @param {Vector} v1 Vector1
 * @param {Vector} v2 Vector2
 * @return {float} distance
 */
Vector.dist = function(v1,v2) {
  var dx = v1.x - v2.x,
      dy = v1.y - v2.y;

  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Unsquared distance between two vectors
 * @param {Vector} v1 Vector1
 * @param {Vector} v2 Vector2
 * @return {float} unsquared distance
 */
Vector.dist_sq = function(v1,v2) {
  var dx = v1.x - v2.x,
      dy = v1.y - v2.y;

  return dx * dx + dy * dy;
};

/**
 * Create a unit vector from a radian value
 * @param {float} r Radians
 * @return {Vector} unit vector
 */
Vector.from_heading = function(r) {
  return new Vector(Math.cos(r),Math.sin(r));    
};

module.exports = Vector;


