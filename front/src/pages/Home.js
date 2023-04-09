import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useAuthContext } from "../hooks/useAuthContext";
import { useWorklogsContext } from "../hooks/useWorklogsContext";
import { useLogout } from "../hooks/useLogout";

export default React.memo(function Home() {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const { monthlyWorklogs, dispatch } = useWorklogsContext();
  const [total, setTotal] = React.useState(0);
  const [monthlyTotal, setMonthlyTotal] = React.useState(0);
  const [csm, setCsm] = React.useState(0);
  const [abit, setAbit] = React.useState(0);
  const [monthlyCsm, setMonthlyCsm] = React.useState(0);
  const [monthlyAbit, setMonthlyAbit] = React.useState(0);

  let date = new Date();
  const [selectedDate, setSelectedDate] = React.useState(date);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const nationalHolidays = [
    { date: new Date(2023, 0, 1), name: "New Year's Day" },
    {
      date: new Date(2023, 3, 21),
      name: "National Sovereignty and Children's Day",
    },
    { date: new Date(2023, 4, 1), name: "Labor and Solidarity Day" },
    {
      date: new Date(2023, 4, 19),
      name: "Commemoration of Atatürk, Youth and Sports Day",
    },
    { date: new Date(2023, 6, 15), name: "Democracy and National Unity Day" },
    { date: new Date(2023, 7, 30), name: "Victory Day" },
    { date: new Date(2023, 9, 29), name: "Republic Day" },
  ];

  function getTotalWorkDays(joiningDate) {
    const today = new Date();
    let workDays = 0;
    
    // Calculate the number of days between the joining date and today
    const daysBetween = Math.ceil((today.getTime() - joiningDate.getTime()) / (1000 * 3600 * 24));
  
    // Loop through each day and count the number of working days
    for (let i = 0; i < daysBetween; i++) {
      const date = new Date(joiningDate.getTime() + (i * 1000 * 3600 * 24));
      const daysOfWeek = date.getDay();
      const isHoliday = nationalHolidays.some(
        (holiday) => holiday.date.getTime() === date.getTime()
      );
      if (daysOfWeek !== 0 && daysOfWeek !== 6 && !isHoliday) {
        workDays++;
      }
    }
    
    // Subtract any non-working days at the beginning or end of the time period
    const startDay = joiningDate.getDay();
    if (startDay === 0) {
      workDays--;
    } else if (startDay === 6) {
      workDays --;
    }
  
    const endDay = today.getDay();
    if (endDay === 0) {
      workDays--;
    } else if (endDay === 6) {
      workDays -= 1;
    }
    
    return workDays;
  }
  
  const joiningDate = new Date(user.joiningDate);
  console.log(joiningDate)
  console.log(getTotalWorkDays(joiningDate))
  const joiningYear = joiningDate.getFullYear();
  console.log(joiningYear)
  const joiningMonth = joiningDate.getMonth();
  console.log(joiningMonth)


  let workDays = 0;
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    const daysOfWeek = date.getDay();
    const isHoliday = nationalHolidays.some(
      (holiday) => holiday.date.getTime() === date.getTime()
    );
    if (daysOfWeek !== 0 && daysOfWeek !== 6 && !isHoliday) {
      workDays++;
    }
  }
  console.log(workDays);
  const tileClassName = ({ date, view }) => {
    if (
      view === "month" &&
      nationalHolidays.find(
        (holiday) => holiday.date.getTime() === date.getTime()
      )
    ) {
      return "holiday-tile";
    }
    return null;
  };
  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const holiday = nationalHolidays.find(
        (holiday) => holiday.date.getTime() === date.getTime()
      );
      if (holiday) {
        return <span className="holiday-tooltip">{holiday.name}</span>;
      }
    }
    return null;
  };

  React.useEffect(() => {
    const fetchWorklogs = async () => {
      const response = await fetch("/api/worklogs", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "GET_WORKLOGS", payload: json });
        if (json && json.length) {
          const filterCSM = json.filter(
            (worklog) => "CSM" === worklog.agency
          );
          const csmHours = filterCSM.reduce(
            (total, worklog) => total + worklog.time / 60,
            0
          );
          const filterABIT = json.filter(
            (worklog) => "ABIT" === worklog.agency
          );
          const abitHours = filterABIT.reduce(
            (total, worklog) => total + worklog.time / 60,
            0
          );
          const totalHours = json.reduce(
            (total, worklog) => total + worklog.time / 60,
            0
          );
          setTotal(totalHours);
          setCsm(csmHours);
          setAbit(abitHours);
        } else {
          setTotal(0);
          setCsm(0);
          setAbit(0);
        }
      }
    };

    if (user) {
      fetchWorklogs();
    }
  }, [dispatch, user]);

  React.useEffect(() => {
    const fetchWorklogs = async () => {
      const response = await fetch(
        `/api/worklogs/${user.id}?month=${
          selectedDate.getMonth() + 1
        }&year=${date.getFullYear()}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      const json = await response.json();
      if(response.status === 401) {
        alert('You are not authorized to view this page. Please login.')
        logout();
        return;
      }
      if (response.ok) {
        dispatch({ type: "GET_MONTHLY_WORKLOGS", payload: json });
        //setLoading(false);
      }
    };

    if (user) {
      fetchWorklogs();
    }
  }, [dispatch, user, selectedDate]);

  console.log(monthlyWorklogs);

  React.useEffect(() => {
    if (monthlyWorklogs && monthlyWorklogs.length) {
      const filterCSM = monthlyWorklogs.filter(
        (worklog) => "CSM" === worklog.agency
      );
      const csmHours = filterCSM.reduce(
        (total, worklog) => total + worklog.time / 60,
        0
      );
      const filterABIT = monthlyWorklogs.filter(
        (worklog) => "ABIT" === worklog.agency
      );
      const abitHours = filterABIT.reduce(
        (total, worklog) => total + worklog.time / 60,
        0
      );
      const totalHours = monthlyWorklogs.reduce(
        (total, worklog) => total + worklog.time / 60,
        0
      );
      setMonthlyTotal(totalHours);
      setMonthlyCsm(csmHours);
      setMonthlyAbit(abitHours);
    } else {
      setMonthlyTotal(0);
      setMonthlyCsm(0);
      setMonthlyAbit(0);
    }
  }, [monthlyWorklogs]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="h3 my-4">
          <strong>Analytics</strong> Dashboard
        </h1>
        <h4 style={{color: "#3c536a"}}>Lifetime Record</h4>
        <div className="row">
          <div className="col-sm-6 col-xl-3">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col mt-0">
                    <h5 className="card-title">Total Hours</h5>
                    <h2>{total.toFixed(2)}</h2>
                  </div>
                  <div className="col-auto text-center m-auto">
                    <div className="card-icon" id="i-1">
                      <span className="material-symbols-outlined icon">
                        schedule
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-muted">
                    Since {monthNames[joiningMonth]}, {joiningYear}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col mt-0">
                    <h5 className="card-title">Avg. Hours</h5>
                    <h2>{(total / getTotalWorkDays(joiningDate)).toFixed(2)}</h2>
                  </div>
                  <div className="col-auto text-center m-auto">
                    <div className="card-icon" id="i-2">
                      <span className="material-symbols-outlined icon">
                        avg_time
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-muted">
                    Since {monthNames[joiningMonth]}, {joiningYear}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col mt-0">
                    <h5 className="card-title">CSM Hours</h5>
                    <h2>{csm.toFixed(2)}</h2>
                  </div>
                  <div className="col-auto text-center m-auto">
                    <div className="card-icon" id="i-3">
                    <span className="material-symbols-outlined icon">
                      rocket_launch
                    </span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-muted">
                    Since {monthNames[joiningMonth]}, {joiningYear}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col mt-0">
                    <h5 className="card-title">ABIT Hours</h5>
                    <h2>{abit.toFixed(2)}</h2>
                  </div>
                  <div className="col-auto text-center m-auto">
                    <div className="card-icon" id="i-4">
                      <span className="material-symbols-outlined icon">
                        home_work
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-muted">
                    Since {monthNames[joiningMonth]}, {joiningYear}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h4 style={{color: "#3c536a"}}>Monthly Record</h4>
        <div className="row">
          <div className="col-sm-6 col-xl-3">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col mt-0">
                    <h5 className="card-title">Total Hours</h5>
                    <h2>{monthlyTotal.toFixed(2)}</h2>
                  </div>
                  <div className="col-auto text-center m-auto">
                    <div className="card-icon" id="i-1">
                      <span className="material-symbols-outlined icon">
                        schedule
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-muted">
                    {monthNames[selectedDate.getMonth()]}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col mt-0">
                    <h5 className="card-title">Avg. Hours</h5>
                    <h2>{(monthlyTotal / workDays).toFixed(2)}</h2>
                  </div>
                  <div className="col-auto text-center m-auto">
                    <div className="card-icon" id="i-2">
                      <span className="material-symbols-outlined icon">
                        avg_time
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-muted">
                    {monthNames[selectedDate.getMonth()]}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col mt-0">
                    <h5 className="card-title">CSM Hours</h5>
                    <h2>{monthlyCsm.toFixed(2)}</h2>
                  </div>
                  <div className="col-auto text-center m-auto">
                    <div className="card-icon" id="i-3">
                    <span className="material-symbols-outlined icon">
                      rocket_launch
                    </span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-muted">
                    {monthNames[selectedDate.getMonth()]}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col mt-0">
                    <h5 className="card-title">ABIT Hours</h5>
                    <h2>{monthlyAbit.toFixed(2)}</h2>
                  </div>
                  <div className="col-auto text-center m-auto">
                    <div className="card-icon" id="i-4">
                      <span className="material-symbols-outlined icon">
                        home_work
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-muted">
                    {monthNames[selectedDate.getMonth()]}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <Calendar
              value={selectedDate}
              onChange={handleDateChange}
              tileContent={tileContent}
              tileClassName={tileClassName}
            />
          </div>
          <div className="col-md-6"></div>
        </div>
      </div>
    </div>
  );
});
