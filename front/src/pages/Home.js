import React from "react";
import Select from 'react-select';
import "react-calendar/dist/Calendar.css";
import { useAuthContext } from "../hooks/useAuthContext";
import { useWorklogsContext } from "../hooks/useWorklogsContext";
import { useLogout } from "../hooks/useLogout";
import PieChart from "../components/charts/PieChart";

export default React.memo(function Home() {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const { monthlyWorklogs, dispatch } = useWorklogsContext();

  const [total, setTotal] = React.useState(0);
  const [monthlyTotal, setMonthlyTotal] = React.useState(0);
  const [totalMonthlyHours, setTotalMonthlyHours] = React.useState([{}]);
  const [csm, setCsm] = React.useState(0);
  const [abit, setAbit] = React.useState(0);
  const [monthlyCsm, setMonthlyCsm] = React.useState(0);
  const [monthlyAbit, setMonthlyAbit] = React.useState(0);
  
  const options = [];
  const startDate = new Date(user.joiningDate);
  const endDate = new Date();

  let currentDate = startDate;
  while (currentDate < endDate || currentDate.getMonth() === endDate.getMonth()) {
    const monthLabel = currentDate.toLocaleString('default', { month: 'long' });
    const yearLabel = currentDate.getFullYear();
    const optionValue = `${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;
    const optionLabel = `${monthLabel} ${yearLabel}`;
    options.push({ value: optionValue, label: optionLabel });
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  
  // Set the initial state to the current month's option
  const defaultMonth = new Date().toLocaleString('default', { month: 'long' });
  
  const defaultYear = new Date().getFullYear();
  
  const defaultOption = options.find(
    option => option.label === `${defaultMonth} ${defaultYear}`
  );
  
  const [selectedOption, setSelectedOption] = React.useState(defaultOption);
  const [selectedMonth, selectedYear] = selectedOption.value.split('-');
   
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
  const date = new Date()
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const [holidays, setHolidays] = React.useState([]);

  React.useEffect(() => {
    const fetchHolidays = async() => {
     const res = await fetch("/api/system/holidays", {
       headers: { Authorization: `Bearer ${user.token}` }
       });
 
       const json = await res.json();
       if(res.ok) {
         // json.map((d) => {
         //   console.log(new Date(d.date).toLocaleString('en-ca', {dateStyle: 'short'}));
         // })
         setHolidays([...holidays, ...json.map((day) => ({ date: new Date(day.date), name: day.title}))])
         // setHolidays(json)
       }
     }
     if (user) {
       fetchHolidays();
     }
   },[user]);
  
  function getTotalWorkDays(joiningDate) {
    const today = new Date();
    let workDays = 0;
    
    // Calculate the number of days between the joining date and today
    const daysBetween = Math.ceil((today.getTime() - joiningDate.getTime()) / (1000 * 3600 * 24));
  
    // Loop through each day and count the number of working days
    for (let i = 0; i < daysBetween; i++) {
      const date = new Date(joiningDate.getTime() + (i * 1000 * 3600 * 24));
      const daysOfWeek = date.getDay();
      const isHoliday = holidays.some(
        (holiday) => holiday.date === date.getTime()
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
  
  const joiningYear = joiningDate.getFullYear();
  
  const joiningMonth = joiningDate.getMonth();


  let workDays = 0;
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    const daysOfWeek = date.getDay();
    const isHoliday = holidays.some(
      (holiday) => holiday.date === date.getTime()
    );
    if (daysOfWeek !== 0 && daysOfWeek !== 6 && !isHoliday) {
      workDays++;
    }
  }
  

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
        `/api/protected/monthly-logs?month=${
          selectedMonth
        }&year=${selectedYear}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      const json = await response.json();
      console.log(json)
      if(response.status === 401) {
        alert('You are not authorized to view this page. Please login.')
        logout();
        return;
      }
      if (response.ok) {
        if(json) {
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

          const totalMonthlyHours = [
            { x: "CSM", y: Number(csmHours.toFixed(2)), color: '#f1bf64' },
            { x: "ABIT", y: Number(abitHours.toFixed(2)), color: '#36A2EB' },
          ];
        
          setTotalMonthlyHours(totalMonthlyHours);
        }
      }
    };

    if (user) {
      fetchWorklogs();
    }
  }, [ user, selectedMonth ]);

  React.useEffect(() => {
    const fetchWorklogs = async () => {
      const response = await fetch(
        `/api/worklogs/${user.id}?month=${
          selectedMonth
        }&year=${selectedYear}`,
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
  }, [dispatch, user, selectedMonth]);


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
  
  return (
    <div className="section">
      <div className="container">
        <h1 className="h3 my-4">
          <strong>Analytics</strong> Dashboard
        </h1>
        <h4 style={{color: "#3c536a"}}>Lifetime Record</h4>
        <div className="row mt-4">
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
        <div className="d-flex justify-content-between my-4">
          <h4 style={{color: "#3c536a"}}>Monthly Record</h4>
          <Select
            options={options}
            value={selectedOption}
            onChange={setSelectedOption}
            placeholder="Select a month and year"
            className="w-25 h5"
          />
  
        </div>
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
                    {selectedOption.label}
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
                    {selectedOption.label}
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
                    {selectedOption.label}
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
                    {selectedOption.label}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {user.role==='Super-Admin' &&
        <div className="row mt-5">
          <div className="col-md-6">
            <PieChart data={totalMonthlyHours} month={selectedOption.label}/>
          </div>
        </div>
}
      </div>
    </div>
  );
});
