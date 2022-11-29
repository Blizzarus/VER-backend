import React, {useState} from 'react';
import {Icon, Accordion} from 'semantic-ui-react'

const Clue = (props) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  
  return (
  <>
    <Accordion.Title
      active={activeIndex === props.index}
      onClick={() => {
        if (activeIndex === props.index) {
          setActiveIndex(-1)
        } else {
          setActiveIndex(props.index)
        }
      }}
      index={props.index}
    >
      <Icon name='dropdown' />
      {props.clue.title}
    </Accordion.Title>
    <Accordion.Content
      active={activeIndex === props.index}
    >
      <p>{props.clue.content}</p>
    </Accordion.Content>
  </>
  )
}

export default Clue;