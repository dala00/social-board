import { Box, Flex } from '@chakra-ui/layout'
import axios from 'axios'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'
import BoardCard from './BoardCard'
import BoardSheet from './BoardSheet'
import { MultipleContainers } from '../sortable/MultipleContainers'
import { useBoard } from '../../hooks/board'
import { Sheet } from '../../models/Sheet'
import styles from '../../styles/Board.module.css'
import { MoveTaskRequestData } from '../../types/api/tasks'
import { MdSettingsApplications } from 'react-icons/md'
import { UsersSheetsResponseData } from '../../types/api/users'
import BoardApplications from './BoardApplications'

export default function Board() {
  const {
    clonedSheets,
    cloneSheets,
    convertToMultipleContainersItems,
    getSortItemId,
    getTask,
    isDraggingSheet,
    moveEndOverTask,
    moveOverTask,
    moveSheet,
    setApplications,
    setClonedSheets,
    setIsDraggingSheet,
    setSheets,
    sheets,
    swap,
    userId,
  } = useBoard()

  const initialize = useCallback(async () => {
    const response = await axios.get<UsersSheetsResponseData>(
      `/api/users/${userId}/sheets`
    )
    setSheets(response.data.sheets)
    setApplications(response.data.applications)
  }, [userId])

  useEffect(() => {
    if (!userId) {
      return
    }
    initialize()
  }, [userId])

  const onTaskDragEnd = useCallback(
    (activeContainer, overContainer, activeId, overId) => {
      const activeItemId = getSortItemId(activeId)
      const task = getTask(activeItemId.id)
      const clonedTask = getTask(activeItemId.id, clonedSheets)
      if (task.sheetId !== clonedTask.sheetId) {
        // シート移動した場合
        const newSheets = moveEndOverTask(overContainer, activeId, overId)
        setSheets(newSheets)
        const data: MoveTaskRequestData = {
          taskId: task.id,
          fromSheetId: task.sheetId,
          toSheetId: clonedTask.sheetId,
          toTaskIds: newSheets
            .find((sheet) => sheet.id === clonedTask.sheetId)
            .tasks.map((t) => t.id),
        }
        axios.put('/api/tasks/move', data)
      } else if (activeId === overId) {
        // ドラッグしてそのまま戻ってきた場合
        setSheets(clonedSheets)
      } else {
        // 同じシートで並び替え
        const newSheets = swap(sheets, activeContainer, activeId, overId)
        setSheets(newSheets)
        axios.put('/api/tasks/sort', {
          sheetId: task.sheetId,
          taskIds: newSheets
            .find((sheet) => sheet.id === task.sheetId)
            .tasks.map((t) => t.id),
        })
      }
      setClonedSheets(null)
    },
    [sheets, clonedSheets]
  )

  const onDragEnd = useCallback(
    (activeContainer, overContainer, activeId, overId) => {
      const activeItemId = getSortItemId(activeId)
      if (activeItemId.type === 'sheet') {
        if (activeId === overId) {
          return
        }
        const sortedSheets = moveSheet(activeId, overId)
        axios.put('/api/sheets/sort', {
          sheetIds: sortedSheets.map((sheet) => sheet.id),
        })
      } else {
        onTaskDragEnd(activeContainer, overContainer, activeId, overId)
      }
      setIsDraggingSheet(false)
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
        <Flex>
          <BoardApplications />
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
                    children={
                      clonedSheets !== null && isDraggingSheet
                        ? sheet.tasks.map((task) => (
                            <BoardCard key={task.id} task={task} />
                          ))
                        : children
                    }
                  />
                )
              }}
              itemBuilder={(taskId, listeners) => {
                const sortItemId = getSortItemId(taskId)
                const task = getTask(sortItemId.id)
                return <BoardCard key={task.id} task={task} />
              }}
              onDragStart={(activeId) => {
                setIsDraggingSheet(/^sheet/.test(activeId))
                cloneSheets()
              }}
              onDragCancel={() => {
                setClonedSheets(null)
                setIsDraggingSheet(false)
              }}
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
          </Flex>
        </Flex>
      </Box>
    </>
  )
}
