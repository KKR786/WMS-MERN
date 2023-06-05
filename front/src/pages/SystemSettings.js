import React, { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

function SystemSettings() {
  const { user } = useAuthContext();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [domainForm, setDomainForm] = useState(false);
  const [domain_id, setDomainId] = useState("");
  const [domain, setDomain] = useState("");
  const [agency, setAgency] = useState("");
  const [workTypeForm, setWorkTypeForm] = useState(false);
  const [workType, setWorkType] = useState("");
  const [savedTypes, setSaveTypes] = useState([])
  const [holidaysForm, setHolidaysForm] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  console.log(date)
  const holidaySubmit = async (e) => {
    e.preventDefault();

    if(!user) {
      setError("You must be logged in");
      return;
    }

    const holiday = { date, title }

    const res = await fetch('/api/protected/system/holiday', { 
        method: 'POST',
        body: JSON.stringify(holiday),
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
        setDate("");
        setTitle('')
        setSuccess("Holiday added successfully!");
        setError('')
      }
  }
  
  const workTypeSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }
    const type = workType
  
    const res = await fetch("/api/protected/system/work_type", {
        method: "POST",
        body: JSON.stringify({type}),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
  
      const json = await res.json();
      
      if (!res.ok) {
        setError(json.error);
        setSuccess('')
      }
      if (res.ok) {
        setWorkType("");
        setSuccess("Work Type added successfully!");
        setError('')
      }
  };

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
    
  const domainFormSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }

    const domainList = { domain_id, domain, agency };
    const res = await fetch("/api/protected/system/domain", {
      method: "POST",
      body: JSON.stringify(domainList),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });

    const json = await res.json();
    
    if (!res.ok) {
      setError(json.error);
    }
    if (res.ok) {
      setDomainId("");
      setAgency("");
      setDomain("");
      setSuccess("Domain added successfully!");
    }
  };
  return (
    <div className="section">
      <div className="container">
        <h1 className="text-center my-5">System Settings</h1>
        <ul className="list-group text-center">
          <li
            className="list-group-item list-group-item-success"
            onClick={() => {
              setDomainForm(true);
              setWorkTypeForm(false);
              setHolidaysForm(false);
            }}
          >
            Add New Domain
          </li>

          <li
            className="list-group-item list-group-item-info"
            onClick={() => {
              setWorkTypeForm(true);
              setDomainForm(false);
              setHolidaysForm(false);
            }}
          >
            Catagorized Work Type
          </li>

          <li
            className="list-group-item list-group-item-danger"
            onClick={() => {
              setHolidaysForm(true);
              setWorkTypeForm(false);
              setDomainForm(false);
            }}
          >
            Set Holidays
          </li>
        </ul>

        {holidaysForm && (
          <div className="form-popup m-auto">
            <span
              className="float-right top-0 cancel"
              onClick={() => setHolidaysForm(false)}
            >
              X
            </span>
            <h3 className="text-center">Set Holidays</h3>
            <form
              className="d-flex flex-wrap justify-content-between mt-5"
              onSubmit={holidaySubmit}
            >
              <div className="holidays-input">
                <label>Date:</label>
                <input
                  type="date"
                  onChange={(e) => setDate(e.target.value)}
                  value={date}
                />
              </div>
              <div className="holidays-input">
                <label>Title:</label>
                <input
                  type="text"
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                />
              </div>
              <div className="d-flex align-items-center">
                <button className="updateBtn mt-3">ADD</button>
              </div>
              {error && <div className="error">{error}</div>}
              {success && <div className="success">{success}</div>}
            </form>
          </div>
        )}

        {workTypeForm && (
          <div className="form-popup m-auto">
            <span
              className="float-right top-0 cancel"
              onClick={() => setWorkTypeForm(false)}
            >
              X
            </span>
            <h3 className="text-center">Add Work Type</h3>
            <form
              className="d-flex flex-wrap justify-content-between mt-5"
              onSubmit={workTypeSubmit}
            >
              <div className="agency-input">
                <label>New Type:</label>
                <input
                  type="text"
                  onChange={(e) => setWorkType(e.target.value)}
                  value={workType}
                />
              </div>
              <div className="d-flex align-items-center">
                <button className="updateBtn">ADD</button>
              </div>
              {error && <div className="error">{error}</div>}
            </form>
            {success && <div className="success">{success}</div>}
            <div className="mt-4">
              <h5>Work Types:</h5>  
              {savedTypes &&
                <ul>
                    {savedTypes.map((workType, i) =>
                        <li key={i}>{workType}</li>
                    )}
                </ul>
                }
            </div>
          </div>
        )}

        {domainForm && (
          <div className="form-popup m-auto">
            <span
              className="float-right top-0 cancel"
              onClick={() => setDomainForm(false)}
            >
              X
            </span>
            <h3 className="text-center">Add New Domain</h3>
            <form
              className="d-flex flex-wrap justify-content-between mt-5"
              onSubmit={domainFormSubmit}
            >
              <div className="domain-input">
                <label>Domain ID:</label>
                <input
                  type="number"
                  onChange={(e) => setDomainId(e.target.value)}
                  value={domain_id}
                  min="0"
                />
              </div>
              <div className="domain-input">
                <label>Domain:</label>
                <input
                  type="text"
                  onChange={(e) => setDomain(e.target.value)}
                  value={domain}
                />
              </div>
              <div className="domain-input">
                <label>Manage By:</label>
                <input
                  type="text"
                  onChange={(e) => setAgency(e.target.value)}
                  value={agency}
                />
              </div>

              <button className="updateBtn">ADD</button>
              {error && <div className="error">{error}</div>}
            </form>
            {success && <div className="success">{success}</div>}
          </div>
        )}
      </div>
    </div>
  );
}

export default SystemSettings;
