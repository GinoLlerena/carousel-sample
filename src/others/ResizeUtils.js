import isEqual from "lodash/fp/isEqual";
import React from "react";

export const TILE_LENGTH = 640;
export const TILE_PADDING = 8;

export function getStepLength(width, MIN_TILE, PADDING) {
  let length = MIN_TILE * 3 + 6 * PADDING;
  let step = 3;
  if (width > 0 && width <= MIN_TILE * 2 + 4 * PADDING) {
    length = MIN_TILE + 2 * PADDING;
    step = 1;
  } else if (
    width > MIN_TILE * 2 + 4 * PADDING &&
    width < MIN_TILE * 3 + 6 * PADDING
  ) {
    length = MIN_TILE * 2 + 4 * PADDING;
    step = 2;
  } else if (width > MIN_TILE * 3 + 6 * PADDING) {
    length = MIN_TILE * 3 + 6 * PADDING;
    step = 3;
  }
  return { step, length };
}

export function isReactFragment(variableToInspect) {
  if (variableToInspect.type) {
    return variableToInspect.type === React.Fragment;
  }
  return variableToInspect === React.Fragment;
}
export function toArray(children, option = {}) {
  let ret = [];
  React.Children.forEach(children, (child) => {
    if ((child === undefined || child === null) && !option?.keepEmpty) {
      return;
    }
    if (Array.isArray(child)) {
      ret = ret.concat(toArray(child));
    } else if (isReactFragment(child) && child.props) {
      ret = ret.concat(toArray(child.props.children, option));
    } else {
      ret.push(child);
    }
  });
  return ret;
}
export function fillRef(ref, node) {
  if (typeof ref === "function") {
    ref(node);
  } else if (typeof ref === "object" && ref && "current" in ref) {
    ref.current = node;
  }
}
/**
 * Merge refs into one ref function to support ref passing.
 */
export function composeRef(...refs) {
  return (node) => {
    refs.forEach((ref) => {
      fillRef(ref, node);
    });
  };
}
export function supportRef(nodeOrComponent) {
  const type = nodeOrComponent.type;
  // Function component node
  if (typeof type === "function" && !type.prototype?.render) {
    return false;
  }
  // Class component
  if (
    typeof nodeOrComponent === "function" &&
    !nodeOrComponent.prototype?.render
  ) {
    return false;
  }
  return true;
}
export const onTriggerResize = (state, setState, onResize, entries) => {
  const target = entries[0].target;
  const { width, height } = target.getBoundingClientRect();
  const { offsetWidth, offsetHeight } = target;
  /**
   * Resize observer trigger when content size changed.
   * In most case we just care about element size,
   * let's use `boundary` instead of `contentRect` here to avoid shaking.
   */
  const fixedWidth = Math.floor(width);
  const fixedHeight = Math.floor(height);
  if (
    state.width !== fixedWidth ||
    state.height !== fixedHeight ||
    state.offsetWidth !== offsetWidth ||
    state.offsetHeight !== offsetHeight
  ) {
    const size = {
      width: fixedWidth,
      height: fixedHeight,
      offsetWidth,
      offsetHeight
    };
    if (!isEqual(size, state)) {
      setState(size);
      if (onResize) {
        // defer the callback but not defer to next frame
        Promise.resolve().then(() => {
          onResize({
            ...size,
            offsetWidth,
            offsetHeight
          });
        });
      }
    }
  }
};
