import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useWorklogsContext } from "../hooks/useWorklogsContext";
import { useAuthContext } from "../hooks/useAuthContext";

function Reports() {
  const { worklogs, dispatch } = useWorklogsContext();
  const { user } = useAuthContext();
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(false);

  let newDate = new Date();
  const currentDate =
    newDate.getFullYear() +
    "-" +
    newDate.toLocaleString("en-US", { month: "2-digit" }) +
    "-" +
    newDate.toLocaleString("en-US", { day: "2-digit" });

  const currentMonthFirstDate = new Date(
    newDate.getFullYear(),
    newDate.getMonth(),
    1
  );

  const [startDate, setStartDate] = useState(
    currentMonthFirstDate.toLocaleDateString("en-CA")
  );
  const [endDate, setEndDate] = useState(currentDate);
  const [ticketId, setTicketId] = useState('')
  const [domain, setDomain] = useState("");
  const [agency, setAgency] = useState("");
  const [type, setType] = useState("");
  const [reports, setReports] = useState(false);
  const [names, setNames] = useState([{}]);
  const [domains, setDomains] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [users, setUsers] = useState([{}])
  const [user_id, setUser_Id] = useState('')
  const [savedTypes, setSaveTypes] = useState([])


  useEffect(() => {
    const fetchDomains = async () => {
      const res = await fetch("/api/system/domains", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const json = await res.json();

      if (res.ok) {
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

  useEffect(() => {
    if (worklogs) {
      var usersId = [];
      worklogs.filter((worklog, i) => (usersId[i] = worklog.user_id));

      const usersData = [];

      // use Promise.all to wait for all the fetch calls to complete
      Promise.all(
        usersId.map(async (userId) => {
          const response = await fetch(`/api/users/unique?_id=${userId}`, {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          const json = await response.json();
          
          if (response.ok) {
            usersData.push({ id: json.user._id, name: json.user.name });
          }
        })
      ).then(() => {
        setNames(usersData);
      });
    }
  }, [worklogs, user.token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in");
      return;
    } else {
      try {
        const response = await fetch("/api/protected/reports", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            startDate,
            endDate,
            ticketId,
            domain,
            agency,
            type,
            user_id
          }),
        });

        const data = await response.json();
        
        if (response.ok) {
          setReports(true);
          dispatch({ type: "GET_WORKLOGS", payload: data });
          const totalHours = data.reduce(
            (total, worklog) => total + worklog.time / 60,
            0
          );
          setTotal(totalHours);
          setError(false);
        } else if (response.status === 404) {
          setError(true);
          setReports(true)
        }
      } catch (error) {
        console.error(error);
      }
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
    <div className="section">
      <div className="container">
        <h2 className="text-center mt-4">Reports</h2>
        <form className="report mt-5" onSubmit={handleSubmit}>
          <div className="report-item">
            <label>Start Date:</label>
            <input
              type="date"
              onChange={(e) => setStartDate(e.target.value)}
              value={startDate}
            />
          </div>
          <div className="report-item">
            <label>End Date:</label>
            <input
              type="date"
              onChange={(e) => setEndDate(e.target.value)}
              value={endDate}
            />
          </div>
          <div className="report-item">
            <label>Ticket Id:</label>
            <input
              type="number"
              onChange={(e) => setTicketId(e.target.value)}
              value={ticketId}
              min="0"
            />
          </div>
          <div className="report-item">
            <label>Domain:</label>
            <Select 
              placeholder = "Select Domain"
              options = {[{ label: "--Select--" }, ...domains.map((domain) => ({ value: domain, label: domain }))]}
              value={domains.find((obj) => obj.value === domain)}
              onChange={(e) => setDomain(e.value)}
              id="domain"
            />
          </div>
          <div className="report-item">
            <label>Agency:</label>
            <Select 
              placeholder = "Select Agency"
              options = {[{ label: "--Select--" }, ...agencies.map((agency) => ({ value: agency, label:agency }))]}
              value={agencies.find(obj => obj.value === agency)}
              onChange = {(e) => setAgency(e.value)}
              id = "agency"
            />
          </div>
          <div className="report-item m-auto">
            <label>Work Type:</label>
            <Select 
              placeholder = "Select Work Type"
              options = {[{label: "--Select--" }, ...savedTypes.map((type) => ({ value: type, label: type }))]}
              value={savedTypes.find(obj => obj.value === type)}
              onChange = {(e) => setType(e.value)}
              id = "type"
            />
          </div>
          <div className="report-item m-auto">
            <label>User:</label>
            <Select 
              placeholder = "Select User"
              options = {[{ label: "--Select--" }, ...users.map((user) => ({ value: user.id, label: user.name }))]}
              value={users.find((obj) => obj.value === user_id)}
              onChange={(e) => setUser_Id(e.value)}
              id="type"
            />
          </div>
          <div className="m-auto">
            <button className="btn-info">Generate</button>
          </div>
        </form>
        {reports && (
          <div className="my-4">
            <div>
              <h5>
                Total Hours:{" "} 
               {total.toFixed(2)}
              </h5>
            </div>
            <table>
              <thead className="bg-info text-white">
                <tr>
                  <th>Date</th>
                  <th>Ticket ID</th>
                  <th>Domain</th>
                  <th>Agency</th>
                  <th>Work Type</th>
                  <th onClick={() => alert(`Total Hours: ${total.toFixed(2)}`)}>
                    Hours
                  </th>
                  <th>User</th>
                </tr>
              </thead>
              <tbody>
                {!error ? (
                  <>
                    {worklogs &&
                      worklogs.map((worklog, i) => (
                        <tr key={i} className="bg-light">
                          <td>{worklog.date}</td>
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
                            {names.find((data) => data.id === worklog.user_id)
                              ?.name || ""}
                          </td>
                        </tr>
                      ))}
                  </>
                ) : (
                  <tr>
                    <td colSpan="7" className="text-danger">No Data Found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reports;
