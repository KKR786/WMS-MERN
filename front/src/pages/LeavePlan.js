import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useAuthContext } from "../hooks/useAuthContext";

function LeavePlan() {
  const { user } = useAuthContext();
  const [leaveForm, setLeaveForm] = React.useState(false)
  const [leaveTitle, setLeaveTitle] = React.useState("");
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);
  const [holidays, setHolidays] = React.useState([]);
  const [leaveDays, setLeaveDays] = React.useState([]);
  const [totalLeave, setTotalLeave] = React.useState(0);
  let date = new Date();
  const [selectedDate, setSelectedDate] = React.useState(date);

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
       }
     }
     if (user) {
       fetchHolidays();
     }
   },[user]);

   React.useEffect(() => {
    const fetchLeavedays = async() => {
     const res = await fetch("/api/user/leaves", {
       headers: { Authorization: `Bearer ${user.token}` }
       });
 
       const json = await res.json();
       if(res.ok) {
        setLeaveDays([...leaveDays, ...json.map((day) => ({ date: new Date(day.leaveDate), name: day.leaveTitle}))])
       }
     }
     if (user) {
       fetchLeavedays();
     }
   },[user]);

   React.useEffect(() => {
        const leavesCount = leaveDays.filter((leave) => {
        const leaveDate = new Date(leave.date);
        const current = new Date()
        const currentYear = current.getFullYear();
        const currentMonth = current.getMonth() + 1;
        console.log(currentMonth)
        
        const julyFirst = currentMonth < 7 ? new Date(`${currentYear-1}-07-01`) : new Date(`${currentYear}-07-01`);
        const nextJune = currentMonth < 7 ? new Date(`${currentYear}-06-30`) : new Date(`${currentYear+1}-06-30`);
    
        return leaveDate >= julyFirst && leaveDate <= nextJune;
      }).length;
      setTotalLeave(leavesCount);
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
      
      if (holiday) {
        return <span className="holiday-tooltip">{holiday.name}</span>;
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

  return (
    <div className="section">
        <div className="container">
        {
            leaveForm && (
            <div className="form-popup m-auto">
            <span
              className="float-right top-0 cancel"
              onClick={() => {setLeaveForm(false);setSuccess("");
              setError('')}}
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
        <h3 className="text-center mt-5">Total Leave: {totalLeave}</h3>
        </div>
    </div>
  )
}

export default LeavePlan
