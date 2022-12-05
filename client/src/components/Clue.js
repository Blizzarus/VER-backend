import React from 'react';
import {Icon, Accordion} from 'semantic-ui-react'

const Clue = (props) => { 
  return (
  <>
    <Accordion.Title
      active={props.activeIndex === props.index}
      onClick={() => {
        if (props.activeIndex === props.index) {
          props.onClueChange(-1)
        } else {
          props.onClueChange(props.index)
        }
      }}
      index={props.index}
    >
      <Icon name='dropdown' />
      {props.clue.title}
    </Accordion.Title>
    <Accordion.Content
      active={props.activeIndex === props.index}
    >
      {props.clue.content}
    </Accordion.Content>
  </>
  )
}

export default Clue;