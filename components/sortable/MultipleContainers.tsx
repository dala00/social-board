import React, { useEffect, useState } from 'react'
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
  useDroppable,
  UniqueIdentifier,
  useSensors,
  useSensor,
  Active,
  Over,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  SortingStrategy,
} from '@dnd-kit/sortable'
import { Item } from './Item'
import { ItemBuilder } from './Sortable'

type ListBuilder = (id: string, children: React.ReactNode) => JSX.Element

function DroppableContainer({
  children,
  columns = 1,
  id,
  items,
  listBuilder,
  getStyle = () => ({}),
}: {
  children: React.ReactNode
  columns?: number
  id: string
  items: string[]
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
      {listBuilder(id, children)}
    </div>
  )
}

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
  items?: Items
  handle?: boolean
  renderItem?: any
  strategy?: SortingStrategy
  modifiers?: Modifiers
  trashable?: boolean
  vertical?: boolean
  listBuilder: ListBuilder
  itemBuilder: ItemBuilder
  onDragStart: () => void
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
  getItemStyles = () => ({}),
  getContainerStyle = defaultContainerStyle,
  wrapperStyle = () => ({}),
  modifiers,
  renderItem,
  strategy = verticalListSortingStrategy,
  trashable = false,
  vertical = false,
  listBuilder,
  itemBuilder,
  onDragStart,
  onDragCancel,
  onDragOver,
  onDragEnd,
}: Props) {
  const [clonedItems, setClonedItems] = useState<Items | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor),
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
        onDragStart()
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
      <div
        style={{
          display: 'inline-grid',
          boxSizing: 'border-box',
          padding: '0px 20px',
          gridAutoFlow: vertical ? 'row' : 'column',
        }}
      >
        {Object.keys(items)
          .filter((key) => key !== VOID_ID)
          .map((containerId) => (
            <SortableContext
              key={containerId}
              items={items[containerId]}
              strategy={strategy}
            >
              <DroppableContainer
                id={containerId}
                columns={columns}
                items={items[containerId]}
                getStyle={getContainerStyle}
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
              </DroppableContainer>
            </SortableContext>
          ))}
      </div>
      {createPortal(
        <DragOverlay adjustScale={adjustScale} dropAnimation={dropAnimation}>
          {activeId ? (
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
              color={getColor(activeId)}
              wrapperStyle={wrapperStyle({ index: 0 })}
              renderItem={renderItem}
              itemBuilder={itemBuilder}
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

function getColor(id: string) {
  switch (id[0]) {
    case 'A':
      return '#7193f1'
    case 'B':
      return '#ffda6c'
    case 'C':
      return '#00bcd4'
    case 'D':
      return '#ef769f'
  }

  return undefined
}

function Trash() {
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

function SortableItem({
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
      color={getColor(id)}
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
