const tickHandlers = [];
const addTickHandler = (tickHandler) => {
    tickHandlers.push(tickHandler);
};
const removeTickHandler = (tickHandler) => {
    tickHandlers.splice(tickHandlers.indexOf(tickHandler), 1);
};
AFRAME.registerComponent('macro-scene', {
    tick: function (time, timeDelta) {
        tickHandlers.forEach((handler) => handler(time, timeDelta));
    }
});

AFRAME.registerComponent('macro', {
    schema: { type: 'string' },
    init: function () {
        const macro = this.data;
        window[macro](this.el);
    }
});

// https://decembersoft.com/posts/promises-in-serial-with-array-reduce/
const execute = (tasks) => {
    return tasks.reduce((promiseChain, currentTask) => {
        return promiseChain.then(chainResults =>
            currentTask(chainResults).then(currentResult => 
                ({ ...currentResult })
            ));
    }, Promise.resolve({}));
};

const animate = ({el, attribute, endValue, time}) => new Promise((resolve, reject) => {
    let currentValue = Number(el.getAttribute(attribute));
    const shrinking = endValue < currentValue;
    const valuePerMillisecond = (endValue - currentValue) / time;
    const tick = (time, timeDelta) => {
        const currentValue = Number(el.getAttribute(attribute));
        if ((!shrinking && (currentValue >= endValue)) || (shrinking && (currentValue <= endValue))) {
            el.setAttribute(attribute, endValue);
            removeTickHandler(tick);
            resolve({el});
            return;
        }
        const valueToAdd = timeDelta * valuePerMillisecond;
        el.setAttribute(attribute, currentValue + valueToAdd);
    };
    addTickHandler(tick);
});

const createFromHtml = ({html, position}) => new Promise((resolve, reject) => {
    var div = document.createElement('div');
    div.innerHTML = html;
    const el = div.firstChild;
    const onLoaded = () => {
        el.removeEventListener('loaded', onLoaded);
        el.object3D.position.copy(position);
        resolve({el});
    }
    el.addEventListener('loaded', onLoaded);
    document.querySelector('a-scene').appendChild(el);
});

const create = ({entity, color, position, scale }) => new Promise((resolve, reject) => {
    const el = document.createElement(entity);
    const onLoaded = () => {
        el.removeEventListener('loaded', onLoaded);
        el.object3D.position.copy(position);
        if (color) {
            el.setAttribute('material', 'color', color);
        }
        if (scale) {
            el.object3D.scale.x = scale;
            el.object3D.scale.y = scale;
            el.object3D.scale.z = scale;
        }
        
        resolve({el});
    };
    el.addEventListener('loaded', onLoaded);
    document.querySelector('a-scene').appendChild(el);
});

const delay = ({el, delay}) => new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve({el});
    }, delay);
});

const explodeOnLaser = ({el}) => {
    return onLaserEnter({
        el,
        handler: () => explode({el})
    })
};

const height = ({el, height}) => {
    el.setAttribute('height', height);
    return Promise.resolve({el});
}

const position = ({el, position}) => new Promise((resolve, reject) => {
    el.object3D.position.copy(position);
    debugger;
    resolve({el});
});

const radius = ({el, radius}) => {
    el.setAttribute('radius', radius);
    return Promise.resolve({el});
}

const removeFromScene = ({el}) => {
    el.parentNode.removeChild(el);
    return Promise.resolve({});
};

const scale = ({el, min, max}) => new Promise((resolve, reject) => {
    const scale = randomFloat(min, max);
    el.object3D.scale.x = scale;
    el.object3D.scale.y = scale;
    el.object3D.scale.z = scale;
    resolve({el});
});

const shootUp = ({el, height, speed}) => {
    const startPoint = el.object3D.position.clone();
    const target = startPoint.clone().add(new THREE.Vector3(0, height, 0));
    
    return moveToPoint({el, target, speed});
};

const moveToPoint = ({el, target, speed, spin = false}) => new Promise((resolve, reject) => {
    const tick = (time, timeDelta) => {
        const currentPosition = el.object3D.position;
        const targetPosition = target.clone();
        
        // Subtract the vectors to get the direction the entity should head in.
        const directionVec3 = targetPosition.clone().sub(currentPosition);

        // Calculate the distance.
        var distance = directionVec3.length();

        // Don't go any closer if a close proximity has been reached.
        if (distance < 1) { 
            el.object3D.position = targetPosition;
            removeTickHandler(tick);
            resolve({el});
            return;
        }

        // Scale the direction vector's magnitude down to match the speed.
        var factor = speed / distance;
        ['x', 'y', 'z'].forEach(function (axis) {
            directionVec3[axis] *= factor * (timeDelta / 1000);
        });

        // Translate the entity in the direction towards the target.
        const nextPosition = currentPosition.add(directionVec3);
        el.object3D.position = nextPosition;

        if (spin) {
            el.object3D.rotation.x += .02;
            el.object3D.rotation.y += .02;
        }
    };
    addTickHandler(tick);
});

const curve = ({el, controlPoint, endPoint}) => new Promise((resolve, reject) => {
    const startPoint = el.object3D.position.clone();
    const middlePoint = controlPoint.add(startPoint);
    const finalPoint = endPoint.add(startPoint);
    const curve = new THREE.QuadraticBezierCurve3(startPoint, middlePoint, finalPoint);
    resolve({el, curve});
});

const upCurve = ({el, height}) => {
    var beginPoint = el.object3D.position.clone();
    var endPoint = beginPoint.clone();
    endPoint.y = height;
    var controlPoint = endPoint - beginPoint;
    return curve({el, controlPoint, endPoint});
};



// const arcCurve = ({el, angle, height, distance}) => {
//     const beginPoint = el.object3D.position.clone();
//     const x = distance*Math.cos(Math.PI/180*angle);
//     const y = 0;
//     const z = distance*Math.sin(Math.PI/180*angle);
//     const endPoint = new THREE.Vector3D(x, y, z);
//     let controlPoint = endPoint - beginPoint;
//     controlPoint.y = height;
//     return curve({el, })
// });

const move = ({el, curve, speed}) => new Promise((resolve, reject) => {
    speed *= 1000; // convert to meters per ms.
    const tick = (time, timeDelta) => {
        const currentPosition = el.object3D.position;
        const targetPosition = curve.getPoint(1);
        
        let startingGroundPosition = curve.getPoint(0);
        startingGroundPosition.y = 0;
        let currentGroundPosition = currentPosition.clone();
        currentGroundPosition.y = 0;
        let targetGroundPosition = targetPosition.clone();
        targetGroundPosition.y = 0;
        
        const totalDistance = targetGroundPosition.clone().sub(startingGroundPosition).length();
        const currentT = currentGroundPosition.clone().sub(startingGroundPosition).length() / totalDistance;
        const distanceToTravelNow = timeDelta * speed;
        const deltaT = distanceToTravelNow / totalDistance;
        const nextT = currentT + deltaT;
        if (nextT >= 1) {
            el.object3D.position = targetPosition;
            resolve({el});
            return;
        }

        const pointToMoveToNow = curve.getPoint(nextT);
        el.object3D.position = pointToMoveToNow;
    };
    addTickHandler(tick);
});

// const create = ({tagName, position, scale}) => new Promise((resolve, reject) => {
//     const el = document.createElement(tagName);
//     const onLoaded = () => {
//         el.removeEventListener('loaded', onLoaded);
//         el.object3D.position = position.clone();
//         el.object3D.scale.x = el.object3D.scale.y = el.object3D.scalez = scale;
//         resolve(el);
//     };
//     el.addEventListener('loaded', onLoaded);
//     document.querySelector('a-scene').appendChild(el);
// });
    