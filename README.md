# spatial
  A 2d spatial hash module for node.js. 

## Installation

Install using npm

  `$ npm install spatial`

Or clone the git repo manually
 
## Documentation

### Basic usage:

Require the library

    var Spatial = require('spatial');
  
Create a new spatial hash with a grid size of 500

    var grid = new Spatial(500);

 The optimal grid size varies greatly depending on usage scenario. Object density, object size
and the number of objects all affect the optimal grid size. A rule of thumb is that the grid should be big enough to fit the largest object in your scene.

Create an entity to put in the grid

    var e = { id: 23, pos : { x : 100, y : 200}, size: 30};

Add it to the grid

     grid.addEntity(e, function() { console.log('Added entity to grid') });

Don't forget to recalculate the grid after each change to it

     grid.update();

The entities close to a vector can be found by using the 'getClosest' method

     grid.getClosest({ x: 100, y: 200}, function(error, data) {});

### Additional functionality

Gets the keys of the hash buckets within a certain radius from the supplied vector

     grid.getAreaKeys(vector, radius, callback(err, data))

Gets an array of entity ID's within a certain radius from the supplied vector

     grid.getAreaIds(vector, radius, callback(err,data))


Further documentation is provided in form of code comments and tests

## Running tests

Expresso (https://github.com/visionmedia/expresso) can be used to run
the tests.

To install:

  `$ npm install expresso`

To run tests:

  `$ expresso`
