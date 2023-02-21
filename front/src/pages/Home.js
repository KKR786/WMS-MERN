import React, { useEffect }from 'react'
import { useWorklogsContext } from "../hooks/useWorklogsContext"
import { useAuthContext } from "../hooks/useAuthContext"

// components
import WorklogDetails from '../components/WorklogDetails'
import WorklogForm from '../components/WorklogForm'

const Home = () => {
  const {worklogs, dispatch} = useWorklogsContext()
  const {user} = useAuthContext()
  const [date, setDate] = React.useState('')
  
  function getDate(val) {
    setDate(val);
  }
  
  console.log(worklogs)
  useEffect(() => {
    const fetchWorklogs = async () => {
      const response = await fetch('/api/worklogs', {
        headers: {'Authorization': `Bearer ${user.token}`},
      })
      const json = await response.json()

      if (response.ok) {
        dispatch({type: 'GET_WORKLOGS', payload: json})
      }
    }

    if (user) {
      fetchWorklogs()
    }
  }, [dispatch, user])

  return (
    <div className="home">
      <WorklogForm handle={getDate}/>
      <div className="worklogs">
        {
          <WorklogDetails worklogs={worklogs} date={date}/>
        }
        {/* {worklogs && worklogs.map((worklog) => (
          <WorklogDetails key={worklog._id} worklog={worklog} date={date} len={len}/>
        ))} */}
      </div>
    </div>
  )
}

export default Home