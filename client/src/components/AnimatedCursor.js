import React from 'react';

function useEventListener(eventName, handler, element = document) {
  const savedHandler = React.useRef();

  React.useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  React.useEffect(() => {
    const isSupported = element && element.addEventListener;
    if (!isSupported) return;

    const eventListener = (event) => savedHandler.current(event);

    element.addEventListener(eventName, eventListener);

    return () => {
      element.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element]);
}

function AnimatedCursor({
  color = '220, 90, 90',
  outerAlpha = 0.4,
  innerSize = 8,
  outerSize = 8,
  outerScale = 5,
  innerScale = 0.7,
}) {
  const cursorOuterRef = React.useRef();
  const cursorInnerRef = React.useRef();
  const requestRef = React.useRef();
  const previousTimeRef = React.useRef();
  const [coords, setCoords] = React.useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = React.useState(true);
  const [isActive, setIsActive] = React.useState(false);
  const [isActiveClickable, setIsActiveClickable] = React.useState(false);
  let endX = React.useRef(0);
  let endY = React.useRef(0);

  const onMouseMove = React.useCallback(({ clientX, clientY }) => {
    setCoords({ x: clientX, y: clientY });
    cursorInnerRef.current.style.top = clientY + 'px';
    cursorInnerRef.current.style.left = clientX + 'px';
    endX.current = clientX;
    endY.current = clientY;
  }, []);

  const animateOuterCursor = React.useCallback(
    (time) => {
      if (previousTimeRef.current !== undefined) {
        coords.x += (endX.current - coords.x) / 8;
        coords.y += (endY.current - coords.y) / 8;
        cursorOuterRef.current.style.top = coords.y + 'px';
        cursorOuterRef.current.style.left = coords.x + 'px';
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animateOuterCursor);
    },
    [coords.x, coords.y] // eslint-disable-line
  );

  React.useEffect(() => {
    requestRef.current = requestAnimationFrame(animateOuterCursor);
    return () => cancelAnimationFrame(requestRef.current);
  }, [animateOuterCursor]);

  const onMouseDown = React.useCallback(() => setIsActive(true), []);
  const onMouseUp = React.useCallback(() => setIsActive(false), []);
  const onMouseEnter = React.useCallback(() => setIsVisible(true), []);
  const onMouseLeave = React.useCallback(() => setIsVisible(false), []);

  useEventListener('mousemove', onMouseMove, document);
  useEventListener('mousedown', onMouseDown, document);
  useEventListener('mouseup', onMouseUp, document);
  useEventListener('mouseenter', onMouseEnter, document);
  useEventListener('mouseleave', onMouseLeave, document);

  React.useEffect(() => {
    if (isActive) {
      cursorInnerRef.current.style.transform = `scale(${innerScale})`;
      cursorOuterRef.current.style.transform = `scale(${outerScale})`;
    } else {
      cursorInnerRef.current.style.transform = 'scale(1)';
      cursorOuterRef.current.style.transform = 'scale(1)';
    }
  }, [innerScale, outerScale, isActive]);

  React.useEffect(() => {
    if (isActiveClickable) {
      cursorInnerRef.current.style.transform = `scale(${innerScale * 1.3})`;
      cursorOuterRef.current.style.transform = `scale(${outerScale * 1.4})`;
    }
  }, [innerScale, outerScale, isActiveClickable]);

  React.useEffect(() => {
    if (isVisible) {
      cursorInnerRef.current.style.opacity = 1;
      cursorOuterRef.current.style.opacity = 1;
    } else {
      cursorInnerRef.current.style.opacity = 0;
      cursorOuterRef.current.style.opacity = 0;
    }
  }, [isVisible]);

  // Stable event listener functions
  const handleMouseOver = () => setIsActive(true);
  const handleMouseOut = () => {
    setIsActive(false);
    setIsActiveClickable(false);
  };
  const handleMouseDown = () => setIsActiveClickable(true);
  const handleMouseUp = () => setIsActive(true);
  const handleClick = () => {
    setIsActive(true);
    setIsActiveClickable(false);
  };

  React.useEffect(() => {
    const clickables = document.querySelectorAll(
      'a, input[type="submit"], input[type="image"], label[for], select, button, .link'
    );
    clickables.forEach((el) => {
      el.style.cursor = 'none';

      el.addEventListener('mouseover', handleMouseOver);
      el.addEventListener('mouseout', handleMouseOut);
      el.addEventListener('mousedown', handleMouseDown);
      el.addEventListener('mouseup', handleMouseUp);
      el.addEventListener('click', handleClick);
    });

    return () => {
      clickables.forEach((el) => {
        el.removeEventListener('mouseover', handleMouseOver);
        el.removeEventListener('mouseout', handleMouseOut);
        el.removeEventListener('mousedown', handleMouseDown);
        el.removeEventListener('mouseup', handleMouseUp);
        el.removeEventListener('click', handleClick);
      });
    };
  }, []);

  const styles = {
    cursor: {
      zIndex: 999,
      position: 'fixed',
      opacity: 1,
      pointerEvents: 'none',
      transition: 'opacity 0.15s ease-in-out, transform 0.15s ease-in-out',
    },
    cursorInner: {
      position: 'fixed',
      borderRadius: '50%',
      width: innerSize,
      height: innerSize,
      pointerEvents: 'none',
      backgroundColor: `rgba(${color}, 1)`,
      transition: 'opacity 0.15s ease-in-out, transform 0.25s ease-in-out',
    },
    cursorOuter: {
      position: 'fixed',
      borderRadius: '50%',
      pointerEvents: 'none',
      width: outerSize,
      height: outerSize,
      backgroundColor: `rgba(${color}, ${outerAlpha})`,
      transition: 'opacity 0.15s ease-in-out, transform 0.15s ease-in-out',
    },
  };

  return (
    <React.Fragment>
      <div ref={cursorOuterRef} style={styles.cursorOuter} />
      <div ref={cursorInnerRef} style={styles.cursorInner} />
    </React.Fragment>
  );
}

export default AnimatedCursor;
