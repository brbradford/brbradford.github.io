
const onEvent = ({el, event, handler}) => {
    el.addEventListener(event, handler);
    return Promise.resolve({el});
};

const onLaserEnter = ({el, handler}) => {
    setTimeout(() => {
        // Don't let it explode as soon as it's created.
        el.classList.add('collidible');
    }, 2000);

    return onEvent({
        el, 
        event: 'raycaster-intersected', 
        handler
    });
};