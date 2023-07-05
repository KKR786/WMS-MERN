import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useWorklogsContext } from "../hooks/useWorklogsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";
import Select from "react-select";
import Pagination from "react-bootstrap/Pagination";

export default function MyWorklog() {
  const { monthlyWorklogs, dispatch } = useWorklogsContext();
  const { user } = useAuthContext();
  const { logout } = useLogout();

  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(25);

  const options = [];
  const startDate = new Date(user.joiningDate);
  const endDate = new Date();

  let currentDate = startDate;
  while (
    currentDate < endDate ||
    currentDate.getMonth() === endDate.getMonth()
  ) {
    const monthLabel = currentDate.toLocaleString("default", { month: "long" });
    const yearLabel = currentDate.getFullYear();
    const optionValue = `${currentDate.getMonth() + 1
      }-${currentDate.getFullYear()}`;
    const optionLabel = `${monthLabel} ${yearLabel}`;
    options.push({ value: optionValue, label: optionLabel });
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  // Set the initial state to the current month's option
  const defaultMonth = new Date().toLocaleString("default", { month: "long" });

  const defaultYear = new Date().getFullYear();

  const defaultOption = options.find(
    (option) => option.label === `${defaultMonth} ${defaultYear}`
  );

  const [selectedOption, setSelectedOption] = useState(defaultOption);
  const [selectedMonth, selectedYear] = selectedOption.value.split("-");
  console.log(selectedMonth, selectedYear);
  useEffect(() => {
    const fetchWorklogs = async () => {
      const response = await fetch(
        `/api/worklogs/${user.id}?month=${selectedMonth}&year=${selectedYear}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      const json = await response.json();
      if (response.status === 401) {
        alert("You are not authorized to view this page. Please login.");
        logout();
        return;
      }
      if (response.ok) {
        dispatch({ type: "GET_MONTHLY_WORKLOGS", payload: json });
        setLoading(false);

        const totalHours = Object.values(json).reduce(
          (total, worklog) => total + worklog.time / 60,
          0
        );
        setTotal(totalHours);
      }
    };

    if (user) {
      fetchWorklogs();
    }
  }, [dispatch, user, selectedMonth]);

  // pagination
  console.log(monthlyWorklogs)
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  if (Array.isArray(monthlyWorklogs)) {
    console.log(monthlyWorklogs.length, startIndex)
    var displayedWorklogs = monthlyWorklogs.slice(startIndex, endIndex);
  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPaginationItems = () => {
    const totalPages = Math.ceil(monthlyWorklogs.length / perPage);
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    if (totalPages <= 1) {
      return null;
    }

    const showEllipsis = totalPages > 5;

    if (!showEllipsis) {
      return pageNumbers.map((pageNumber) => (
        <Pagination.Item
          key={pageNumber}
          onClick={() => handlePageChange(pageNumber)}
          className={currentPage === pageNumber ? "active" : ""}
        >
          {pageNumber}
        </Pagination.Item>
      ));
    }

    const ellipsisStart = Math.max(currentPage - 2, 2);
    const ellipsisEnd = Math.min(currentPage + 2, totalPages - 1);

    const pageItems = [];

    pageItems.push(
      <Pagination.Item
        key={1}
        onClick={() => handlePageChange(1)}
        className={currentPage === 1 ? "active" : ""}
      >
        1
      </Pagination.Item>
    );

    if (ellipsisStart > 2) {
      pageItems.push(<Pagination.Ellipsis key="start" />);
    }

    for (let i = ellipsisStart; i <= ellipsisEnd; i++) {
      pageItems.push(
        <Pagination.Item
          key={i}
          onClick={() => handlePageChange(i)}
          className={currentPage === i ? "active" : ""}
        >
          {i}
        </Pagination.Item>
      );
    }

    if (ellipsisEnd < totalPages - 1) {
      pageItems.push(<Pagination.Ellipsis key="end" />);
    }

    pageItems.push(
      <Pagination.Item
        key={totalPages}
        onClick={() => handlePageChange(totalPages)}
        className={currentPage === totalPages ? "active" : ""}
      >
        {totalPages}
      </Pagination.Item>
    );

    return pageItems;
  };

  return (
    <div className="section">
      <div className="container">
        <div className="d-flex justify-content-between my-4">
          <h1 className="text-center">Worklogs</h1>
          <Select
            options={options}
            value={selectedOption}
            onChange={setSelectedOption}
            placeholder="Select a month and year"
            className="w-25 h5"
          />
        </div>
        <div className="text-right">
          <Link to='/worklog' className="add-link">
            <span className="material-symbols-outlined mr-2">edit_note</span>
            Work Entry
          </Link>
        </div>
        {loading ? (
          <p>loading..</p>
        ) : (
          <>
            {monthlyWorklogs && (
              <>
                {isNaN(total) ? (
                  <p>No data to display.</p>
                ) : (
                  <div>
                    <h5 className="my-4">Total Hours: {total.toFixed(2)}</h5>
                    <div className='d-flex justify-content-between align-items-center mb-2'>
                      <div className="status">
                        <span>{`${startIndex + 1} - ${Math.min(endIndex, monthlyWorklogs.length)} of ${monthlyWorklogs.length}`}</span>
                      </div>
                      <div>
                        {renderPaginationItems() != null &&
                        <Pagination>
                          <Pagination.Prev
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                          />
                          {renderPaginationItems()}
                          <Pagination.Next
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={
                              currentPage ===
                              Math.ceil(monthlyWorklogs.length / perPage)
                            }
                          />
                        </Pagination>}
                      </div>
                      <div className="d-flex align-items-center">
                        <span className="mr-2">Records per page</span>
                        <select value={perPage} onChange={(e) => setPerPage(e.target.value)}>
                          <option value="10">10</option>
                          <option value="25">25</option>
                          <option value="50">50</option>
                          <option value="100">100</option>
                          <option value="200">200</option>
                          <option value="500">500</option>
                          <option value="1000">1000</option>
                        </select>
                      </div>
                    </div>
                    <table>
                      <thead className="text-white">
                        <tr>
                          <th>Date</th>
                          <th>Ticket ID</th>
                          <th>Domain</th>
                          <th>Agency</th>
                          <th>Work Type</th>
                          <th>Hours</th>
                          <th>Note</th>
                        </tr>
                      </thead>
                      <tbody>
                        {monthlyWorklogs && displayedWorklogs &&
                          Object.values(displayedWorklogs).map((worklog, i) => (
                            <tr key={i} className="bg-light">
                              <td>{worklog.date}</td>
                              <td>
                                <a
                                  href={"https://jupiterplatform.com/Tickets/edit.php?id=".concat(
                                    worklog.ticketId
                                  )}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {worklog.ticketId}
                                </a>
                              </td>
                              <td>{worklog.domain}</td>
                              <td>{worklog.agency}</td>
                              <td>{worklog.type}</td>
                              <td>{(worklog.time / 60).toFixed(2)}</td>
                              <td>{worklog.note}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
