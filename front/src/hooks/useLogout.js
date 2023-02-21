import { useAuthContext } from './useAuthContext'
import { useWorklogsContext } from './useWorklogsContext'

export const useLogout = () => {
  const { dispatch } = useAuthContext()
  const { dispatch: dispatchWorklogs } = useWorklogsContext()

  const logout = () => {
    // remove user from storage
    localStorage.removeItem('user')

    // dispatch logout action
    dispatch({ type: 'LOGOUT' })
    dispatchWorklogs({ type: 'SET_WORKLOGS', payload: null })
  }

  return { logout }
}