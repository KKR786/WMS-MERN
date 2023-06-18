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
  const [note, setNote] = useState("");
  const [users, setUsers] = useState([{}])
  const [usersTag, setUsersTag] = useState([])
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [domains, setDomains] = useState([{}]);
  const [agencies, setAgencies] = useState([]);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const { worklog, dispatch } = useWorklogsContext();
  const { user } = useAuthContext();


  React.useEffect(()=>{
    if(worklog) {
      console.log(worklog.usersTag)
        setTicketId(worklog.ticketId);
        setDomain(worklog.domain);
        setAgency(worklog.agency);
        setTime(worklog.time);
        setType(worklog.type);
        setNote(worklog.note);
        setUsersTag(worklog.usersTag);
    }
  },[worklog])
  
    
  React.useEffect(() => {
    const fetchDomains = async () => {
      const res = await fetch("/api/system/domains", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const json = await res.json();

      if (res.ok) {
        console.log(json)
        const domainList = json.map((data) => ({d: data.domain, a: data.agency}));
        console.log(domainList)
        setDomains(domainList);
        const agencyList = [...new Set(json.map((data) => data.agency))];
        setAgencies(agencyList);
      }
    };

    if (user) {
      fetchDomains();
    }
  },[user])

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

    let users = [];
    if(usersTag) {
      usersTag.map((user, i) => users[i] = user.label);
      console.log(users);
    }

    const worklog = { ticketId, domain, agency, time, type, note, usersTag: users };

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
      props.state(false)
      setTicketId("");
      setDomain("");
      setAgency("");
      setTime("");
      setType("");
      setNote("");
      setUsersTag([]);
      setError(null);
      setEmptyFields([]);
      dispatch({ type: "UPDATE_WORKLOG", payload: json });
    }
  };

  React.useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch('/api/users', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const json = await res.json();

      if (res.ok) {
        const userList = json.map((data) => {return {
          name: data.name,
          id: data._id
        }});
        setUsers(userList);
      }
    };

    if (user) {
      fetchUsers();
    }
  }, [ user]);

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
        <Select 
          placeholder = {domain}
          options = {domains.map((domain) => ({ value: domain.d, label: domain.d }))}
          value={domains.find((obj) => obj.value === domain)}
          onChange={(e) => {
            setDomain(e.value);
            const selectedDomain = e.value;
            const filteredAgency = domains.find((domain) => domain.d === selectedDomain)?.a || [];
            setAgency(filteredAgency);
          }}
          className={emptyFields.includes("domain") ? "error" : ""}
          id="domain"
        />
      </div>

      <div className="reEntry">
        <label>Agency:</label>
        <Select 
          placeholder = {agency ? agency : "Select Agency"}
          options = {agencies.map((agency) => ({ value: agency, label:agency }))}
          value={agencies.find(obj => obj.value === agency)}
          onChange = {(e) => setAgency(e.value)} 
          className = {emptyFields.includes("agency") ? "error" : ""}
          id = "agency"
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
        <div className="reEntry">
          <label>Note:</label>
          <input
            type="text"
            onChange={(e) => setNote(e.target.value)}
            value={note}
          />
        </div>
        <div className="reEntry">
          <label>Tag User:</label>
          <Select 
            placeholder="Select User"
            isMulti
            options={[...users.map((user) => ({ value: user.id, label: user.name }))]}
            value={usersTag}
            onChange={(option) => setUsersTag(option)}
            id="type"
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
