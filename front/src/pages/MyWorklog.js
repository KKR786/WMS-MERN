import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useWorklogsContext } from "../hooks/useWorklogsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";
import Select from "react-select";

export default function MyWorklog() {
  const { monthlyWorklogs, dispatch } = useWorklogsContext();
  const { user } = useAuthContext();
  const { logout } = useLogout();

  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const options = [];
  const startDate = new Date(user.joiningDate);
  const endDate = new Date();

  let currentDate = startDate;
  while (
    currentDate < endDate ||
    currentDate.getMonth() === endDate.getMonth()
  ) {
    const monthLabel = currentDate.toLocaleString("default", { month: "long" });
    const yearLabel = currentDate.getFullYear();
    const optionValue = `${
      currentDate.getMonth() + 1
    }-${currentDate.getFullYear()}`;
    const optionLabel = `${monthLabel} ${yearLabel}`;
    options.push({ value: optionValue, label: optionLabel });
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  // Set the initial state to the current month's option
  const defaultMonth = new Date().toLocaleString("default", { month: "long" });

  const defaultYear = new Date().getFullYear();

  const defaultOption = options.find(
    (option) => option.label === `${defaultMonth} ${defaultYear}`
  );

  const [selectedOption, setSelectedOption] = useState(defaultOption);
  const [selectedMonth, selectedYear] = selectedOption.value.split("-");
  console.log(selectedMonth, selectedYear);
  useEffect(() => {
    const fetchWorklogs = async () => {
      const response = await fetch(
        `/api/worklogs/${user.id}?month=${selectedMonth}&year=${selectedYear}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      const json = await response.json();
      if (response.status === 401) {
        alert("You are not authorized to view this page. Please login.");
        logout();
        return;
      }
      if (response.ok) {
        dispatch({ type: "GET_MONTHLY_WORKLOGS", payload: json });
        setLoading(false);

        const totalHours = Object.values(json).reduce(
          (total, worklog) => total + worklog.time / 60,
          0
        );
        setTotal(totalHours);
      }
    };

    if (user) {
      fetchWorklogs();
    }
  }, [dispatch, user, selectedMonth]);

  return (
    <div className="section">
      <div className="container">
        <div className="d-flex justify-content-between my-4">
          <h1 className="text-center">Worklogs</h1>
          <Select
            options={options}
            value={selectedOption}
            onChange={setSelectedOption}
            placeholder="Select a month and year"
            className="w-25 h5"
          />
        </div>
        <div className="text-right">
          <Link to='/worklog' className="add-link">
            <span className="material-symbols-outlined mr-2">edit_note</span>
              Work Entry
          </Link>
        </div>
        {loading ? (
          <p>loading..</p>
        ) : (
          <>
            {monthlyWorklogs && (
              <>
                {isNaN(total) ? (
                  <p>No data to display.</p>
                ) : (
                  <div>
                    <div className='d-flex justify-content-between'>
                      <h5 className="my-4">Total Hours: {total.toFixed(2)}</h5>
                      
                    </div>
                    <table>
                      <thead className="text-white">
                        <tr>
                          <th>Date</th>
                          <th>Ticket ID</th>
                          <th>Domain</th>
                          <th>Agency</th>
                          <th>Work Type</th>
                          <th>Hours</th>
                        </tr>
                      </thead>
                      <tbody>
                        {monthlyWorklogs &&
                          Object.values(monthlyWorklogs).map((worklog, i) => (
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
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
