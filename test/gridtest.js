var Grid = require('../lib/grid');
var Vector = require('./fixtures/vector');
var assert = require('assert');

var Entity = function(pos,name,id) {
  this.id = id;
  this.pos = pos;
  this.name = name;
  this.size = 30; //Object bounding sphere radius
}

module.exports = {
  Instance : function() {
    var z = new Grid(666);
    assert.equal(z.cellSize,666);
  },
  Key : function() {
    var v1 = new Vector(999,999);
    var v2 = new Vector(1,1);
    var z = new Grid(1000);
    
    var k1 = Grid._key(v1.x, v1.y);
    var k2 = Grid._key(v2.x, v2.y);
    assert.equal(k1,k2);
  },
  KeyUnique : function() { 
    var z = new Grid(1000);
    var k = [], 
    rk = z._rawKey;
    for(var i = -100000;i<=100000; i=i+1000) {
      for(var j = -100000;j<=100000;j=j+1000) {
         var key = z._rawKey(i,j);
         if(k.indexOf(key) == -1) {
           assert.ok(true);
           k.push(key);
         } else {
           assert.ok(false);
         }
      }
    }
  },
  NegPos : function() {

  var z = new Grid(1000);
    var k1 = z._rawKey(1000,-1000);
    var k2 = z._rawKey(-1000,1000);
    assert.notEqual(k1,k2);
  },
  addEntity : function() {
   var z = new Grid( 1000);
   var e = {pos:new Vector(10,10), id:101};
   z.addEntity(e,function(err,id) {
     assert.equal(id,101);
   });
  },
  delEntity : function() {
    var z = new Grid(100);
    var e = new Entity(new Vector(10,10), 'Test', 12345);
    var e2 = new Entity(new Vector(10,10), 'Test', 12346);
    var e3 = new Entity(new Vector(10,10), 'Test', 12347);
    var e4 = new Entity(new Vector(10,10), 'Test', 12348);
    var e5 = new Entity(new Vector(10,10), 'Test', 12349);
    z.addEntity(e, function(){});
    z.addEntity(e2, function(){});
    z.addEntity(e3, function(){});
    z.addEntity(e4, function(){});
    z.addEntity(e5, function(){});
    z.delEntity(12349);
    var e = z.getEntity(12349);
    assert.equal(e,undefined);
  },
  update : function () {
     var z = new Grid(100);
     var e = new Entity(new Vector(10,10),'Test',1);
     var ee = new Entity(new Vector(90,10),'Test',2);
     z.addEntity(e,function(){});
     z.addEntity(ee,function(){});
     z.update();
     assert.ok(z.grid[0]);
  },
  getClosest : function () {
     var z = new Grid(100);
     var e = new Entity(new Vector(10,10),'Test',1);
     var ee = new Entity(new Vector(90,10),'Test',2);
     var eee = new Entity(new Vector(250,250),'Test',3);
     var e4 = new Entity(new Vector(-10,10), 'Test',4);

     z.addEntity(e,function(){});
     z.addEntity(ee,function(){});
     z.addEntity(eee,function(){});
     z.addEntity(e4,function(){});
     z.update();
     z.getClosest(e.pos, function(err,c) {
       

     var n=0;
     for (var i in c) {
       n++;
     }
     
     assert.equal(n,3);
     });
  },
  updBench : function() {
    var zb = new Grid(200);
    
    for(var i = 0; i < 10000; i++) {
      var rndvec = new Vector(Math.floor(Math.random() *100000), Math.floor(Math.random() * 100000));
      var tmpe = new Entity(rndvec, 'Ent ' +i,i);
      zb.addEntity(tmpe, function() {});
    }
    zb.update();
    var c = 10000;
    var m = 0;
    
    for(var i = 0;i < 20; i++) {
      var a = new Date(); 
      zb.update();  
      var b = new Date();
      m += (b-a);
    }
    
    console.log("Mean Update Time for " + c + " entities in ms:", m/20);
  },
  edges : function() {
    var e = new Entity(new Vector(500,500), 'TestCent',1);
    var ee = new Entity(new Vector(20,500), 'TestLeft',2);
    var er = new Entity(new Vector(980,500), 'TestRight',3);
    var et = new Entity(new Vector(500,20), 'TestTop',4);
    var eb = new Entity(new Vector(500,980), 'TestBottom', 5);
    var ebl = new Entity(new Vector(20,980), 'TestBottomLeft',6);
    var ebr = new Entity(new Vector(980,980), 'TestBottomRight',7);
    var etl = new Entity(new Vector(20,20), 'TestTopLeft',8);
    var etr = new Entity(new Vector(980,20), 'TestTopRight',9);
    var z = new Grid(1000);

    z.addEntity(e,function(){});
    z.addEntity(ee,function(){});
    z.addEntity(er,function(){});
    z.addEntity(et,function(){});
    z.addEntity(eb,function(){});
    z.addEntity(ebl,function(){});
    z.addEntity(ebr,function(){});
    z.addEntity(etl,function(){});
    z.addEntity(etr,function(){});
    z.update();    

    var mz = z.grid[0];

    //TestLeft (ee) should be in center and left
    var ztl = z.getClosest(new Vector(-1000,0), function(err,d) {
      var exists = false;
      var center = false;
      for (var i in mz) {
        if(mz[i].id == ee.id) center = true;
      }
      for(var i in d) {
        if(d[i].id == ee.id) exists = true;
      }
      assert.ok(center);
      assert.ok(exists);
    });
    
    //Testright (er) should be in center and right
      var ztr = z.getClosest(new Vector(1000,0), function(err,d) {
      var exists = false;
      var center = false;
      for (var i in mz) {
        if(mz[i].id == er.id) center = true;
      }
      for(var i in d) {
        if(d[i].id == er.id) exists = true;
      }
      assert.ok(center);
      assert.ok(exists);
    });

   //TestTop (et) should be in center and top
    var ztt = z.getClosest(new Vector(0,-1000), function(err,d) {
      var exists = false;
      var center = false;
      for (var i in mz) {
        if(mz[i].id == et.id) center = true;
      }
      for(var i in d) {
        if(d[i].id == et.id) exists = true;
      }
      assert.ok(center);
      assert.ok(exists);
    });

   //TestBottom (eb) should be in center and bottom
    var ztl = z.getClosest(new Vector(0,1000), function(err,d) {
      var exists = false;
      var center = false;
      for (var i in mz) {
        if(mz[i].id == eb.id) center = true;
      }
      for(var i in d) {
        if(d[i].id == eb.id) exists = true;
      }
      assert.ok(center);
      assert.ok(exists);
    });

   //TestBottomLeft (ebl) should be in center, bottom and left
    var ztl = z.getClosest(new Vector(-1000,0), function(err,d) {
      var exists = false;
      var center = false;
      for (var i in mz) {
        if(mz[i].id == ebl.id) center = true;
      }
      for(var i in d) {
        if(d[i].id == ebl.id) exists = true;
      }
      assert.ok(center);
      assert.ok(exists);

      var extra = z.getClosest(new Vector(0,1000), function(err,d){
        var exists = false;
        for (var i in d) {
          if(d[i].id == ebl.id) exists = true;
        }
        assert.ok(exists);
      });      
    });

  //TestBottomRight (ebr) should be in center, bottom and right
    var ztl = z.getClosest(new Vector(1000,0), function(err,d) {
      var exists = false;
      var center = false;
      for (var i in mz) {
        if(mz[i].id == ebr.id) center = true;
      }
      for(var i in d) {
        if(d[i].id == ebr.id) exists = true;
      }
      assert.ok(center);
      assert.ok(exists);

      var extra = z.getClosest(new Vector(0,1000), function(err,d){
        var exists = false;
        for (var i in d) {
          if(d[i].id == ebr.id) exists = true;
        }
        assert.ok(exists);
      });      
    });

  //TestTopLeft (etl) should be in center, top and left
    var ztl = z.getClosest(new Vector(-1000,0), function(err,d) {
      var exists = false;
      var center = false;
      for (var i in mz) {
        if(mz[i].id == etl.id) center = true;
      }
      for(var i in d) {
        if(d[i].id == etl.id) exists = true;
      }
      assert.ok(center);
      assert.ok(exists);

      var extra = z.getClosest(new Vector(0,-1000), function(err,d){
        var exists = false;
        for (var i in d) {
          if(d[i].id == etl.id) exists = true;
        }
        assert.ok(exists);
      });      
    });

  //TestTopRight (etr) should be in center, top and right
    var ztl = z.getClosest(new Vector(1000,0), function(err,d) {
      var exists = false;
      var center = false;
      for (var i in mz) {
        if(mz[i].id == etr.id) center = true;
      }
      for(var i in d) {
        if(d[i].id == etr.id) exists = true;
      }
      assert.ok(center);
      assert.ok(exists);

      var extra = z.getClosest(new Vector(0,-1000), function(err,d){
        var exists = false;
        for (var i in d) {
          if(d[i].id == etr.id) exists = true;
        }
        assert.ok(exists);
      });      
    });
  },
  getAreaIds : function() {
    var z = new Grid(200);
    var e = new Entity(new Vector(500,500), 'TestCent',1);
    var ee = new Entity(new Vector(-233,500), 'TestCent',2);
    var nee = new Entity(new Vector(2000,2000), 'Notthis',3)
    z.addEntity(e,function(){});
    z.addEntity(ee,function(){});
    z.addEntity(nee,function(){});
    z.update();    
    var a = z.getAreaIds(new Vector(0,0),1000, function(err,d) {
      console.log(d);
      assert.ok(d.indexOf(e.id) != -1);
      assert.ok(d.indexOf(ee.id) != -1);
      assert.ok(d.indexOf(nee.id) == -1)
      
    });
  },
  getAreaKeys : function() {
    var z = new Grid(1000),
        k = Grid._key,
        cs = 1000,
        keys = [ k(-1000,-1000,cs),
                 k(0,-1000,cs),
                 k(1000,-1000,cs),
                 k(-1000, 0,cs),
                 k(0,0,cs),
                 k(1000,0,cs),
                 k(-1000,1000,cs),
                 k(0,1000,cs),
                 k(1000,1000,cs)
               ];
    //Check that all expected keys are actually returned and no more
    z.getAreaKeys(new Vector(0,0),1000,function(err,d) {      
        for(var key in keys) {
          thisk = keys[key];
          assert.ok(d.indexOf(thisk) != -1);
        }      

        assert.equal(d.length,keys.length);
    });
  },
  getAreaIds : function() {
    var  z = new Grid(1000),
         fk = Grid._key,
         cs = 1000,
         active = [];
    
    var pe = new Entity(new Vector(0,0), 'Entity', 123213123); 
    
    //Create a bunch of npcs in the 0,0 AOI
    for(var i = 0; i< 500; i++) {
      var x = Math.floor(Math.random()*1000)-1000,
          y = Math.floor(Math.random()*1000)-1000,
        pos = new Vector(x,y),
          e = new Entity(pos, 'Entity' + i, i); 
      z.addEntity(e,function(){});
    }
    
    z.addEntity(pe, function() {});
    active.push(pe.id);
    z.update();
    
    function getAOIS() {
      //Get ids for AOI
      z.getAreaIds(z.ent[pe.id].pos,1000, function(err, ret){
        //Check that ALL entities in zone are in AOI
        //AOI length should be 6
        if(ret.length < 6) {
          //Which entities are missing?
          var missing = [];
          var al = active.length;
          while(al--){
            if(ret.indexOf(active[al]) == -1) {
              missing.push(active[al]);
            }
          }
          
          
          //Make sure none are missing!
          assert.ok(missing.length == 0);
          
          
          //Whats so special about them?
          //* It seems they are near an edge
          var ml = missing.length;
          while(ml--){
            
            //Replicate AABB zone stuff
            var px = z.ent[missing[ml]].pos.x,
                py = z.ent[missing[ml]].pos.y,
                dist = z.ent[missing[ml]].rad,
                distdist = dist+dist,
                lolid = z.ent[missing[ml]].id;
            
            var co = [px - distdist, py - distdist,
                      px + distdist, py - distdist,
                      px - distdist, py + distdist,
                      px + distdist, py + distdist];
             
             var c1 = Grid._key(co[0],co[1],cs);
             var c2 = Grid._key(co[2],co[3],cs);
             var c3 = Grid._key(co[4],co[5],cs);
             var c4 = Grid._key(co[6],co[7],cs);
             
             //console.log(c1,c2,c3,c4);
             
             //Are these entities in their zones??
             var z1 = z.grid[c1],
                 z1l = z1.length;
             var z2 = z.grid[c2],
                 z2l = z2.length;
             var z3 = z.grid[c3],
                 z3l = z3.length;
             var z4 = z.grid[c4],
                 z4l = z4.length;
             
             var iz1 = false ,iz2 = false ,iz3 = false ,iz4 = false;   
             
             while(z1l--) {
               var iii = z1[z1l].id;
               if (lolid == iii) iz1 = true;
             }
             
             while(z2l--) {
               var iii = z2[z2l].id;
               if (lolid == iii) iz2 = true;
             }
             
             while(z3l--) {
               var iii = z3[z3l].id;
               if (lolid == iii) iz3 = true;
             }
             
             while(z4l--) {
               var iii = z4[z4l].id;
               if (lolid == iii) iz4 = true;
             }
             
             
             //Make sure zone assignment is correct.
             assert.ok(iz1);
             assert.ok(iz2);
             assert.ok(iz3);
             assert.ok(iz4);
             
             //Ok so wtf
            
          }
        }
          
        
      });
    };
    
    getAOIS();
    
    //Now do 1000 update loops and recheck AOI for each loop
    var nloop = 1000;
    while(nloop--){
      var ac = active.length;
      z.update();
      getAOIS();
    }
  },
  keyIntegrity : function() {
    function newKey(x,y,c){
      return (x << 16) ^ y;
    }
    console.log("Running key integrity test");
    var z = new Grid("test",1000);
    var max = Math.pow(2,16);
    var min = -max;
    fk = newKey;
    var keys = [];
    while (max--){
      min++;
      
      if (max % 10000 == 0) { console.log(max,min);}
      
     var k = fk(max,min,1000);
     if (keys.indexOf(k) == -1) { 
       keys.push(k) 
     } else { 
       console.log(keys);
       assert.ok(false, "Duplicate key " + k + " at " + max + "," + min);
       
     }
    }
  }

};
