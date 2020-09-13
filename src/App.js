import React, {useState} from "react";
import Carousel from "./carousel/Carousel"
import Item from "./others/Item"
import ReactResizeObserver from "./others/ReactResizeObserver"
import { TILE_LENGTH, TILE_PADDING, getStepLength } from "./others/ResizeUtils"

const data = [
{ src: "http://lorempixel.com/output/cats-q-c-640-480-1.jpg" },
{ src: "http://lorempixel.com/output/cats-q-c-640-480-2.jpg" },
{ src: "http://lorempixel.com/output/cats-q-c-640-480-3.jpg" },
{ src: "http://lorempixel.com/output/cats-q-c-640-480-4.jpg" },
{ src: "http://lorempixel.com/output/cats-q-c-640-480-5.jpg" },
{ src: "http://lorempixel.com/output/cats-q-c-640-480-6.jpg" },
{ src: "http://lorempixel.com/output/cats-q-c-640-480-7.jpg" },
{ src: "http://lorempixel.com/output/cats-q-c-640-480-8.jpg" },
{ src: "http://lorempixel.com/output/cats-q-c-640-480-9.jpg" },
{ src: "http://lorempixel.com/output/cats-q-c-640-480-10.jpg" },
{ src: "http://lorempixel.com/output/cats-q-c-640-480-11.jpg" },
{ src: "http://lorempixel.com/output/cats-q-c-640-480-12.jpg" },
{ src: "http://lorempixel.com/output/cats-q-c-640-480-13.jpg" },
{ src: "http://lorempixel.com/output/cats-q-c-640-480-14.jpg" },
]


export default function App() {
  const [state, setState] = useState({})


  const stepLength = getStepLength(state.width, TILE_LENGTH, TILE_PADDING)
  console.log('stepLength', stepLength)

  const { step, length } = stepLength
  const lastStep = Math.floor(data.length / step) - 1
  const [currentIndex, setCurrentIndex] = useState(0)
  const goNext = _ => setCurrentIndex((currentIndex + 1) > lastStep ? lastStep : currentIndex + 1)
  const goBack = _ => setCurrentIndex((currentIndex - 1) >= 0 ? currentIndex - 1 : 0)

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <button type="button" className="btn btn-primary" onClick={goBack}>{'<<'}</button>
      <button type="button" className="btn btn-secondary" onClick={goNext}>{'>>'}</button>
      <ReactResizeObserver onResize={(state) => setState(state)}>
        <div style={{display:'block', marginLeft: -8, overflow:'hidden'}}>
          <Carousel component={Item} items={data} className='carousel' style={{transform: `translate3d(-${currentIndex*length}px, 0px, 0px)`}} />
        </div>
      </ReactResizeObserver>
    </div>
  );
}
