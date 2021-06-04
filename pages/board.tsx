import { Box, Flex } from '@chakra-ui/layout'
import { arrayMove } from '@dnd-kit/sortable'
import Head from 'next/head'
import { useCallback, useEffect } from 'react'
import BoardCard from '../components/board/BoardCard'
import BoardSheet from '../components/board/BoardSheet'
import { MultipleContainers } from '../components/sortable/MultipleContainers'
import { Sortable } from '../components/sortable/Sortable'
import { useBoard } from '../hooks/board'
import { Sheet } from '../models/Sheet'
import { Task } from '../models/Task'
import styles from '../styles/Board.module.css'

export default function Board() {
  const {
    clonedSheets,
    cloneSheets,
    convertToMultipleContainersItems,
    getSortItemId,
    getTask,
    moveEndOverTask,
    moveOverTask,
    moveSheet,
    setClonedSheets,
    setSheets,
    sheets,
    swap,
  } = useBoard()

  useEffect(() => {
    setSheets([
      {
        id: 1,
        name: 'test',
        tasks: [
          { id: 1, sheetId: 1, body: 'aiueo' },
          { id: 2, sheetId: 1, body: 'bbbbb' },
          { id: 4, sheetId: 1, body: 'bbbbb' },
          { id: 5, sheetId: 1, body: 'bbbbb' },
          { id: 6, sheetId: 1, body: 'bbbbb' },
          { id: 8, sheetId: 1, body: 'bbbbb' },
          { id: 9, sheetId: 1, body: 'bbbbb' },
        ],
      },
      {
        id: 2,
        name: 'test2',
        tasks: [
          { id: 3, sheetId: 2, body: 'aiueo' },
          { id: 10, sheetId: 2, body: 'aiueo' },
        ],
      },
      {
        id: 3,
        name: 'test3',
        tasks: [
          { id: 11, sheetId: 3, body: 'ccccc' },
          { id: 12, sheetId: 3, body: 'cccccb' },
        ],
      },
    ])
  }, [])

  const onTaskDragEnd = useCallback(
    (activeContainer, overContainer, activeId, overId) => {
      const activeItemId = getSortItemId(activeId)
      const task = getTask(activeItemId.id)
      const clonedTask = getTask(activeItemId.id, clonedSheets)
      if (task.sheetId !== clonedTask.sheetId) {
        const newSheets = moveEndOverTask(overContainer, activeId, overId)
        setSheets(newSheets)
      } else if (activeId === overId) {
        setSheets(clonedSheets)
      } else {
        const newSheets = swap(sheets, activeContainer, activeId, overId)
        setSheets(newSheets)
      }
      setClonedSheets(null)
    },
    [sheets, clonedSheets]
  )

  const onDragEnd = useCallback(
    (activeContainer, overContainer, activeId, overId) => {
      const activeItemId = getSortItemId(activeId)
      if (activeItemId.type === 'sheet') {
        moveSheet(activeId, overId)
      } else {
        onTaskDragEnd(activeContainer, overContainer, activeId, overId)
      }
    },
    [sheets, clonedSheets]
  )

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box as="main" className={styles.main} backgroundColor="blue.100">
        <Flex p={4}>
          <MultipleContainers
            containerItems={sheets.map(
              (sheet) => `sheet-${sheet.id.toString()}`
            )}
            items={convertToMultipleContainersItems(clonedSheets || sheets)}
            listBuilder={(sheetId, listeners, children) => {
              const sortItemId = getSortItemId(sheetId)
              const sheet = sheets.find((sheet) => sheet.id === sortItemId.id)
              return (
                <BoardSheet
                  key={sheetId}
                  sheet={sheet}
                  listeners={listeners}
                  children={children}
                />
              )
            }}
            itemBuilder={(taskId, listeners) => {
              const sortItemId = getSortItemId(taskId)
              const task = getTask(sortItemId.id)
              return <BoardCard key={task.id} task={task} />
            }}
            onDragStart={() => cloneSheets()}
            onDragCancel={() => setClonedSheets(null)}
            onDragOver={(activeContainer, overContainer, active, over) => {
              if (!clonedSheets) {
                return
              }

              const newSheets = moveOverTask(
                clonedSheets,
                activeContainer,
                overContainer,
                active,
                over
              )
              if (!newSheets) {
                return
              }
              setClonedSheets(newSheets)
            }}
            onDragEnd={onDragEnd}
          />
          {/* <Sortable
            items={sheets.map((sheet) => sheet.id.toString())}
            itemBuilder={(index, listeners) => {
              if (index === undefined) {
                return <></>
              }
              const sheet = sheets[index]
              return (
                <BoardSheet
                  key={sheet.id.toString()}
                  sheet={sheet}
                  listeners={listeners}
                />
              )
            }}
            onDragEnd={(activeIndex, overIndex) => {
              setSheets((sheets) => arrayMove(sheets, activeIndex, overIndex))
            }}
            handle
          /> */}
        </Flex>
      </Box>
    </>
  )
}
