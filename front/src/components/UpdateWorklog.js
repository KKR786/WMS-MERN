import React, { useState, useEffect } from "react";
import { useWorklogsContext } from "../hooks/useWorklogsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import Select from "react-select";

export default function UpdateWorklog(props) {
  const [ticketId, setTicketId] = useState("");
  const [domain, setDomain] = useState("");
  const [agency, setAgency] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("");
  const [note, setNote] = useState("");
  const [users, setUsers] = useState([]);
  const [usersTag, setUsersTag] = useState([]);
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [domains, setDomains] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const { worklog, dispatch } = useWorklogsContext();
  const { user } = useAuthContext();

  useEffect(() => {
    if (worklog) {
      setTicketId(worklog.ticketId);
      setDomain(worklog.domain);
      setAgency(worklog.agency);
      setTime(worklog.time);
      setType(worklog.type);
      setNote(worklog.note);
      setUsersTag(worklog.usersTag || []);
    }
  }, [worklog]);

  useEffect(() => {
    const fetchDomains = async () => {
      const res = await fetch("/api/system/domains", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const json = await res.json();

      if (res.ok) {
        const domainList = json.map((data) => ({
          d: data.domain,
          a: data.agency,
        }));
        setDomains(domainList);
        const agencyList = [...new Set(json.map((data) => data.agency))];
        setAgencies(agencyList);
      }
    };

    if (user) {
      fetchDomains();
    }
  }, [user]);

  function handleMouseDown(event) {
    setIsDragging(true);
    setPosition({
      x: event.clientX - event.target.offsetLeft,
      y: event.clientY - event.target.offsetTop,
    });
  }

  function handleMouseMove(event) {
    if (isDragging) {
      const x = event.clientX - position.x;
      const y = event.clientY - position.y;
      setPosition({ x, y });
    }
  }

  function handleMouseUp() {
    setIsDragging(false);
  }

  useEffect(() => {
    const fetchWorklogs = async () => {
      if (props.id) {
        const response = await fetch(`/api/worklogs/unique/${props.id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const json = await response.json();
        if (response.ok) {
          dispatch({ type: "GET_WORKLOG", payload: json });
        }
      }
    };

    if (user) {
      fetchWorklogs();
    }
  }, [dispatch, props.id, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }

    let users = [];
    if (usersTag) {
      users = usersTag.map((user) => ({
        label: user.label,
        value: user.value,
      }));
    }

    const worklog = {
      ticketId,
      domain,
      agency,
      time,
      type,
      note,
      usersTag: users,
    };

    const response = await fetch(`/api/worklogs/${props.id}`, {
      method: "PATCH",
      body: JSON.stringify(worklog),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields);
    }
    if (response.ok) {
      props.state(false);
      setTicketId("");
      setDomain("");
      setAgency("");
      setTime("");
      setType("");
      setNote("");
      setUsersTag([]);
      setError(null);
      setEmptyFields([]);
      dispatch({ type: "UPDATE_WORKLOG", payload: json });
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/users", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const json = await res.json();

      if (res.ok) {
        const userList = json.map((data) => ({
          name: data.name,
          id: data._id,
        }));
        setUsers(userList);
      }
    };

    if (user) {
      fetchUsers();
    }
  }, [user]);

  return (
    <>
      {worklog && (
        <div className="form-popup">
          <div
            className="popup-header"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            <span
              className="float-right top-0 cancel"
              onClick={() => props.state(false)}
            >
              X
            </span>
            <h3 className="text-center">Update Worklog</h3>
          </div>
          <form
            className="d-flex flex-wrap justify-content-between mt-5"
            onSubmit={handleSubmit}
          >
            <div className="reEntry">
              <label>Ticket Id:</label>
              <input
                type="number"
                value={ticketId}
                min="0"
                onChange={(e) => setTicketId(e.target.value)}
                className={emptyFields.includes("ticketId") ? "error" : ""}
              />
            </div>

            <div className="reEntry">
              <label>Domain:</label>
              <Select
                placeholder={domain}
                options={domains.map((domain) => ({
                  value: domain.d,
                  label: domain.d,
                }))}
                value={domains.find((obj) => obj.value === domain) || null}
                onChange={(e) => {
                  setDomain(e.value);
                  const selectedDomain = e.value;
                  const filteredAgency =
                    domains.find((domain) => domain.d === selectedDomain)?.a ||
                    [];
                  setAgency(filteredAgency);
                }}
                className={emptyFields.includes("domain") ? "error" : ""}
                id="domain"
              />
            </div>

            <div className="reEntry">
              <label>Agency:</label>
              <Select
                placeholder={agency ? agency : "Select Agency"}
                options={agencies.map((agency) => ({
                  value: agency,
                  label: agency,
                }))}
                value={agencies.find((obj) => obj.value === agency) || null}
                onChange={(e) => setAgency(e.value)}
                className={emptyFields.includes("agency") ? "error" : ""}
                id="agency"
              />
            </div>

            <div className="reEntry">
              <label>Time (in min):</label>
              <input
                type="number"
                value={time}
                min="0"
                onChange={(e) => setTime(e.target.value)}
                className={emptyFields.includes("time") ? "error" : ""}
              />
            </div>

            <div className="reEntry">
              <label>Type:</label>
              <input
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className={emptyFields.includes("type") ? "error" : ""}
              />
            </div>

            <div className="reEntry">
              <label>Users:</label>
              <Select
                isMulti
                options={users.map((user) => ({
                  value: user.id,
                  label: user.name,
                }))}
                value={usersTag}
                onChange={(selectedUsers) => setUsersTag(selectedUsers)}
                id="type"
              />
            </div>
            
            <div className="reEntry">
              <label>Note:</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className={emptyFields.includes("note") ? "error" : ""}
              />
            </div>

            {error && <div className="error-msg">{error}</div>}
            
              <button type="submit" className="updateBtn">
                Update
              </button>

          </form>
        </div>
      )}
    </>
  );
}
