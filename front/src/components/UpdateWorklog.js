import React, { useState } from "react";
import { useWorklogsContext } from "../hooks/useWorklogsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import Select from "react-select";

export default function UpdateWorklog(props) {
  const [ticketId, setTicketId] = useState("");
  const [domain, setDomain] = useState("");
  const [agency, setAgency] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("");
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const { worklog, dispatch } = useWorklogsContext();
  const { user } = useAuthContext();


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

  function handleMouseDown(event) {
    setIsDragging(true);
    setPosition({
      x: event.clientX - event.target.offsetLeft,
      y: event.clientY - event.target.offsetTop
    });
  }

  function handleMouseMove(event) {
    if (isDragging) {
      const x = event.clientX - position.x;
      const y = event.clientY - position.y;
      setPosition({ x, y });
    }
  }

  function handleMouseUp() {
    setIsDragging(false);
  }
console.log(props.id)
  React.useEffect(() => {
    const fetchWorklogs = async () => {
      const response = await fetch(`/api/worklogs/unique/${props.id}`, {
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
      <div className="popup-header" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}>
        <span className="float-right top-0 cancel" onClick={()=>props.state(false)}>X</span>
        <h3 className="text-center">Update Worklog</h3>
      </div>
      <form className="d-flex flex-wrap justify-content-between mt-5" onSubmit={handleSubmit}>
        <div className="reEntry">
          <label>Ticket_Id:</label>
          <input
            type="number"
            value={ticketId}
            min="0"
            onChange={(e) => setTicketId(e.target.value)}
            className={emptyFields.includes("ticketId") ? "error" : ""}
          />
        </div>

        <div className="reEntry">
          <label>Domain:</label>
          <input
            type="text"
            onChange={(e) => setDomain(e.target.value)}
            value={domain}
            className={emptyFields.includes("domain") ? "error" : ""}
          />
        </div>

        <div className="reEntry">
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

        <div className="reEntry">
          <label>Time (in min):</label>
          <input
            type="number"
            onChange={(e) => setTime(e.target.value)}
            value={time}
            min="0"
            className={emptyFields.includes("time") ? "error" : ""}
          />
        </div>

        <div className="reEntry">
          <label>Work Type:</label>
          <input
            type="text"
            onChange={(e) => setType(e.target.value)}
            value={type}
            className={emptyFields.includes("type") ? "error" : ""}
          />
        </div>
        <button className="updateBtn">Update</button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
    }
    </>
  );
}
