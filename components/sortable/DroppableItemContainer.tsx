import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'
import { ListBuilder } from './MultipleContainers'

export function DroppableItemContainer({
  children,
  columns = 1,
  id,
  items,
  listeners,
  listBuilder,
  getStyle = () => ({}),
}: {
  children: React.ReactNode
  columns?: number
  id: string
  items: string[]
  listeners: SyntheticListenerMap
  listBuilder: ListBuilder
  getStyle: ({
    isOverContainer,
  }: {
    isOverContainer: boolean
  }) => React.CSSProperties
}) {
  const { over, isOver, setNodeRef } = useDroppable({
    id,
  })
  const isOverContainer = isOver || (over ? items.includes(over.id) : false)

  return (
    <div
      ref={setNodeRef}
      style={
        {
          ...getStyle({ isOverContainer }),
          '--columns': columns,
        } as React.CSSProperties
      }
      // className={classNames(styles.List, horizontal && styles.horizontal)}
    >
      {listBuilder(id, listeners, children)}
    </div>
  )
}
