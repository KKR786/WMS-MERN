import { useState } from "react";
import {Link} from "react-router-dom"
import { useWorklogsContext } from "../hooks/useWorklogsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import Select from 'react-select';

const WorklogForm = (props) => {
  const { dispatch } = useWorklogsContext();
  const { user } = useAuthContext();

  let newDate = new Date()
  const currentDate = newDate.getFullYear()+'-'+newDate.toLocaleString("en-US", { month : '2-digit'})+'-'+newDate.toLocaleString("en-US", { day : '2-digit'})

  const [date, setDate] = useState(currentDate);
  const [ticketId, setTicketId] = useState("");
  const [domain, setDomain] = useState("");
  const [agency, setAgency] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("");
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  
  const options = [
    { value: 'ABIT', label: 'ABIT' },
    { value: 'CSM', label: 'CSM' },
    { value: 'CSMBD', label: 'CSMBD' }
  ]
  //console.log(date)
  props.handle(date)
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }

    const worklog = { date, ticketId, domain, agency, time, type }

    const response = await fetch("/api/worklogs", {
      method: "POST",
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
      setDate(date);
      setTicketId("");
      setDomain("");
      setAgency("");
      setTime("");
      setType("");
      setError(null);
      setEmptyFields([]);
      dispatch({ type: "CREATE_WORKLOG", payload: json });
    }
  };

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Entry Your Work</h3>
      <div className="entry">
        <label>Date:</label>
        <input
          type="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
          className={emptyFields.includes("date") ? "error" : ""}
        />
      </div>

      <div className="entry">
        <label>Ticket_Id:</label>
        <input
          type="number"
          onChange={(e) => setTicketId(e.target.value)}
          value={ticketId}
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
          placeholder = "Select Agency"
          options = {options}
          value={options.find(obj => obj.value === agency)}
          onChange = {(e) => setAgency(e.value)} 
          className = {emptyFields.includes("agency") ? "error" : ""}
          id = "agency"
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
      <Link to="/veiw">Veiw </Link>
      <button>Add</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default WorklogForm;
