import React, { useState } from "react";
import Select from "react-select";
import { useWorklogsContext } from "../hooks/useWorklogsContext";
import { useAuthContext } from "../hooks/useAuthContext";

function Reports() {
  const { worklogs, dispatch } = useWorklogsContext();
  const { user } = useAuthContext();
  // const [selectedMonth, setSelectedMonth] = useState({
  //   value: new Date().getMonth(),
  //   label: new Date().toLocaleString('default', { month: 'long' })
  // });
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
  const [domain, setDomain] = useState("");
  const [agency, setAgency] = useState("");
  const [reports, setReports] = useState(false);
  const [names, setNames] = useState([{}]);

  const options = [
    {label: "--Select--"},
    { value: "ABIT", label: "ABIT" },
    { value: "CSM", label: "CSM" },
    { value: "CSMBD", label: "CSMBD" },
  ];

  React.useEffect(() => {
    if (worklogs) {
      var usersId = [];
      worklogs.filter((worklog, i) => (usersId[i] = worklog.user_id));
      console.log(usersId);

      const usersData = [];

      // use Promise.all to wait for all the fetch calls to complete
      Promise.all(
        usersId.map(async (userId) => {
          const response = await fetch(`/api/users/unique?_id=${userId}`, {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          const json = await response.json();
          console.log(typeof json.user._id);
          if (response.ok) {
            usersData.push({ id: json.user._id, name: json.user.name });
          }
        })
      ).then(() => {
        // set the names state once with the accumulated users' data array
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
        const response = await fetch("/api/worklogs/reports", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            startDate,
            endDate,
            domain,
            agency,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          setReports(true);
          dispatch({ type: "GET_WORKLOGS", payload: data });
        } else {
          return response("No Data Found");
        }
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    }
  };
  
  names.forEach((user) => console.log(user.name));

  return (
    <div className="section">
      <div className="container">
        <h2 className="text-center">Reports</h2>
        <form className="report mt-5" onSubmit={handleSubmit}>
          <div className="report-item">
            <label>Start Date:</label>
            <input
              type="date"
              onChange={(e) => setStartDate(e.target.value)}
              value={startDate}
            />
            {/* <label>Select Month:</label>
            <Select options={months} value={selectedMonth} onChange={handleChange} id="agency"/> */}
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
            <label>Domain:</label>
            <input
              type="text"
              onChange={(e) => setDomain(e.target.value)}
              value={domain}
            />
          </div>
          <div className="report-item">
            <label>Agency:</label>
            <Select
              placeholder="Select Agency"
              options={options}
              value={options.find((obj) => obj.value === agency)}
              onChange={(e) => setAgency(e.value)}
              id="agency"
            />
          </div>
          <div className="m-auto">
            <button className="btn-info">Generate</button>
          </div>
        </form>
        {reports && (
          <div>
            <table>
              <thead className="bg-info text-white">
                <tr>
                  <th>Date</th>
                  <th>ID</th>
                  <th>Domain</th>
                  <th>Agency</th>
                  <th>Work_Type</th>
                  <th>Hours</th>
                  <th>User</th>
                </tr>
              </thead>
              <tbody>
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
                        {names.find((data) => data.id === worklog.user_id)?.name || ''}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reports;
