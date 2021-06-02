import React, { useEffect, useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { Item } from './Item'
import { ItemBuilder } from './SortableContainer'

interface SortableItemProps {
  containerId: string
  id: string
  index: number
  handle: boolean
  style(args: any): React.CSSProperties
  getIndex(id: string): number
  renderItem(): React.ReactElement
  itemBuilder: ItemBuilder
  wrapperStyle({ index }: { index: number }): React.CSSProperties
}

export function SortableItem({
  id,
  index,
  handle,
  renderItem,
  itemBuilder,
  style,
  containerId,
  getIndex,
  wrapperStyle,
}: SortableItemProps) {
  const {
    setNodeRef,
    listeners,
    isDragging,
    isSorting,
    over,
    overIndex,
    transform,
    transition,
  } = useSortable({
    id,
  })
  const mounted = useMountStatus()
  const mountedWhileDragging = isDragging && !mounted

  return (
    <Item
      ref={setNodeRef}
      value={id}
      dragging={isDragging}
      sorting={isSorting}
      handle={handle}
      index={index}
      wrapperStyle={wrapperStyle({ index })}
      style={style({
        index,
        value: id,
        isDragging,
        isSorting,
        overIndex: over ? getIndex(over.id) : overIndex,
        containerId,
      })}
      transition={transition}
      transform={transform}
      fadeIn={mountedWhileDragging}
      listeners={listeners}
      renderItem={renderItem}
      itemBuilder={itemBuilder}
    />
  )
}

function useMountStatus() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setIsMounted(true), 500)

    return () => clearTimeout(timeout)
  }, [])

  return isMounted
}
