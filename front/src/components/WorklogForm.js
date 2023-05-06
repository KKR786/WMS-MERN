import { useState, useEffect } from "react";
import { useWorklogsContext } from "../hooks/useWorklogsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import Select from 'react-select';

const WorklogForm = (props) => {
  const { dispatch } = useWorklogsContext();
  const { user } = useAuthContext();

  let newDate = new Date()
  const currentDate = newDate.getFullYear()+'-'+newDate.toLocaleString("en-US", { month : '2-digit'})+'-'+newDate.toLocaleString("en-US", { day : '2-digit'})

  const currentMonthFirstDate = new Date(
    newDate.getFullYear(),
    newDate.getMonth(),
    1
  );
    const nextMonthFirstDate = new Date(
      newDate.getFullYear(),
      newDate.getMonth() + 1,
      1
    )
  const startDate = currentMonthFirstDate.toLocaleDateString("en-CA")
  const maxDate = nextMonthFirstDate.toLocaleDateString('en-CA')

  const [date, setDate] = useState(currentDate);
  const [ticketId, setTicketId] = useState("");
  const [domain, setDomain] = useState("");
  const [agency, setAgency] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("");
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [domains, setDomains] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [savedTypes, setSaveTypes] = useState([])
  
  useEffect(() => {
    const fetchDomains = async () => {
      const res = await fetch("/api/system/domains", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const json = await res.json();

      if (res.ok) {
        console.log(json)
        const domainList = json.map((data) => data.domain);
        setDomains(domainList);
        const agencyList = [...new Set(json.map((data) => data.agency))];
        setAgencies(agencyList);
      }
    };

    if (user) {
      fetchDomains();
    }
  },[user])
  console.log(domains, agencies)
  useEffect(() => {
    const fetchWorkTypes = async () => {
        const res = await fetch('/api/system/work_types', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const json = await res.json();
  
        if (res.ok) {
          const workTypes = json.map((data) => data.type);
          setSaveTypes(workTypes)
        }
      };
  
      if (user) {
        fetchWorkTypes();
      }
    }, [ user])

  const handleDateChange = (e) => {
    setDate(e.target.value);
    props.handle(e.target.value);
  }
  
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
    <div className="mt-4">
    <h3 className="text-center">Entry Your Work</h3>
    <form className="d-flex flex-wrap justify-content-between mt-4" onSubmit={handleSubmit}>
      <div className="entry">
        <label>Date:</label>
        <input
          type="date"
          min={startDate}
          max={maxDate}
          onChange={handleDateChange}
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
          min="0"
          className={emptyFields.includes("ticketId") ? "error" : ""}
        />
      </div>

      <div className="entry">
        <label>Domain:</label>
        <Select 
          placeholder = "Select Domain"
          options = {domains.map((domain) => ({ value: domain, label: domain }))}
          value={domains.find((obj) => obj.value === domain)}
          onChange={(e) => setDomain(e.value)}
          className={emptyFields.includes("domain") ? "error" : ""}
          id="domain"
        />
      </div>

      <div className="entry">
        <label>Agency:</label>
        <Select 
          placeholder = "Select Agency"
          options = {agencies.map((agency) => ({ value: agency, label:agency }))}
          value={agencies.find(obj => obj.value === agency)}
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
          min="0"
          className={emptyFields.includes("time") ? "error" : ""}
        />
      </div>

      <div className="entry">
        <label>Work Type:</label>
        <Select 
          placeholder = "Select Work Type"
          options = {savedTypes.map((type) => ({ value: type, label: type }))}
          value={savedTypes.find(obj => obj.value === type)}
          onChange = {(e) => setType(e.value)} 
          className = {emptyFields.includes("type") ? "error" : ""}
          id = "type"
        />
      </div>
      <div className="entry">
        <button>Add</button>
      </div>
      {error && <div className="entry error">{error}</div>}
    </form>
    </div>
  );
};

export default WorklogForm;
