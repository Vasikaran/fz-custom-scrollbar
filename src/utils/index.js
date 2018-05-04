export let smoothScroll = options => {
  let {
    endPoint = 0,
    speed = 500,
    duration = null,
    onComplete = false,
    cancelOnUserAction = false,
    element
  } = options;

  let { scrollTop: initialScrollPosition } = element;
  let diff = endPoint - initialScrollPosition;
  let startingTime = Date.now();
  let requestId = null;

  let scrollDuration = Math.abs(Math.round(diff / 1000 * speed));
  if (duration && scrollDuration > duration) {
    scrollDuration = duration;
  }

  let handleUserAction;
  let removeListeners = () => {
    element.removeEventListener('wheel', handleUserAction);
    element.removeEventListener('touchstart', handleUserAction);

    if (cancelOnUserAction) {
      element.removeEventListener('keydown', handleUserAction);
      element.removeEventListener('mousedown', handleUserAction);
    } else {
      element.removeEventListener('scroll', handleUserAction);
    }
  };

  if (cancelOnUserAction) {
    handleUserAction = () => {
      removeListeners();
      cancelAnimationFrame(requestId);
    };
    element.addEventListener('keydown', handleUserAction);
    element.addEventListener('mousedown', handleUserAction);
  } else {
    handleUserAction = event => {
      event.preventDefault();
    };
    element.addEventListener('scroll', handleUserAction);
  }

  element.addEventListener('wheel', handleUserAction);
  element.addEventListener('touchstart', handleUserAction);

  let step = () => {
    let timeDiff = Date.now() - startingTime;
    let t = timeDiff / scrollDuration - 1;
    let easing = t * t * t + 1;
    let scrollPosition = Math.round(initialScrollPosition + diff * easing);
    if (timeDiff < scrollDuration && scrollPosition !== endPoint) {
      element.scrollTop = scrollPosition;
      requestId = requestAnimationFrame(step);
    } else {
      element.scrollTop = endPoint;
      cancelAnimationFrame(requestId);
      removeListeners();
      typeof onComplete === 'function' && onComplete();
    }
  };
  requestId = requestAnimationFrame(step);
};
