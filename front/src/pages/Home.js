import React from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function Home() {
  let date = new Date()
  const [selectedDate, setSelectedDate] = React.useState(date);
  const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
  ];

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const nationalHolidays = [
    { date: new Date(2023, 0, 1), name: "New Year's Day" },
    { date: new Date(2023, 3, 21), name: "National Sovereignty and Children's Day" },
    { date: new Date(2023, 4, 1), name: "Labor and Solidarity Day" },
    { date: new Date(2023, 4, 19), name: "Commemoration of Atatürk, Youth and Sports Day" },
    { date: new Date(2023, 6, 15), name: "Democracy and National Unity Day" },
    { date: new Date(2023, 7, 30), name: "Victory Day" },
    { date: new Date(2023, 9, 29), name: "Republic Day" },
  ];

  const tileClassName = ({ date, view }) => {
    if (view === 'month' && nationalHolidays.find((holiday) => holiday.date.getTime() === date.getTime())) {
      return 'holiday-tile';
    }
    return null;
  };
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const holiday = nationalHolidays.find((holiday) => holiday.date.getTime() === date.getTime());
      if (holiday) {
        return (
          <span className="holiday-tooltip">{holiday.name}</span>
        );
      }
    }
    return null;
  };

  return (
    <div className="home">
      <h1 className="h3 mb-3"><strong>Analytics</strong> Dashboard</h1>
      <div className="row">
        <div className="col-sm-6">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col mt-0">
                  <h4 className="card-title">Total Hours</h4>
                </div>
                <div className="col-auto text-center">
                  <div className="stat">
                    <span className="material-symbols-outlined card-icon">schedule</span>
                  </div>
                </div>
              </div>
              <h1>152</h1>
              <div className="text-center">
                <span className="text-muted">{monthNames[date.getMonth()]}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="card">
          <div className="card-body">
              <div className="row">
                <div className="col mt-0">
                  <h4 className="card-title">Avg. Hours</h4>
                </div>
                <div className="col-auto text-center">
                  <div className="stat">
                    <span className="material-symbols-outlined card-icon">schedule</span>
                  </div>
                </div>
              </div>
              <h1>152</h1>
              <div className="text-center">
                <span className="text-muted">{monthNames[date.getMonth()]}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="card">
          <div className="card-body">
              <div className="row">
                <div className="col mt-0">
                  <h4 className="card-title">CSM Hours</h4>
                </div>
                <div className="col-auto text-center">
                  <div className="stat">
                    <span className="material-symbols-outlined card-icon">schedule</span>
                  </div>
                </div>
              </div>
              <h1>152</h1>
              <div className="text-center">
                <span className="text-muted">{monthNames[date.getMonth()]}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="card">
          <div className="card-body">
              <div className="row">
                <div className="col mt-0">
                  <h4 className="card-title">ABIT Hours</h4>
                </div>
                <div className="col-auto text-center">
                  <div className="stat">
                    <span className="material-symbols-outlined card-icon">schedule</span>
                  </div>
                </div>
              </div>
              <h1>152</h1>
              <div className="text-center">
                <span className="text-muted">{monthNames[date.getMonth()]}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <Calendar value={selectedDate} onChange={handleDateChange} tileContent={tileContent} tileClassName={tileClassName} />
        </div>
        <div className="col-md-6"></div>
      </div>
    </div>
  );
}
