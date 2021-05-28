import { Box, Flex } from '@chakra-ui/layout'
import { arrayMove } from '@dnd-kit/sortable'
import Head from 'next/head'
import { useEffect } from 'react'
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
    moveTask,
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
          { id: 1, body: 'aiueo' },
          { id: 2, body: 'bbbbb' },
          { id: 4, body: 'bbbbb' },
          { id: 5, body: 'bbbbb' },
          { id: 6, body: 'bbbbb' },
          { id: 8, body: 'bbbbb' },
          { id: 9, body: 'bbbbb' },
        ],
      },
      {
        id: 2,
        name: 'test2',
        tasks: [
          { id: 3, body: 'aiueo' },
          { id: 10, body: 'aiueo' },
        ],
      },
    ])
  }, [])

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
            items={convertToMultipleContainersItems(clonedSheets || sheets)}
            listBuilder={(sheetId, children) => {
              const sortItemId = getSortItemId(sheetId)
              const sheet = sheets.find((sheet) => sheet.id === sortItemId.id)
              return (
                <BoardSheet
                  key={sheetId}
                  sheet={sheet}
                  // listeners={listeners}
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
            onDragOver={(activeContainer, overContainer, activeId, overId) => {
              if (!clonedSheets) {
                return
              }

              const newSheets = moveTask(
                clonedSheets,
                activeContainer,
                overContainer,
                activeId,
                overId
              )
              if (!newSheets) {
                return
              }
              setClonedSheets(newSheets)
            }}
            onDragEnd={(container, activeId, overId) => {
              const newSheets = swap(container, activeId, overId)
              setSheets(newSheets)
              setClonedSheets(null)
            }}
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
