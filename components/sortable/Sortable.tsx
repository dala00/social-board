import { useState } from 'react'
import { createPortal } from 'react-dom'
import {
  Announcements,
  closestCenter,
  CollisionDetection,
  DragOverlay,
  DndContext,
  DropAnimation,
  defaultDropAnimation,
  KeyboardSensor,
  Modifiers,
  MouseSensor,
  LayoutMeasuring,
  PointerActivationConstraint,
  ScreenReaderInstructions,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  useSortable,
  SortableContext,
  sortableKeyboardCoordinates,
  SortingStrategy,
  rectSortingStrategy,
  AnimateLayoutChanges,
} from '@dnd-kit/sortable'
import { Item } from './Item'
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'

export type ItemBuilder = (
  id: string,
  listeners: SyntheticListenerMap
) => JSX.Element

export interface Props {
  activationConstraint?: PointerActivationConstraint
  animateLayoutChanges?: AnimateLayoutChanges
  adjustScale?: boolean
  collisionDetection?: CollisionDetection
  Container?: any // To-do: Fix me
  dropAnimation?: DropAnimation | null
  itemCount?: number
  items?: string[]
  handle?: boolean
  layoutMeasuring?: Partial<LayoutMeasuring>
  modifiers?: Modifiers
  renderItem?: any
  removable?: boolean
  strategy?: SortingStrategy
  useDragOverlay?: boolean
  getItemStyles?(args: {
    id: UniqueIdentifier
    index: number
    isSorting: boolean
    isDragOverlay: boolean
    overIndex: number
    isDragging: boolean
  }): React.CSSProperties
  wrapperStyle?(args: {
    index: number
    isDragging: boolean
    id: string
  }): React.CSSProperties
  isDisabled?(id: UniqueIdentifier): boolean
  itemBuilder: ItemBuilder
  onDragEnd: (activeIndex: number, newIndex: number) => void
}

const defaultDropAnimationConfig: DropAnimation = {
  ...defaultDropAnimation,
  dragSourceOpacity: 0.5,
}

const screenReaderInstructions: ScreenReaderInstructions = {
  draggable: `
    To pick up a sortable item, press the space bar.
    While sorting, use the arrow keys to move the item.
    Press space again to drop the item in its new position, or press escape to cancel.
  `,
}

export function Sortable({
  activationConstraint,
  animateLayoutChanges,
  adjustScale = false,
  collisionDetection = closestCenter,
  dropAnimation = defaultDropAnimationConfig,
  getItemStyles = () => ({}),
  handle = false,
  items,
  isDisabled = () => false,
  layoutMeasuring,
  modifiers,
  removable,
  renderItem,
  strategy = rectSortingStrategy,
  useDragOverlay = true,
  wrapperStyle = () => ({}),
  itemBuilder,
  onDragEnd,
}: Props) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint,
    }),
    useSensor(TouchSensor, {
      activationConstraint,
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )
  const getIndex = items.indexOf.bind(items)
  const getPosition = (id: string) => getIndex(id) + 1
  const activeIndex = activeId ? getIndex(activeId) : -1
  const announcements: Announcements = {
    onDragStart(id) {
      return `Picked up sortable item ${id}. Sortable item ${id} is in position ${getPosition(
        id
      )} of ${items.length}`
    },
    onDragOver(id, overId) {
      if (overId) {
        return `Sortable item ${id} was moved into position ${getPosition(
          overId
        )} of ${items.length}`
      }

      return
    },
    onDragEnd(id, overId) {
      if (overId) {
        return `Sortable item ${id} was dropped at position ${getPosition(
          overId
        )} of ${items.length}`
      }

      return
    },
    onDragCancel(id) {
      return `Sorting was cancelled. Sortable item ${id} was dropped.`
    },
  }

  return (
    <DndContext
      announcements={announcements}
      screenReaderInstructions={screenReaderInstructions}
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={({ active }) => {
        if (!active) {
          return
        }

        setActiveId(active.id)
      }}
      onDragEnd={({ over }) => {
        setActiveId(null)

        if (over) {
          const overIndex = getIndex(over.id)
          if (activeIndex !== overIndex) {
            onDragEnd(activeIndex as number, overIndex as number)
          }
        }
      }}
      onDragCancel={() => setActiveId(null)}
      layoutMeasuring={layoutMeasuring}
      modifiers={modifiers}
    >
      <SortableContext items={items} strategy={strategy}>
        {items.map((value, index) => (
          <SortableItem
            key={value}
            id={value}
            handle={handle}
            index={index}
            style={getItemStyles}
            wrapperStyle={wrapperStyle}
            disabled={isDisabled(value)}
            renderItem={renderItem}
            animateLayoutChanges={animateLayoutChanges}
            useDragOverlay={useDragOverlay}
            itemBuilder={itemBuilder}
          />
        ))}
      </SortableContext>
      {useDragOverlay && process.browser
        ? createPortal(
            <DragOverlay
              adjustScale={adjustScale}
              dropAnimation={dropAnimation}
            >
              {activeId ? (
                <Item
                  value={items[activeIndex]}
                  handle={handle}
                  renderItem={renderItem}
                  index={activeIndex}
                  wrapperStyle={wrapperStyle({
                    index: activeIndex,
                    isDragging: true,
                    id: items[activeIndex],
                  })}
                  style={getItemStyles({
                    id: items[activeIndex],
                    index: activeIndex,
                    isSorting: activeId !== null,
                    isDragging: true,
                    overIndex: -1,
                    isDragOverlay: true,
                  })}
                  itemBuilder={itemBuilder}
                  dragOverlay
                />
              ) : null}
            </DragOverlay>,
            document.body
          )
        : null}
    </DndContext>
  )
}

interface SortableItemProps {
  animateLayoutChanges?: AnimateLayoutChanges
  disabled?: boolean
  id: string
  index: number
  handle: boolean
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

function getItemAttributes(originalAttributes: any, handle: boolean): object {
  if (!handle) {
    return originalAttributes
  }

  const { role, ...attributes } = originalAttributes
  return attributes
}

export function SortableItem({
  disabled,
  animateLayoutChanges,
  id,
  index,
  handle,
  onRemove,
  style,
  renderItem,
  useDragOverlay,
  wrapperStyle,
  itemBuilder,
}: SortableItemProps) {
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
      handle={handle}
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
      {...getItemAttributes(attributes, handle)}
    />
  )
}
