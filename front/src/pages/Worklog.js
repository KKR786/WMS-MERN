import React, { useEffect } from "react";
import { useWorklogsContext } from "../hooks/useWorklogsContext";
import { useAuthContext } from "../hooks/useAuthContext";

// components
import WorklogDetails from "../components/WorklogDetails";
import WorklogForm from "../components/WorklogForm";

const Worklog = () => {
  const [date, setDate] = React.useState("");
  const { worklogs, dispatch } = useWorklogsContext();
  const { user } = useAuthContext();
  

  function getDate(val) {
    setDate(val);
  }

  console.log(worklogs);
  useEffect(() => {
    const fetchWorklogs = async () => {
      const response = await fetch("/api/worklogs", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "GET_WORKLOGS", payload: json });
      }
    };

    if (user) {
      fetchWorklogs();
    }
  }, [dispatch, user]);

  return (
    <div className="container">
      <div className="home">
        <div className="worklogs mb-5">
          {<WorklogDetails worklogs={worklogs} date={date} />}
        </div>
        <WorklogForm handle={getDate} />
      </div>
    </div>
  );
};

export default Worklog;
