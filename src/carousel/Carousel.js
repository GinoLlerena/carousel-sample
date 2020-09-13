import React, {Fragment} from 'react'
import CarouselItem from './CarouselItem'
import map from 'lodash/fp/map'
import entries from 'lodash/fp/entries'
import flow from 'lodash/fp/flow'
function CarouselList(props) {
  const { component: Component, items } = props
  const getItem = ([i, data]) => <CarouselItem key={i}><Component data={data} itemIndex={i} /></CarouselItem>
  const elements = flow(entries, map(getItem))(items)
  return (
    <Fragment>
      {elements}
    </Fragment>
  )
}
function Carousel(props) {
  const { component, items, className, style } = props
  return (
    <div className={className} style={style}>
      <CarouselList component={component} items={items} />
    </div>
  )
}
export default Carousel