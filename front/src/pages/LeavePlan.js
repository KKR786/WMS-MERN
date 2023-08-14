import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useAuthContext } from "../hooks/useAuthContext";

function LeavePlan() {
  const { user } = useAuthContext();
  const [userIds, setUserIds] = React.useState([])
  const [names, setNames] = React.useState([{}])
  const [leaveForm, setLeaveForm] = React.useState(false)
  const [leaveTitle, setLeaveTitle] = React.useState("");
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);
  const [holidays, setHolidays] = React.useState([]);
  const [leaveDays, setLeaveDays] = React.useState([]);
  const [filteredLeaves, setFilteredLeaves] = React.useState([]);
  const [totalLeave, setTotalLeave] = React.useState(0);
  let date = new Date();
  const [selectedDate, setSelectedDate] = React.useState(date);

  React.useEffect(() => {
    const fetchHolidays = async () => {
      const res = await fetch("/api/system/holidays", {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      const json = await res.json();
      if (res.ok) {
        setHolidays([...holidays, ...json.map((day) => ({ date: new Date(day.date), name: day.title }))])
      }
    }
    if (user) {
      fetchHolidays();
    }
  }, [user]);

  React.useEffect(() => {
    const userOnLeave = async () => {
      const res = await fetch(`/api/user/leave/day?date=${selectedDate.toLocaleDateString('en-CA')}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      const json = await res.json();
      console.log(json.user_id)
      if(res.ok) {
        setUserIds(json.map((l) => l.user_id));
      }
    }
    if (user) {
      userOnLeave();
    }
  }, [user, selectedDate])
console.log(userIds)

React.useEffect(() => {
  if (userIds) {
    
    const usersData = [];

    // use Promise.all to wait for all the fetch calls to complete
    Promise.all(
      userIds.map(async (userId) => {
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
}, [userIds, user]);
console.log(names)

  React.useEffect(() => {
    const fetchLeavedays = async () => {
      const res = await fetch("/api/user/leaves", {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      const json = await res.json();
      if (res.ok) {
        setLeaveDays([...leaveDays, ...json.map((day) => ({ date: new Date(day.leaveDate), name: day.leaveTitle }))])
      }
    }
    if (user) {
      fetchLeavedays();
    }
  }, [user]);

  React.useEffect(() => {
    const leavesCount = leaveDays.filter((leave) => {
      const leaveDate = new Date(leave.date);
      const current = new Date()
      const currentYear = current.getFullYear();
      const currentMonth = current.getMonth() + 1;
      console.log(currentMonth)

      const julyFirst = currentMonth < 7 ? new Date(`${currentYear - 1}-07-01`) : new Date(`${currentYear}-07-01`);
      const nextJune = currentMonth < 7 ? new Date(`${currentYear}-06-30`) : new Date(`${currentYear + 1}-06-30`);

      return leaveDate >= julyFirst && leaveDate <= nextJune;
    });
    setFilteredLeaves(leavesCount)
    setTotalLeave(leavesCount.length);
  }, [leaveDays])


  console.log(leaveDays, holidays)
  console.log(totalLeave)

  const tileClassName = ({ date, view }) => {

    if (
      view === "month" &&
      holidays.find((holiday) => holiday.date.toDateString() === date.toDateString())
    ) {
      return "holiday-tile";
    }
    else if (
      view === "month" &&
      leaveDays.find((leaveDay) => leaveDay.date.toDateString() === date.toDateString())
    ) {
      return "leaveDay-tile";
    }
    return null;
  };

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const holiday = holidays.find(
        (holiday) => holiday.date.toDateString() === date.toDateString()
      );
      const leaveday = leaveDays.find((leaveDay) => leaveDay.date.toDateString() === date.toDateString());
      if (holiday) {
        return <span className="holiday-tooltip">{holiday.name}</span>;
      }

      if (leaveday) {
        console.log(leaveday.name);
        return <span className="leaveDay-tooltip">{leaveday.name}</span>;
      }

    }
    return null;
  };

  const leaveSubmit = async (e) => {

    e.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }
    const leaveDate = new Date(selectedDate).toISOString().slice(0, 10);
    console.log(leaveDate);
    const leaveDay = { leaveDate, leaveTitle }
    const res = await fetch('/api/user/leave', {
      method: 'POST',
      body: JSON.stringify(leaveDay),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`
      }
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error);
      setSuccess('')
    }
    if (res.ok) {
      setSelectedDate("");
      setLeaveTitle('')
      setSuccess("Leave added successfully!");
      setError('')
    }
  }


  const handleDateChange = async (date) => {
    const selectedDate = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    setSelectedDate(selectedDate);

    if (
      !(holidays.find(
        (holiDay) => holiDay.date.toDateString() === selectedDate.toDateString()
      ) || leaveDays.find(
        (leaveDay) => leaveDay.date.toDateString() === selectedDate.toDateString()
      ))
    ) {
      setLeaveForm(true);
    }
  };
  if (leaveDays) {
    leaveDays.map((leave, i) => {
      console.log(leave.date.toDateString());
    })
  }

  return (
    <div className="section">
      <div className="container">
        {
          leaveForm && (
            <div className="form-popup m-auto">
              <span
                className="float-right top-0 cancel"
                onClick={() => {
                  setLeaveForm(false); setSuccess("");
                  setError('')
                }}
              >
                X
              </span>
              <h3 className="text-center">Add Leave</h3>
              <form
                className="d-flex flex-wrap justify-content-between mt-5"
                onSubmit={leaveSubmit}
              >
                <div className="agency-input">
                  <label>Note for Leave:</label>
                  <input
                    type="text"
                    onChange={(e) => setLeaveTitle(e.target.value)}
                    value={leaveTitle}
                  />
                </div>
                <div className="d-flex align-items-center">
                  <button className="updateBtn">Leave</button>
                </div>
                {error && <div className="error">{error}</div>}
              </form>
              {success && <div className="success">{success}</div>}
            </div>
          )}

        <h1 className="my-5 text-center">
          Yearly Calendar
        </h1>
        <div className="d-flex justify-content-center">
          <Calendar
            value={selectedDate}
            onChange={handleDateChange}
            tileContent={tileContent}
            tileClassName={tileClassName}
          />
        </div>
        <div className="row mt-5">
          <div className="col-md-6">
            <div className="leave-box">
              <h3 className="text-center">Total Leave: {totalLeave}</h3>
              <ul className={filteredLeaves.length >= 6 ? 'count-2' : ''}>
                {filteredLeaves &&
                  filteredLeaves.map((leave, i) => (
                    <li key={i} className='d-flex align-items-center'><span className="material-symbols-outlined mr-2">
                    event_busy
                    </span>{leave.date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</li>
                  ))}
              </ul>
            </div>
          </div>
          <div className="col-md-6">
            <div className="leave-box">
              <h3 className="text-center">Users on Leave</h3>
              {names &&
                <ul className={names.length >= 6 ? 'count-2' : ''}>
                  {names.map((name, i) => (
                    <li key={i} className='d-flex align-items-center'><span className="material-symbols-outlined mr-2">
                    person_off
                    </span>{name.name}</li>))}
                </ul>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeavePlan
