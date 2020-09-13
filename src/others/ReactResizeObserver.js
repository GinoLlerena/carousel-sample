// Taken from https://github.com/react-component/resize-observer
import React, {
  isValidElement,
  cloneElement,
  useRef,
  useEffect,
  useState
} from "react";
import ResizeObserver from "resize-observer-polyfill";
import { findDOMNode } from "react-dom";
import {
  composeRef,
  supportRef,
  toArray,
  onTriggerResize
} from "./ResizeUtils";
import curry from "lodash/fp/curry";
const INTERNAL_PREFIX_KEY = "rc-observer-key";
const defaultState = {
  width: 0,
  height: 0,
  offsetHeight: 0,
  offsetWidth: 0
};
const onTriggerResizeCurrying = curry(onTriggerResize);

function ReactResizeObserve(props) {
  const didMountRef = useRef(null);
  const [state, setState] = useState(defaultState);
  const { disabled, children, onResize } = props;
  let resizeObserver = null;
  let childNode = null;
  let currentElement = null;
  const setChildNode = (node) => (childNode = node);
  const onComponentUpdated = () => {
    // Unregister if disabled
    if (disabled) {
      destroyObserver();
      return;
    }
    // Unregister if element changed
    const element = findDOMNode(childNode || didMountRef.current); //childNode || didMountRef.current
    const elementChanged = element !== currentElement;
    if (elementChanged) {
      destroyObserver();
      currentElement = element;
    }
    if (!resizeObserver && element) {
      resizeObserver = new ResizeObserver(
        onTriggerResizeCurrying(state, setState, onResize)
      );
      resizeObserver.observe(element);
    }
  };
  const destroyObserver = () => {
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
  };
  useEffect(() => {
    onComponentUpdated();
    return destroyObserver;
  });
  const render = () => {
    const childNodes = toArray(children);
    if (childNodes.length > 1) {
      warning(
        false,
        "Find more than one child node with `children` in ResizeObserver. Will only observe first one."
      );
    } else if (childNodes.length === 0) {
      warning(
        false,
        "`children` of ResizeObserver is empty. Nothing is in observe."
      );
      return null;
    }
    const childNode = childNodes[0];
    if (isValidElement(childNode) && supportRef(childNode)) {
      const { ref } = childNode;
      childNodes[0] = cloneElement(childNode, {
        ref: composeRef(ref, setChildNode)
      });
    }
    return childNodes.length === 1
      ? childNodes[0]
      : childNodes.map((node, index) => {
          if (!isValidElement(node) || ("key" in node && node.key !== null)) {
            return node;
          }
          return cloneElement(node, {
            key: `${INTERNAL_PREFIX_KEY}-${index}`
          });
        });
  };
  return render();
}
export default ReactResizeObserve;
