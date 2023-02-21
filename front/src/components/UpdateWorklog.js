import React, { useState } from "react";
import { useWorklogsContext } from "../hooks/useWorklogsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import Select from "react-select";

export default function UpdateWorklog(props) {
  const { worklog, dispatch } = useWorklogsContext();
  const { user } = useAuthContext();

  const [ticketId, setTicketId] = useState("");
  const [domain, setDomain] = useState("");
  const [agency, setAgency] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("");
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  React.useEffect(()=>{
    if(worklog) {
        setTicketId(worklog.ticketId);
        setDomain(worklog.domain);
        setAgency(worklog.agency);
        setTime(worklog.time);
        setType(worklog.type);  
    }
  },[worklog])
  
    
  const options = [
    { value: "ABIT", label: "ABIT" },
    { value: "CSM", label: "CSM" },
    { value: "CSMBD", label: "CSMBD" },
  ];

  React.useEffect(() => {
    const fetchWorklogs = async () => {
      const response = await fetch(`/api/worklogs/${props.id}`, {
        headers: {'Authorization': `Bearer ${user.token}`},
      })
      const json = await response.json()
      console.log(json);
      if (response.ok) {
        dispatch({type: 'GET_WORKLOG', payload: json})
      }
    }
    if (user) {
      fetchWorklogs()
    }
  }, [dispatch, props.id, user])

console.log(worklog)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }

    const worklog = { ticketId, domain, agency, time, type };

    const response = await fetch(`/api/worklogs/${props.id}`, {
      method: "PATCH",
      body: JSON.stringify(worklog),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields);
    }
    if (response.ok) {
      setTicketId("");
      setDomain("");
      setAgency("");
      setTime("");
      setType("");
      setError(null);
      setEmptyFields([]);
      dispatch({ type: "UPDATE_WORKLOG", payload: json });
    }
  };

  return (
    <>
    {worklog &&
    <div className="form-popup">
      <form className="create" onSubmit={handleSubmit}>
        <h3>Update Worklog</h3>
        <span onClick={()=>props.state(false)}>X</span>

        <div className="entry">
          <label>Ticket_Id:</label>
          <input
            type="number"
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
            className={emptyFields.includes("ticketId") ? "error" : ""}
          />
        </div>

        <div className="entry">
          <label>Domain:</label>
          <input
            type="text"
            onChange={(e) => setDomain(e.target.value)}
            value={domain}
            className={emptyFields.includes("domain") ? "error" : ""}
          />
        </div>

        <div className="entry">
          <label>Agency:</label>
          <Select
            placeholder="Select Agency"
            options={options}
            value={options.find(obj => obj.value === agency)}
            onChange={(e) => setAgency(e.value)}
            className={emptyFields.includes("agency") ? "error" : ""}
            id="agency"
          />
        </div>

        <div className="entry">
          <label>Time (in min):</label>
          <input
            type="number"
            onChange={(e) => setTime(e.target.value)}
            value={time}
            className={emptyFields.includes("time") ? "error" : ""}
          />
        </div>

        <div className="entry">
          <label>Work Type:</label>
          <input
            type="text"
            onChange={(e) => setType(e.target.value)}
            value={type}
            className={emptyFields.includes("type") ? "error" : ""}
          />
        </div>
        <button>Update</button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
    }
    </>
  );
}
