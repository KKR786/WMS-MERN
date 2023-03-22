import React from "react";
import { useWorklogsContext } from "../hooks/useWorklogsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import UpdateWorklog from "./UpdateWorklog";

// date fns
import formatDistanceToNow from "date-fns/formatDistanceToNow";

const WorklogDetails = ({ worklogs, date }) => {
  const [wId, setWId] = React.useState(null);
  const [edit, setEdit] = React.useState(false);
  const [details, setDetails] = React.useState(false);
  const [total, setTotal] = React.useState(0);
  const { dispatch } = useWorklogsContext();
  const { user } = useAuthContext();

  React.useEffect(() => {
    // if (worklogs) {
    //   const date = "2023-02-01";
    //   const date2 = "2023-02-04";
    //   const filteredWorklog = worklogs.filter((worklog) => {
    //     const logDate = new Date(worklog.date);
    //     return logDate >= new Date(date) && logDate <= new Date(date2);
    //   });
    //   const totalHour = filteredWorklog.reduce((total, worklog) => total + (worklog.time/60), 0);
    //   console.log(totalHour);
    // }
    if (worklogs) {
      const filteredWorklogs = worklogs.filter(
        (worklog) => date === worklog.date
      );
      const totalHours = filteredWorklogs.reduce(
        (total, worklog) => total + worklog.time / 60,
        0
      );
      setTotal(totalHours);
      if (filteredWorklogs.length > 0) {
        setDetails(true);
      } else {
        setDetails(false);
      }
    }
  }, [worklogs, date]);

  const editBtn = React.useCallback((id) => {
    setWId(id);
    setEdit(true);
    console.log("p");
  }, []);

  const deleteOnClick = async (id) => {
    if (!user) {
      return;
    }

    const response = await fetch(`/api/worklogs/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "DELETE_WORKLOG", payload: json });
    }
  };

  console.log(worklogs);

  return (
    <>
      {edit && <UpdateWorklog id={wId} state={setEdit} />}
      {details && (
        <div className="worklog-details">
          <div className="d-flex justify-content-between">
            <h4>{date}</h4>
            <h4 className="text-primary">
              Total Hour:{" "}
              <span className="text-success">{total.toFixed(2)}</span>
            </h4>
          </div>
          <table>
            <thead className="bg-info text-white">
              <tr>
                <th>ID</th>
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
                      <tr key={i} className="bg-light">
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
                          <span
                            className="material-symbols-outlined btn editBtn"
                            onClick={() => editBtn(worklog._id)}
                          >
                            edit
                          </span>
                          <span
                            className="material-symbols-outlined btn deleteBtn"
                            onClick={() => deleteOnClick(worklog._id)}
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
      )}
    </>
  );
};

export default WorklogDetails;
