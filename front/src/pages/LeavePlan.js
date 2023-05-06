import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useAuthContext } from "../hooks/useAuthContext";

function LeavePlan() {
  const { user } = useAuthContext();
  const [holidays, setHolidays] = React.useState([]);
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
         // setHolidays(json)
       }
     }
     if (user) {
       fetchHolidays();
     }
   },[user]);

   const tileClassName = ({ date, view }) => {
    
    if (
      view === "month" &&
      holidays.find((holiday) => holiday.date.toDateString() === date.toDateString())
    ) {
      return "holiday-tile";
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

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if(!holidays.find((holiday) => holiday.date.toDateString() === date.toDateString())){
        const name = prompt('Note for Leave: ');
        if (name) {
        const confirmed = window.confirm(`Hi ${name}, are you sure you want to select this date: ${date.toString()}?`);
        if (confirmed) {
            alert('Leave added');
        } else {
            alert('You have cancelled!');
        }
        }
    }
  };
  

  return (
    <div className="section">
        <div className="container">
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
        </div>
    </div>
  )
}

export default LeavePlan
