import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import { VOID_ID } from './MultipleContainers'

export function Trash() {
  const { setNodeRef, isOver } = useDroppable({
    id: VOID_ID,
  })

  return (
    <div
      ref={setNodeRef}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed',
        left: '50%',
        marginLeft: -150,
        bottom: 20,
        width: 300,
        height: 60,
        borderRadius: 5,
        border: '1px solid',
        borderColor: isOver ? 'red' : '#DDD',
      }}
    >
      Drop here to delete
    </div>
  )
}
