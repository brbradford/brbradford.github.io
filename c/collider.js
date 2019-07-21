//AFRAME.registerComponent('collider-check', {
//    dependencies: ['raycaster'],
//    init: function () {
//        this.el.addEventListener('raycaster-intersection', function (event) {
//            event.detail.els.forEach(item => {
//                if (!item.classList.contains('collidible')) {
//                    return;
//                }
//
//                //item.dispatchEvent(new Event('shot'));
//            })
//        });
//    }
//});

AFRAME.registerComponent('color-pulse', {
    init: function() {
        // const rig = document.getElementById('rig');
        // this.el.setAttribute('light', {
        //     type: 'spot',
        //     angle: 60,
        //     distance: 30,
        //     target: rig
        // });
    }
});

function shootFirework(el) {
    var firework = document.createElement('a-sphere');
    var position = el.object3D.position.clone();
    var target = position.clone();
    target.y += random(30, 60);
    target = randomSpherePoint(target, 15);
    firework.setAttribute('radius', '.5');
    var color = randomNeonColor();
    firework.setAttribute('material', 'color', color);
    firework.setAttribute('position', position);
    firework.setAttribute('move', {speed: 25, target});
    // firework.setAttribute('light', {
    //     type: 'ambient',
    //     color,
    //     intensity: 1
    // });
    firework.addEventListener('arrived', () => {
        firework.setAttribute('explode', {
            distance: random(20, 30),
            pieces: 50,
            speed: 25
        });
    });
    el.parentNode.appendChild(firework);
}

AFRAME.registerComponent('firework-factory', {
    init: function () {
        var el = this.el;
        el.classList.add('collidible');
        var interval;
        el.addEventListener('raycaster-intersected', () => {
            //interval = setInterval(() => {
                shootFirework(el);
            // }, 500);
            // shootFirework(el);
        });

        el.addEventListener('raycaster-intersected-cleared', () => {
            if (interval) {
                clearInterval(interval);
                interval = null;
            }
        });
    }
});

AFRAME.registerComponent('portal', {
    init: function() {
        var el = this.el;
        el.setAttribute('material', 'color', 'orange');
        el.setAttribute('radius', .5);
        var camera = document.getElementById('rig');
        el.classList.add('collidible');
        el.addEventListener('raycaster-intersected', function () {
            var target = el.object3D.position.clone();
            //target.y -= 2;
            camera.setAttribute('move', {
                speed: 20,
                target,
                //spin: true
            });
        });
    }
});

AFRAME.registerComponent('trigger-shoot', {
    init: function () {
        var el = this.el;
        el.addEventListener('triggerdown', function () {
            el.setAttribute('raycaster', 'objects: .collidible; far: 80;');
        });
        el.addEventListener('triggerup', function () {
            el.setAttribute('raycaster', 'objects: .collidible; far: .1;');
        });
    }
});

AFRAME.registerComponent('fly-up', {
    init: function () {
        var el = this.el;
        var camera = document.getElementById('rig');
        var position = camera.object3D.position.clone();
        var target = position.clone();
        el.addEventListener('gripdown', function() {
            target.y = 200;
            camera.setAttribute('move', {
                speed: 5,
                target
            });
        });
        el.addEventListener('gripup', function(){
            camera.removeAttribute('move');
        });
    }
});

AFRAME.registerComponent('fly-down', {
    init: function () {
        var el = this.el;
        var camera = document.getElementById('rig');
        const origPosition = camera.object3D.position.clone();
        el.addEventListener('gripdown', function(){
            if (camera.object3D.position.y === origPosition.y) {
                return;
            }
            camera.setAttribute('move', {
                speed: 5,
                target: origPosition
            });
        });
        el.addEventListener('gripup', function(){
            camera.removeAttribute('move');
        });
        el.addEventListener('thumbstickdown', function() {
            target.y = 0;
            camera.setAttribute('move', {
                speed: 40,
                target: origPosition
            });
        });
        el.addEventListener('xbuttondown', function() {
            target.y = 0;
            camera.setAttribute('move', {
                speed: 40,
                target: origPosition
            });
        });
        el.addEventListener('ybuttondown', function() {
            target.y = 0;
            camera.setAttribute('move', {
                speed: 40,
                target: origPosition
            });
        });
    }
});

var spinning = false;
AFRAME.registerComponent('spinner', {
    init: function () {
        var el = this.el;
        el.addEventListener('gripdown', function(event){
            spinning = true;
        });
        el.addEventListener('gripup', function(event){
            spinning = false;
        });
    },
    tick: function () {
        if (!spinning) {
            return;
        }
        var camera = document.getElementById('rig');
        //log(!!camera);
        camera.object3D.rotation.y -= .005;
    }
});


AFRAME.registerComponent('launcher', {
    schema: { type: 'string' },
    init: function () {
        var height = 20;

        var el = this.el;
        el.classList.add('collidible');
        var obj = document.getElementById(this.data);
        
        el.addEventListener('raycaster-intersected', function () {
            el.removeAttribute('position');
            var target = obj.object3D.position.clone();
            var origY = target.y;
            target.y += height;
            obj.setAttribute('move', {
                speed: 10,
                target
            });
            setTimeout(() => {
                target = obj.object3D.position.clone();
                target.y = origY;
                obj.setAttribute('move', {
                    speed: 40,
                    target
                });
            }, 30000);
        });
    }
});

AFRAME.registerComponent('sun-factory', {
    init: function () {
        var el = this.el;
        el.classList.add('collidible');
        this.el.addEventListener('raycaster-intersected', function(event) {
            var sky = document.getElementsByTagName('a-sky')[0];
            var p = sky.getAttribute('material').sunPosition;
            p.x = Math.random(-5, 5);
            //p.y = random(-100, 100);
            p.z = random(-5, 5);
            //log(JSON.stringify(p), false);
            sky.setAttribute('material', 'sunPosition', `${p.x} ${p.y} ${p.z}`);
            return;
            var sun = document.createElement('a-sphere');
            var position = el.object3D.position.clone();
            var target = position.clone();
            target.y = 100;
            target.z = -100;
            sun.setAttribute('radius', 5);
            sun.setAttribute('material', 'color', 'orange');
            sun.setAttribute('position', position)
            sun.setAttribute('move', {speed: 30, target});
            sun.setAttribute('light', {
                type: 'ambient',
                color: '#fff',
                intensity: 1,
                distance: 200,
                decay: 2
            });
            document.getElementById('scene').appendChild(sun);
        });
    }
});

// cloud factory
// balls rolling towards you with a pusher raycaster
// blow up objects by lasering it... changes hotter color and then kaboom

AFRAME.registerComponent('balloon-factory', {
    init: function () {
        this.el.classList.add('collidible');
        var item = this.el;
        this.el.addEventListener('raycaster-intersected', function() {
            var balloon = document.createElement('a-sphere');
            var position = item.object3D.position.clone();
            var target = position.clone();
            // target.y += 30;
            // target = randomSpherePoint(target, 10);
            target.y = 50 + random(-30, 30);
            target.x += random(-30, 30);
            target.z += random(-30, 30);
            balloon.setAttribute('radius', random(1, 5)/2);
            balloon.setAttribute('material', 'color', randomNeonColor());
            balloon.setAttribute('position', position);
            balloon.setAttribute('shootable', {
                onShoot: 'explode'
            });
            balloon.setAttribute('move', {speed: 2, target});
            document.getElementById('scene').appendChild(balloon);
        });
    }
});

function createTargets(el, launchInterval, count, onComplete) {
    var balloon = document.createElement('a-box');
    var position = el.object3D.position.clone();
    var size = .5;
    balloon.setAttribute('height', size);
    balloon.setAttribute('width', size);
    balloon.setAttribute('depth', size);
    var target = position.clone();
    target.y += random(50, 100);
    target.z -= random(50, 100);
    target.x += random(-20, 20);
    //balloon.setAttribute('radius', '.5');
    balloon.setAttribute('material', 'color', 'blue');
    balloon.setAttribute('position', position);
    balloon.setAttribute('move', {speed: 40, spin: true, target});
    balloon.addEventListener('arrived', () => {
        balloon.setAttribute('move', { 
            spin: true,
            speed: random(15, 30), 
            target: new THREE.Vector3(),
            removeOnArrival: true
        });
        balloon.setAttribute('shootable', {
            onShoot: 'explode'
        });
    });

    document.getElementById('scene').appendChild(balloon);
    count--;
    if (count <=  0) {
        onComplete();
    } else {
        setTimeout(() => { 
            createTargets(el, launchInterval, count, onComplete);
        }, launchInterval);
    }
}

AFRAME.registerComponent('target-practice', {
    init: function () {
        var count = 50;
        var launchInterval = 200;
        this.el.classList.add('collidible');
        var el = this.el;
        var enabled = true;
        el.addEventListener('raycaster-intersected', function() {
            if (enabled) {
                enabled = false;
                el.setAttribute('material', 'color', 'red');
                createTargets(el, launchInterval, count, () => {
                    setTimeout(() => { 
                        enabled = true;
                        el.setAttribute('material', 'color', 'white');
                    }, 30000);
                });
            }
        });
    }
});

AFRAME.registerComponent('shootable', {
    schema: {
        onShoot: { type: 'string' },
        params: { type: 'string', default: '' },
        shootOnce: { type: 'boolean', default: true }
    },
    init: function() {
        var item = this.el;
        var itemData = this.data;
        this.el.addEventListener('raycaster-intersected', function () {
            if (itemData.shootOnce) {
                item.removeAttribute('shootable');
            }
            item.setAttribute(itemData.onShoot, itemData.params);
        });
        setTimeout(function() {
            item.classList.add('collidible');
        }, 2000);
    }
})

AFRAME.registerComponent('explode', {
    schema: {
        distance: { type: 'int', default: 10 },
        speed: { type: 'int', default: 20 },
        pieces: { type: 'int', default: 20 }
    },
    init: function () {
        var el = this.el;
        el.removeAttribute('move');
        el.classList.remove('collidible');
        var particles = [];
        for (var i = 0; i < this.data.pieces; i++) {
            var particle = document.createElement(el.tagName); //el.cloneNode();

            //particle.setAttribute('position', el.object3D.position.clone());
            particle.object3D = el.object3D.clone();
            particle.setAttribute('material', el.getAttribute('material'));
            particle.setAttribute('radius', el.getAttribute('radius'));
            //particle.setAttribute('light', el.getAttribute('light'));
            particle.object3D.scale.x = .3;
            particle.object3D.scale.y = .3;
            particle.object3D.scale.z = .3;

            var distance = this.data.distance;
            var speed = this.data.speed;
            particle.setAttribute('random-move', { 
                distance,
                removeOnArrival: true,
                speed                
            });
            particles.push(particle);
        }

        particles.forEach((particle) => {
            el.parentNode.appendChild(particle);
        });
        el.parentNode.removeChild(el);
    }
});

AFRAME.registerComponent('my-position', {
    schema: { type: 'vec3'},
    init: function() {
        var degrees = this.data.x;
        var height = this.data.y;
        var distance = this.data.z;
        
        if (degrees < 0) {
            degrees += 360;
        }
        var adjDegrees = degrees - 90;
          
        var x = distance*Math.cos(Math.PI/180*adjDegrees);
        var z = distance*Math.sin(Math.PI/180*adjDegrees);
        var y = height;
        this.el.object3D.position.x = x;
        this.el.object3D.position.y = y;
        this.el.object3D.position.z = z;
    }
});

AFRAME.registerComponent('random-move', {
    schema: {
        distance: { type: 'int', default: 20 },
        removeOnArrival: { type: 'boolean', default: false },
        speed: { type: 'int', default: 20 }
    }, 
    init: function () {
        var removeOnArrival = this.data.removeOnArrival;
        var speed = this.data.speed;
        var target = randomSpherePoint(this.el.object3D.position, this.data.distance);
        this.el.removeAttribute('random-move');
        this.el.setAttribute('move', { removeOnArrival, speed, target });
    }
})

AFRAME.registerComponent('move', {
    schema: {
        spin: { type: 'boolean', default: false },
        removeOnArrival: { type: 'boolean', default: false },
        speed: { type: 'int', default: 10 },
        target: { type: 'vec3', default: new THREE.Vector3()}
    },
    init: function () {
        this.directionVec3 = new THREE.Vector3();
    },
    tick: function (time, timeDelta) {
        var directionVec3 = this.directionVec3;

        // Grab position vectors (THREE.Vector3) from the entities' three.js objects.
        var targetPosition = this.data.target;
        var currentPosition = this.el.object3D.position;

        // Subtract the vectors to get the direction the entity should head in.
        directionVec3.copy(targetPosition).sub(currentPosition);

        // Calculate the distance.
        var distance = directionVec3.length();

        // Don't go any closer if a close proximity has been reached.
        if (distance < 1) { 
            this.el.removeAttribute('move');
            this.el.dispatchEvent(new Event('arrived'));
            if (this.data.removeOnArrival) {
                this.el.parentNode.removeChild(this.el);
            }
            this.el.object3D.position.x = targetPosition.x;
            this.el.object3D.position.y = targetPosition.y;
            this.el.object3D.position.z = targetPosition.z;
        }

        // Scale the direction vector's magnitude down to match the speed.
        var factor = this.data.speed / distance;
        ['x', 'y', 'z'].forEach(function (axis) {
            directionVec3[axis] *= factor * (timeDelta / 1000);
        });

        // Translate the entity in the direction towards the target.
        this.el.object3D.position.x = currentPosition.x + directionVec3.x;
        this.el.object3D.position.y = currentPosition.y + directionVec3.y;
        this.el.object3D.position.z = currentPosition.z + directionVec3.z;

        if (this.data.spin) {
            this.el.object3D.rotation.x += .02;
            this.el.object3D.rotation.y += .02;
        }
    }
});

AFRAME.registerComponent('laser-shooter', {
    init: function() {
        var el = this.el;
        el.setAttribute('light', {
            type: 'ambient',
            color: '#fff',
            intensity: .5
        });
        var position = el.object3D.position;
        setInterval(() => {
            var laser = document.createElement('a-cylinder');
            laser.setAttribute('radius', .03);
            laser.setAttribute('height', 2);
            var pp = position.clone();
            pp.y += 3;
            laser.setAttribute('position', pp);
            // laser.setAttribute('rotation', '90 0 0');
            laser.setAttribute('material', 'color', randomNeonColor());

            var target = new THREE.Vector3(random(-5, 5), -1, random(-5, 5));
            var p1 = position;
            var p2 = target;
            //var rotation = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
            var rotationY = Math.atan2(p2.x-p1.x, p2.z-p1.z) * 180 / Math.PI;

            laser.setAttribute('light', {
                type: 'point',
                color: '#fff',
                intensity: .5,
                distance: 5,
                decay: 2
            });
            laser.setAttribute('rotation', `90 ${rotationY} 0`);
            laser.setAttribute('move', {
                speed: 40,
                target,
                removeOnArrival: true
            });
            el.parentNode.appendChild(laser);
        }, 2000);
    }
});
