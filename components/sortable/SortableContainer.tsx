import { useSortable, AnimateLayoutChanges } from '@dnd-kit/sortable'
import { Item } from './Item'
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'

export type ItemBuilder = (
  id: string,
  listeners: SyntheticListenerMap
) => JSX.Element

interface SortableContainerProps {
  animateLayoutChanges?: AnimateLayoutChanges
  disabled?: boolean
  id: string
  index: number
  useDragOverlay?: boolean
  onRemove?(id: string): void
  style(values: any): React.CSSProperties
  renderItem?(args: any): React.ReactElement
  wrapperStyle({
    index,
    isDragging,
    id,
  }: {
    index: number
    isDragging: boolean
    id: string
  }): React.CSSProperties
  itemBuilder: ItemBuilder
}

function getItemAttributes(originalAttributes: any): object {
  const { role, ...attributes } = originalAttributes
  return attributes
}

export function SortableContainer({
  disabled,
  animateLayoutChanges,
  id,
  index,
  onRemove,
  style,
  renderItem,
  useDragOverlay,
  wrapperStyle,
  itemBuilder,
}: SortableContainerProps) {
  const {
    attributes,
    isDragging,
    isSorting,
    listeners,
    overIndex,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    animateLayoutChanges,
    id,
    disabled,
  })

  return (
    <Item
      ref={setNodeRef}
      value={id}
      disabled={disabled}
      dragging={isDragging}
      sorting={isSorting}
      handle={true}
      renderItem={renderItem}
      index={index}
      style={style({
        index,
        id,
        isDragging,
        isSorting,
        overIndex,
      })}
      onRemove={onRemove ? () => onRemove(id) : undefined}
      transform={transform}
      transition={!useDragOverlay && isDragging ? 'none' : transition}
      wrapperStyle={wrapperStyle({ index, isDragging, id })}
      listeners={listeners}
      data-index={index}
      data-id={id}
      dragOverlay={!useDragOverlay && isDragging}
      itemBuilder={itemBuilder}
      {...getItemAttributes(attributes)}
    />
  )
}
