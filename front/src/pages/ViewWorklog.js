import { useEffect }from 'react'
import { useWorklogsContext } from "../hooks/useWorklogsContext"
import { useAuthContext } from "../hooks/useAuthContext"

// components
import WorklogDetails from '../components/WorklogDetails' 

export default function ViewWorklog() {

  const {worklogs, dispatch} = useWorklogsContext()
  const {user} = useAuthContext()

  useEffect(() => {
    const fetchWorklogs = async () => {
      const response = await fetch('/api/worklogs', {
        headers: {'Authorization': `Bearer ${user.token}`},
      })
      const json = await response.json()

      if (response.ok) {
        dispatch({type: 'SET_WORKLOGS', payload: json})
      }
    }

    if (user) {
      fetchWorklogs()
    }
  }, [dispatch, user])

  return (
    <div className="veiw-worklog">
      <div className="month-box">
        <button>Jan</button>
        <button>Feb</button>
        <button>Mar</button>
        <button>Apr</button>
        <button>May</button>
        <button>Jun</button>
        <button>Jul</button>
        <button>Aug</button>
        <button>Sep</button>
        <button>Oct</button>
        <button>Nov</button>
        <button>Dec</button>
      </div>
    </div>
  );
}
