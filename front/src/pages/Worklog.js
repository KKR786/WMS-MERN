import React, { useEffect } from "react";
import { useWorklogsContext } from "../hooks/useWorklogsContext";
import { useAuthContext } from "../hooks/useAuthContext";

// components
import WorklogDetails from "../components/WorklogDetails";
import WorklogForm from "../components/WorklogForm";

const Worklog = () => {
  let newDate = new Date();
  const currentDate =
    newDate.getFullYear() +
    "-" +
    newDate.toLocaleString("en-US", { month: "2-digit" }) +
    "-" +
    newDate.toLocaleString("en-US", { day: "2-digit" });
  const [date, setDate] = React.useState(currentDate);
  const { worklogs, dispatch } = useWorklogsContext();
  const { user } = useAuthContext();
  const [loading, setLoading] = React.useState(true);

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
        setLoading(false);
      }
    };

    if (user) {
      fetchWorklogs();
    }
  }, [dispatch, user]);

  console.log(date);

  return (
    <>
      {loading ? (
        <p>loading..</p>
      ) : (
        <div className="container">
          <div className="home">
            <div className="worklogs mb-5">
              {<WorklogDetails worklogs={worklogs} date={date} />}
            </div>
            <WorklogForm handle={getDate} />
          </div>
        </div>
      )}
    </>
  );
};

export default Worklog;
