import React from 'react';
import { useWorklogsContext } from "../hooks/useWorklogsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import UpdateWorklog from './UpdateWorklog';

// date fns
import formatDistanceToNow from "date-fns/formatDistanceToNow";

const WorklogDetails = ({ worklogs, date }) => {
  const { dispatch } = useWorklogsContext();
  const { user } = useAuthContext();
  const [wId, setWId] = React.useState(null);
  const [edit, setEdit] = React.useState(false);

  
  const editBtn = React.useCallback((id) => {
    setWId(id);
    setEdit(true);
    console.log('p')
  }, []);

  
    const deleteOnClick = async (id) => {
      if (!user) {
        return;
      }

      const response = await fetch(`/api/worklogs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "DELETE_WORKLOG", payload: json });
      }
    };

  console.log(worklogs);

  return (
    <>
    {
      edit && 
      <UpdateWorklog id={wId} state={setEdit}/>
    }
      <div className="worklog-details">
        <h4>{date}</h4>
        <table>
          <thead className="bg-info text-white">
            <tr>
              <th>Ticket_Id</th>
              <th>Domain</th>
              <th>Agency</th>
              <th>Work_Type</th>
              <th>Hours</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {worklogs &&
              worklogs.map(
                (worklog, i) =>
                  date === worklog.date && (
                    <tr key={i} className='bg-light'>
                      <td>
                        <a
                          href={"https://jupiterplatform.com/Tickets/edit.php?id=".concat(
                            worklog.ticketId
                          )}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {worklog.ticketId}
                        </a>
                      </td>
                      <td>{worklog.domain}</td>
                      <td>{worklog.agency}</td>
                      <td>{worklog.type}</td>
                      <td>{(worklog.time / 60).toFixed(2)}</td>
                      <td>
                        <span className="material-symbols-outlined editBtn"
                          onClick={()=>editBtn(worklog._id)}
                        >
                          edit
                        </span>
                        <span
                          className="material-symbols-outlined deleteBtn"
                          onClick={()=>deleteOnClick(worklog._id)}
                        >
                          delete
                        </span>
                      </td>
                    </tr>
                  )
              )}
          </tbody>
        </table>
        {/* <p>{formatDistanceToNow(new Date(worklog.createdAt), { addSuffix: true })}</p> */}
      </div>
    </>
  );
};

export default WorklogDetails;
