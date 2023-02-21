import { WorklogsContext } from '../context/WorklogsContext'
import { useContext } from 'react'

export const useWorklogsContext = () => {
  const context = useContext(WorklogsContext)

  if (!context) {
    throw Error('useWorklogsContext must be used inside an WorklogsContextProvider')
  }

  return context
}