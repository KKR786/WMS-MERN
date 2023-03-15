import { createContext, useReducer } from 'react'

export const WorklogsContext = createContext()

export const worklogsReducer = (state, action) => {
  switch (action.type) {
    case 'GET_WORKLOGS': 
      return {
        worklogs: action.payload,
        worklog: null // Reset the worklog state
      }
      case 'GET_WORKLOG':
        return {
          ...state, // Preserve the existing worklogs state
          worklog: action.payload
        }
    case 'GET_MONTHLY_WORKLOGS':
      return {
        ...state,
        monthlyWorklogs: action.payload
      }
    case 'CREATE_WORKLOG':
      return {
        worklogs: [action.payload, ...state.worklogs],
        worklog: null // Reset the worklog state
      }
    case 'UPDATE_WORKLOG':
      return {
        worklogs: state.worklogs.map((w) => w._id === action.payload._id ? action.payload : w),
        worklog: null // Reset the worklog state
      }  
    case 'DELETE_WORKLOG':
      return {
        worklogs: state.worklogs.filter((w) => w._id !== action.payload._id),
        worklog: null // Reset the worklog state
      }
    default:
      return state
  }
}

export const WorklogsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(worklogsReducer, {
    worklogs: null,
    worklog: null,
    monthlyWorklogs: null
  })

  return (
    <WorklogsContext.Provider value={{...state, dispatch}}>
      { children }
    </WorklogsContext.Provider>
  )
}
