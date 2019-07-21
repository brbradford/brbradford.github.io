function randomFloat(min, max) {
    return Math.random() * (max-min) + min;
}

function randomInt(min, max) {
    return Math.floor(Math.random() * ((max + 1)-min)) + min;
}

function random(min, maxExclusive) {
    return Math.floor(Math.random() * (maxExclusive-min) + min);
}

function randomColor() {
    var r = Math.floor(random(150, 255));
    var g = Math.floor(random(150, 255));
    var b = Math.floor(random(150, 255));
    return `rgb(${r},${g},${b})`;
}

var neonColors = ['#ff0099','#f3f315','#83f52c','#ff6600','#6e0dd0'];
function randomNeonColor() {
    return neonColors[random(0, neonColors.length)];
}

function point(x, y, z) {
    return new THREE.Vector3(x, y, z);
}

function randomBoxPoint(boxCenter, radius) {
    const point = boxCenter.clone();
    point.x += randomFloat(-radius, radius);
    point.y += randomFloat(-radius, radius);
    point.z += randomFloat(-radius, radius);

    return point;
}

function randomSpherePoint(sphereCenterVec3, radius){
    var x0 = sphereCenterVec3.x;
    var y0 = sphereCenterVec3.y;
    var z0 = sphereCenterVec3.z;
    var u = Math.random();
    var v = Math.random();
    var theta = 2 * Math.PI * u;
    var phi = Math.acos(2 * v - 1);
    var x = x0 + (radius * Math.sin(phi) * Math.cos(theta));
    var y = y0 + (radius * Math.sin(phi) * Math.sin(theta));
    var z = z0 + (radius * Math.cos(phi));
    return new THREE.Vector3(x, y, z);
}

function log(msg, append= true) {
    if (typeof(msg) !== 'string') {
        msg = JSON.stringify(msg);
    }
    var logger = document.getElementById('log');
    var txt = logger.getAttribute('value');
    logger.setAttribute('value', (append ? txt + '|' : '') + msg);
}

function removeAttribute(el, attribute) {
    setTimeout(function() {
        el.removeAttribute(attribute);
    }, 10);
}

// function randomPointInSphere(sphereCenterVec3, radius) {
//     var x1 = Math.random();
//     var x2 = Math.random();
//     var x3 = Math.random();

//     var mag = Math.sqrt(x1*x1 + x2*x2 + x3*x3);
//     x1 /= mag; x2 /= mag; x3 /= mag;

//     var point = sphereCenterVec3.clone();

//     var xDist = x1 * radius;
//     var yDist = x1 * radius;
//     var zDist = x1 * radius;
//     point.x += random(-xDist, xDist);
//     point.y += random(-yDist, yDist);
//     point.z += random(-zDist, zDist);

//     return point;
// }
        
