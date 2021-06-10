import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import {
  CancelDrop,
  closestCorners,
  CollisionDetection,
  DndContext,
  DragOverlay,
  DropAnimation,
  defaultDropAnimation,
  KeyboardSensor,
  Modifiers,
  PointerSensor,
  UniqueIdentifier,
  useSensors,
  useSensor,
  Active,
  Over,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  SortingStrategy,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { Item } from './Item'
import { ItemBuilder, SortableContainer } from './SortableContainer'
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'
import { SortableItem } from './SortableItem'
import { DroppableItemContainer } from './DroppableItemContainer'
import { Trash } from './Trash'
import { MouseSensor } from '@dnd-kit/core'
import { TouchSensor } from '@dnd-kit/core'

export type ListBuilder = (
  id: string,
  listeners: SyntheticListenerMap,
  children: React.ReactNode
) => JSX.Element

export const defaultContainerStyle = ({
  isOverContainer,
}: {
  isOverContainer: boolean
}) => ({
  // marginTop: 40,
  // backgroundColor: isOverContainer
  //   ? 'rgb(235,235,235,1)'
  //   : 'rgba(246,246,246,1)',
})

const dropAnimation: DropAnimation = {
  ...defaultDropAnimation,
  dragSourceOpacity: 0.5,
}

type Items = Record<string, string[]>

interface Props {
  adjustScale?: boolean
  cancelDrop?: CancelDrop
  collisionDetection?: CollisionDetection
  columns?: number
  getItemStyles?(args: {
    value: UniqueIdentifier
    index: number
    overIndex: number
    isDragging: boolean
    containerId: UniqueIdentifier
    isSorting: boolean
    isDragOverlay: boolean
  }): React.CSSProperties
  wrapperStyle?(args: { index: number }): React.CSSProperties
  getContainerStyle?(args: { isOverContainer: boolean }): React.CSSProperties
  items: Items
  containerItems: string[]
  handle?: boolean
  renderItem?: any
  modifiers?: Modifiers
  trashable?: boolean
  vertical?: boolean
  listBuilder: ListBuilder
  itemBuilder: ItemBuilder
  onDragStart: (activeId: string) => void
  onDragCancel: () => void
  onDragOver: (
    activeContainer: string,
    overContainer: string,
    active: Active,
    over: Over
  ) => void
  onDragEnd: (
    activeContainer: string,
    overContainer: string,
    activeId: string,
    overId: string
  ) => void
}

export const VOID_ID = 'void'

export function MultipleContainers({
  adjustScale = false,
  cancelDrop,
  collisionDetection = closestCorners,
  columns,
  handle = false,
  items,
  containerItems,
  getItemStyles = () => ({}),
  getContainerStyle = defaultContainerStyle,
  wrapperStyle = () => ({}),
  modifiers,
  renderItem,
  trashable = false,
  vertical = false,
  listBuilder,
  itemBuilder,
  onDragStart,
  onDragCancel,
  onDragOver,
  onDragEnd,
}: Props) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const activationConstraint = {
    distance: 15,
  }
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint,
    }),
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
  const findContainer = (id: string) => {
    if (id in items) {
      return id
    }

    return Object.keys(items).find((key) => items[key].includes(id))
  }

  const getIndex = (id: string) => {
    const container = findContainer(id)

    if (!container) {
      return -1
    }

    const index = items[container].indexOf(id)

    return index
  }

  const onDragCancelFunc = () => {
    onDragCancel()
    setActiveId(null)
  }

  if (!process.browser) {
    return <></>
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={({ active }) => {
        setActiveId(active.id)
        onDragStart(active.id)
      }}
      onDragOver={({ active, over }) => {
        const overId = over?.id

        if (!overId) {
          return
        }

        const overContainer = findContainer(overId)
        const activeContainer = findContainer(active.id)

        if (!overContainer || !activeContainer) {
          return
        }

        if (activeContainer === overContainer) {
          return
        }
        onDragOver(activeContainer, overContainer, active, over)
      }}
      onDragEnd={({ active, over }) => {
        const activeContainer = findContainer(active.id)

        if (!activeContainer) {
          setActiveId(null)
          return
        }

        const overId = over?.id || VOID_ID

        if (overId === VOID_ID) {
          // setItems((items) => ({
          //   ...(trashable && over?.id === VOID_ID ? items : clonedItems),
          //   [VOID_ID]: [],
          // }))
          setActiveId(null)
          return
        }

        const overContainer = findContainer(overId)

        if (activeContainer && overContainer) {
          onDragEnd(activeContainer, overContainer, activeId, overId)
        }

        setActiveId(null)
      }}
      cancelDrop={cancelDrop}
      onDragCancel={onDragCancelFunc}
      modifiers={modifiers}
    >
      <SortableContext items={containerItems} strategy={rectSortingStrategy}>
        {Object.keys(items)
          .filter((key) => key !== VOID_ID)
          .map((containerId, index) => (
            <SortableContainer
              key={containerId}
              id={containerId}
              index={index}
              style={getItemStyles}
              wrapperStyle={wrapperStyle}
              disabled={false}
              renderItem={renderItem}
              // animateLayoutChanges={animateLayoutChanges}
              useDragOverlay={true}
              itemBuilder={(sheetId, listeners) => (
                <SortableContext
                  key={containerId}
                  items={items[containerId]}
                  strategy={verticalListSortingStrategy}
                >
                  <DroppableItemContainer
                    id={containerId}
                    columns={columns}
                    items={items[containerId]}
                    getStyle={getContainerStyle}
                    listeners={listeners}
                    listBuilder={listBuilder}
                  >
                    {items[containerId].map((value, index) => {
                      return (
                        <SortableItem
                          key={value}
                          id={value}
                          index={index}
                          handle={handle}
                          style={getItemStyles}
                          wrapperStyle={wrapperStyle}
                          renderItem={renderItem}
                          itemBuilder={itemBuilder}
                          containerId={containerId}
                          getIndex={getIndex}
                        />
                      )
                    })}
                  </DroppableItemContainer>
                </SortableContext>
              )}
            />
          ))}
      </SortableContext>
      {createPortal(
        <DragOverlay adjustScale={adjustScale} dropAnimation={dropAnimation}>
          {/^task/.test(activeId) ? (
            <Item
              value={activeId}
              handle={handle}
              style={getItemStyles({
                containerId: findContainer(activeId) as string,
                overIndex: -1,
                index: getIndex(activeId),
                value: activeId,
                isSorting: activeId !== null,
                isDragging: true,
                isDragOverlay: true,
              })}
              wrapperStyle={wrapperStyle({ index: 0 })}
              renderItem={renderItem}
              itemBuilder={itemBuilder}
              dragOverlay
            />
          ) : null}
          {/^sheet/.test(activeId) ? (
            <Item
              value={activeId}
              handle={handle}
              style={getItemStyles({
                containerId: findContainer(activeId) as string,
                overIndex: -1,
                index: getIndex(activeId),
                value: activeId,
                isSorting: activeId !== null,
                isDragging: true,
                isDragOverlay: true,
              })}
              wrapperStyle={wrapperStyle({ index: 0 })}
              renderItem={renderItem}
              itemBuilder={(id, listeners) => listBuilder(id, listeners, [])}
              dragOverlay
            />
          ) : null}
        </DragOverlay>,
        document.body
      )}
      {trashable && activeId ? <Trash /> : null}
    </DndContext>
  )
}
