// non-exploding balloons with kill switch to denotate all
// fix flying controls
// add score to target practice
// balloon that gets bigger and bigger
// some kind of lightning
// shooting on parabolic
// shoot lasers from controllers
// parachute down and shoot things game
// random effect factory
    // blast a circle as a firework
    // fireflies, or embers raining down
    //rainbow?
    // out of control balloon
    // hot air balloon... basket falls

let miscIndex = 0;
miscFactory = (el) => {
    onLaserEnter({el, handler: () => {
        switch(miscIndex) {
            case 0: 
                createDiscFirework(el.object3D.position);
                miscIndex++;
                break;
            case 1: 
                createDiscFirework(el.object3D.position);
                miscIndex++;
                break;
            case 2:
                createHotAirBalloon(el.object3D.position);
                miscIndex++;
                break;
            case 3:
                createMegaBalloonBurst(el.object3D.position);
                miscIndex++;
                break;
            case 4:
                fillTheSkyWithBalloons(el.object3D.position);
                miscIndex = 0;
                break;
            default:
                createDiscFirework(el.object3D.position);
                break;
        }
    }});
};

createHotAirBalloon = (position) => {
    const tasks = [
        () => createFromHtml({
            position,
            html: `<a-entity>
                    <a-sphere radius="4" position="0 8 0" material="color: #ff4dcf;"></a-sphere>
                    <a-box scale="2 2 2" material="color: #d18741;"></a-box>
                   </a-entity>`
        }),
        ({el}) => moveToPoint({
            el,
            speed: 3,
            target: randomSpherePoint(
                el.object3D.position.clone().add(point(0, 100, 0)),
                50
            ),
        }),
        ({el}) => removeFromScene({el})

    ];

    return execute(tasks);
}

createMegaBalloonBurst = (position) => {
    const count = 100;
    const burstSpeed = 10000;
    for (var i = 0; i < count; i++) {
        setTimeout(() => {
            createExplodingBalloon(position);
        }, i * (burstSpeed / count) )
    }
}

createExplodingBalloon = (position) => {
    const tasks = [
        () => create({
            entity: 'a-sphere',
            color: randomNeonColor(),
            position,
            scale: randomFloat(.5, 2)
        }),
        ({el}) => moveToPoint({
            el,
            speed: 5,
            target: randomSpherePoint(
                el.object3D.position.clone().add(point(0, 60, -20)),
                30
            ),
        }),
        ({el}) => explode({el})
    ];

    return execute(tasks);
}

fillTheSkyWithBalloons = (position) => {
    const count = 1000;
    const burstSpeed = 15000;
    for (var i = 0; i < count; i++) {
        setTimeout(() => {
            createBalloon(position);
        }, i * (burstSpeed / count) )
    }
};

createBalloon = (position) => {
    const tasks = [
        () => create({
            entity: 'a-sphere',
            color: randomNeonColor(),
            position,
            scale: randomFloat(.5, 2)
        }),
        ({el}) => explodeOnLaser({el}),
        ({el}) => moveToPoint({
            el,
            speed: randomFloat(2, 4),
            target: randomBoxPoint(
                el.object3D.position.clone().add(point(0, 50, 0)),
                30
            ),
        }),
    ];

    return execute(tasks);
};

balloonFactory = (el) => {
    onLaserEnter({el, handler: () => {
        createBalloon(el.object3D.position);
        //document.getElementById('leftController').components.haptics.pulse();
    }});
};

balloonBurstFactory = (el) => {
    onLaserEnter({el, handler: () => {
        if (el.hasAttribute('disabled')) {
            return;
        }
        const origColor = el.getAttribute('material').color;
        el.setAttribute('disabled', true);
        el.setAttribute('material', 'color', 'red');
        createMegaBalloonBurst(el.object3D.position)
        setTimeout(() => {
            el.removeAttribute('disabled');
            el.setAttribute('material', 'color', origColor);
        }, 30000);
    }});
};

createDiscFirework = (position) => {
    const tasks = [
        () => create({
            entity: 'a-cylinder',
            color: randomNeonColor(),
            position,
            scale: .5
        }),
        ({el}) => radius({el, radius: .1}),
        ({el}) => height({el, height: .8}),
        ({el}) => moveToPoint({
            el,
            speed: 25,
            target: randomSpherePoint(
                el.object3D.position.clone().add(point(0, randomFloat(40, 70), 0)),
                5
            ),
        }),
        ({el}) => animate({
            el,
            attribute: 'radius',
            endValue: 40,
            time: 500
        }),
        ({el}) => animate({
            el,
            attribute: 'radius',
            endValue: 0,
            time: 1000
        }),
        ({el}) => animate({
            el,
            attribute: 'radius',
            endValue: 500,
            time: 500
        }),
        ({el}) => explode({el})
    ];

    return execute(tasks);
};

createFirework = (position) => {
    const tasks = [
        () => create({
            entity: 'a-cylinder',
            color: randomNeonColor(),
            position,
            scale: .5
        }),
        ({el}) => radius({el, radius: .1}),
        ({el}) => height({el, height: .8}),
        ({el}) => moveToPoint({
            el,
            speed: 25,
            target: randomSpherePoint(
                el.object3D.position.clone().add(point(0, randomFloat(40, 70), 0)),
                15
            ),
        }),
        ({el}) => explode({el})
    ];

    return execute(tasks);
};

discfireworkFactory = (el) => {
    onLaserEnter({el, handler: () => 
        createDiscFirework(el.object3D.position)})
};
fireworkFactory = (el) => {
    onLaserEnter({el, handler: () => 
        createFirework(el.object3D.position)})
};

createFlyingTarget = (position) => {
    const tasks = [
        () => create({
            entity: 'a-box',
            color: 'blue',
            position,
            scale: .5
        }),
        ({el}) => moveToPoint({
            el,
            speed: 40,
            target: randomBoxPoint(
                el.object3D.position.clone().add(
                    point(
                        randomFloat(-20, 50), 
                        randomFloat(40, 70), 
                        -randomFloat(150, 200)
                    )
                ),
                1
            ),
        }),
        ({el}) => explodeOnLaser({el}),
        ({el}) => moveToPoint({
            el,
            speed: randomInt(15, 40),
            spin: true,
            target: point(0, 0, 0)
        }),
        ({el}) => removeFromScene({el})
    ];

    return execute(tasks);
};

flyingTargetFactory = (el) => {
    onLaserEnter({
        el, 
        handler: () => {
            if (el.hasAttribute('disabled')) {
                return;
            }
            const origColor = el.getAttribute('material').color;
            el.setAttribute('disabled', true);
            el.setAttribute('material', 'color', 'red');
            for (var i = 0; i < 50; i++) {
                setTimeout(() => {
                    createFlyingTarget(el.object3D.position);
                }, i*50);
            }

            setTimeout(() => {
                el.removeAttribute('disabled');
                el.setAttribute('material', 'color', origColor);
            }, 20000);
        }
    });
};

createLaser = (position) => {
    const tasks = [
        () => create({
            entity: 'a-cylinder',
            color: randomNeonColor(),
            position,
        }),
        ({el}) => radius({el, radius: .06}),
        ({el}) => height({el, height: 15}),
        ({el}) => moveToPoint({
            el,
            speed: 50,
            target: el.object3D.position.clone().add(
                point(
                    randomFloat(-2, 2),
                    60, 
                    randomFloat(-2, 2)
                )                
            )
        }),
        ({el}) => removeFromScene({el})
    ];

    return execute(tasks);
}

createLaserBurst = (position) => {
    for (var i = 0; i < 50; i++) {
        const ii = i;
        setTimeout(() => {
            for (var j = 0; j < ii && j < 30; j++) {
                createLaser(position);
            }
        }, i*300)
    }
};

laserBurstFactory = (el) => {
    onLaserEnter({el, handler: () => {
        if (el.hasAttribute('disabled')) {
            return;
        }
        const origColor = el.getAttribute('material').color;
        el.setAttribute('disabled', true);
        el.setAttribute('material', 'color', 'red');
        
        createLaserBurst(el.object3D.position);
        
        setTimeout(() => {
            el.removeAttribute('disabled');
            el.setAttribute('material', 'color', origColor);
        }, 25000);
    }});
};

parachute = (el) => {
    const origPosition = el.object3D.position.clone();
    const tasks = [
        () => {
            for (var i = 0; i < 30; i++) {
                setTimeout(() => {
                    createBalloon(origPosition);
                }, i*200);
            }

            for (var i = 0; i < 30; i++) {
                setTimeout(() => {
                    createBalloon(origPosition);
                }, 7000 + i*200);
            }

            return Promise.resolve();
        },
        //() => { delay({ delay: 1000 })},
        // () => {
        //     for (var i = 0; i < 50; i++) {
        //         setTimeout(() => {
        //             createFirework(origPosition);
        //         }, 4000 + i*50);
        //     }
        //     return Promise.resolve();
        // },
        () => { 
            setTimeout(() => {
                createLaserBurst(origPosition);
            }, 5000);
            
            return Promise.resolve();
        },
        () => {
            for (var i = 0; i < 50; i++) {
                setTimeout(() => {
                    createFlyingTarget(origPosition);
                }, 35000 + i*50);
            }
            return Promise.resolve();
        },
        () => moveToPoint({
            el,
            speed: 40,
            target: el.object3D.position.clone().add(
                point(
                    0,
                    100, 
                    0
                )                
            )
        }),
        ({el}) => moveToPoint({
            el,
            speed: 2,
            target: origPosition                
        }),
    ];

    return execute(tasks);
}

xFactory = (el) => {
    onLaserEnter({el, handler: () => {
        const rig = document.getElementById('rig');
        parachute(rig);
    }});
};

createExplosionParticle = (explodingEl) => {
    const tasks = [
        () => create({
            entity: 'a-circle', //explodingEl.tagName,
            position: explodingEl.object3D.position,
            scale: explodingEl.object3D.scale.x * .3,
        }),
        ({el}) => {
            el.setAttribute('material', explodingEl.getAttribute('material'));
            el.setAttribute('material', 'side', 'double');
            el.setAttribute('rotation', '-90 0 0');
            return Promise.resolve({el});
        },
        ({el}) => moveToPoint({
            el,
            speed: 20,
            target: randomSpherePoint(el.object3D.position, 20),
        }),
        ({el}) => removeFromScene({el})
    ];

    return execute(tasks);
}

explode = ({el}) => {
    const tasks = [
        () => {
            for (var i = 0; i < 25; i++) {
                createExplosionParticle(el);
            }
            return Promise.resolve({el}); // We don't care to wait until the explosion is done.
        },
        ({el}) => removeFromScene({el})
    ];

    return execute(tasks);
}
