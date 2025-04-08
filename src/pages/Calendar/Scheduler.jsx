import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useGoogleLogin } from "@react-oauth/google";
import JqxScheduler from "jqwidgets-scripts/jqwidgets-react-tsx/jqxscheduler";
import 'jqwidgets-scripts/jqwidgets/styles/jqx.base.css';

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const GroupedScheduler = () => {
  const schedulerRef = useRef(null);
  const { companyId } = useSelector((state) => state.AuthReducerKey);

  // Standard scheduler states.
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dataAdapter, setDataAdapter] = useState(null);
  const [eventDate, setEventDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("dayView");

  // Google Calendar integration states.
  const [googleAccessToken, setGoogleAccessToken] = useState("");
  const [currentGoogleUserId, setCurrentGoogleUserId] = useState("");

  // Fetch available users on mount.
  useEffect(() => {
    if (!companyId) return;
    fetch(`${API_URL}/User/all?companyId=${companyId}`)
      .then((res) => res.json())
      .then((response) => {
        console.log("Fetched users:", response);
        const userOptions = response.map((u) => ({
          id: u.userID,
          name: `${u.firstName} ${u.lastName}`,
          color: "#007BFF" // default color; adjust as needed.
        }));
        setAvailableUsers(userOptions);
      })
      .catch((error) => {
        console.error("❌ Error fetching users:", error);
        toast.error("Failed to load users.");
      });
  }, [companyId]);

  // Google login using @react-oauth/google.
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const accessToken = tokenResponse.access_token;
      setGoogleAccessToken(accessToken);
      try {
        // Retrieve user info.
        const userInfoResponse = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        const userInfo = await userInfoResponse.json();
        const googleId = userInfo.sub;
        setCurrentGoogleUserId(googleId);
        const newUser = {
          id: googleId,
          name: userInfo.name,
          color: "#FF5733" // Use red-orange for Google Calendar user.
        };
        // Add to available and selected users if not already present.
        setAvailableUsers((prev) => {
          if (prev.find((u) => u.id === googleId)) return prev;
          return [...prev, newUser];
        });
        setSelectedUsers((prev) => {
          if (prev.find((u) => u.id === googleId)) return prev;
          return [...prev, newUser];
        });
        // Fetch Google Calendar events.
        const now = new Date().toISOString();
        const calendarResponse = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${now}&showDeleted=false&singleEvents=true&maxResults=10&orderBy=startTime`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        const calendarData = await calendarResponse.json();
        const googleEvents = calendarData.items.map((item) => {
          const startDate = item.start.dateTime || item.start.date;
          const endDate = item.end.dateTime || item.end.date;
          return {
            id: item.id,
            username: newUser.name,
            subject: item.summary || "Google Calendar Event",
            description: item.description || "",
            start: new Date(startDate),
            end: new Date(endDate),
            backgroundColor: "#FF5733"
          };
        });
        setAppointments((prev) => [...prev, ...googleEvents]);
        toast.success("Google Calendar events imported successfully!");
      } catch (error) {
        console.error("Error fetching Google Calendar events", error);
        toast.error("Failed to import Google Calendar events.");
      }
    },
    onError: (error) => {
      console.error("Google login error", error);
      toast.error("Google login failed.");
    }
  });

  const handleIntegrateGoogleCalendar = () => {
    googleLogin();
  };

  // Handler to open the add appointment dialog.
  const handleAddAppointment = () => {
    if (schedulerRef.current) {
      schedulerRef.current.openAppointmentDialog();
    }
  };

  // Helper: Parse schedule date & time.
  const parseScheduleDateTime = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return new Date();
    try {
      const datePart = dateStr.split(" ")[0];
      const [month, day, year] = datePart.split("/");
      const isoDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      const dt = new Date(`${isoDate}T${timeStr}:00`);
      if (isNaN(dt.getTime())) {
        throw new Error("Invalid date");
      }
      return dt;
    } catch (error) {
      console.error("❌ Date Parsing Error:", error);
      return new Date();
    }
  };

  // Compute DateTo based on the current view.
  const computeDateTo = (fromDate, view) => {
    let dateTo = new Date(fromDate);
    if (view === "weekView" || view === "agendaView") {
      dateTo.setDate(dateTo.getDate() + 7);
    } else if (view === "monthView") {
      const year = fromDate.getFullYear();
      const month = fromDate.getMonth();
      dateTo = new Date(year, month + 1, 0);
    }
    return dateTo;
  };

  // Fetch schedule data whenever selectedUsers, eventDate, or currentView changes.
  useEffect(() => {
    if (!companyId) return;
    if (selectedUsers.length === 0) {
      setAppointments([]);
      return;
    }
    const computedDateFrom = eventDate.toISOString().split("T")[0];
    const computedDateTo = computeDateTo(eventDate, currentView)
      .toISOString()
      .split("T")[0];
    const requestData = {
      CompanyId: Number(companyId),
      UserIds: selectedUsers.map((u) => Number(u.id)),
      DateFrom: computedDateFrom,
      DateTo: computedDateTo
    };
    console.log("Fetching schedules with request data:", requestData);
    fetch(`${API_URL}/Calendar/GetUserScheduleDetails`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData)
    })
      .then(async (res) => {
        const response = await res.json();
        return response;
      })
      .then((response) => {
        if (!response.success || !Array.isArray(response.success)) {
          console.error("❌ Unexpected API response format:", response);
          toast.error("Failed to load schedules.");
          setAppointments([]);
          return;
        }
        const schedules = response.success;
        console.log("📅 Parsed Schedules:", schedules);
        const mappedAppointments = schedules.map((appt) => {
          const startDateTime = parseScheduleDateTime(appt.date, appt.eventTime);
          const durationMinutes = parseInt(appt.duration, 10) || 0;
          const endDateTime = new Date(
            startDateTime.getTime() + durationMinutes * 60000
          );
          const eventColor = appt.eventColor;
          // Map the appointment to use the user's name from availableUsers
          const user =
            availableUsers.find((u) => String(u.id) === String(appt.userId)) ||
            { name: "Unknown" };
          return {
            id: String(appt.id || Math.random()),
            username: user.name,
            subject: appt.eventName || "Scheduled Work",
            description: appt.templateName || "Work Shift",
            start: startDateTime,
            end: endDateTime,
            backgroundColor: eventColor ? eventColor : "#000"
          };
        });
        setAppointments(mappedAppointments);
      })
      .catch((error) => {
        console.error("❌ Error fetching schedules:", error);
        toast.error("Failed to load schedules.");
        setAppointments([]);
      });
  }, [selectedUsers, eventDate, currentView, companyId, availableUsers]);

  // Update data adapter whenever appointments change.
  useEffect(() => {
    const adapter = new window.$.jqx.dataAdapter({
      dataType: "array",
      dataFields: [
        { name: "id", type: "string" },
        { name: "username", type: "string" },
        { name: "subject", type: "string" },
        { name: "description", type: "string" },
        { name: "start", type: "date" },
        { name: "end", type: "date" },
        { name: "backgroundColor", type: "string" }
      ],
      id: "id",
      localData: appointments || []
    });
    setDataAdapter(adapter);
  }, [appointments]);

  // Create a resource adapter from selected users using username as grouping field.
  const resources = {
    colorScheme: "scheme05",
    dataField: "username",
    orientation: "horizontal",
    displayMember: "name",
    source: new window.$.jqx.dataAdapter({
      dataType: "array",
      dataFields: [
        { name: "username", type: "string" },
        { name: "name", type: "string" },
        { name: "color", type: "string" }
      ],
      localData: selectedUsers.map((u) => ({
        username: u.name,
        name: u.name,
        color: u.color
      }))
    })
  };

  // Update appointment data fields to use username as the resource field.
  const appointmentDataFields = {
    from: "start",
    to: "end",
    id: "id",
    subject: "subject",
    description: "description",
    resourceId: "username",
    backgroundColor: "backgroundColor"
  };

  const views = [
    { type: "dayView" },
    { type: "weekView" },
    { type: "monthView" },
    { type: "agendaView" }
  ];

  // Ensure appointment "id1" is visible on mount.
  useEffect(() => {
    if (schedulerRef.current) {
      schedulerRef.current.ensureAppointmentVisible("id1");
    }
  }, []);

  // Toggle user selection via checkboxes.
  const handleUserToggle = (userId) => {
    const isSelected = selectedUsers.some((u) => u.id === userId);
    if (isSelected) {
      setSelectedUsers(selectedUsers.filter((u) => u.id !== userId));
    } else {
      const userObj = availableUsers.find((u) => u.id === userId);
      if (userObj) {
        setSelectedUsers([...selectedUsers, userObj]);
      }
    }
  };

  // Custom appointment renderer.
  const appointmentRenderer = (appointment, element) => {
    if (appointment.backgroundColor) {
      element.style.backgroundColor = appointment.backgroundColor;
      element.style.color = "#fff";
      element.style.border = "2px solid #333";
    }
    return element;
  };

  // Fallback data adapter if none exists.
  const schedulerAdapter =
    dataAdapter ||
    new window.$.jqx.dataAdapter({
      dataType: "array",
      dataFields: [
        { name: "id", type: "string" },
        { name: "username", type: "string" },
        { name: "subject", type: "string" },
        { name: "description", type: "string" },
        { name: "start", type: "date" },
        { name: "end", type: "date" },
        { name: "background", type: "string" }
      ],
      id: "id",
      localData: appointments
    });

  const renderAppointment = (data) => {
    data.background = data.appointment.backgroundColor;
    return data;
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Side: Scheduler and Controls */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-5">
          <h2 className="text-2xl font-bold mb-4">Calendar Grouped by User</h2>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
            <div className="flex items-center space-x-4">
              {/* Google Calendar Icon Button */}
              <button
                onClick={handleIntegrateGoogleCalendar}
                className=" text-white p-2 rounded  transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.8 0 6.9 1.6 9 3l6.7-6.5C36.6 3.5 30.7 1 24 1 14.8 1 6.8 5.8 2.5 13.7l7.8 6.1C12.5 14.1 17.7 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.6c-.6 3.3-2.6 6.1-5.6 7.9l7.8 6C43.8 36.3 46.1 30.8 46.1 24.5z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.3 28.6c-.9-2.6-1.4-5.3-1.4-8.1s.5-5.5 1.4-8.1L2.5 13.7C.9 18.4 0 23.2 0 28.5c0 5.3.9 10.1 2.5 14.8l7.8-6.1z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 47c6.7 0 12.3-2.2 16.4-6l-7.8-6c-2.1 1.4-4.8 2.2-8.6 2.2-6.3 0-11.7-4.3-13.6-10.1l-7.8 6.1C6.8 42.2 14.8 47 24 47z"
                  />
                  <path fill="none" d="M0 0h48v48H0z" />
                </svg>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              {/* Custom View Selector Buttons */}
              <button
                onClick={() => setCurrentView("dayView")}
                className={`px-4 py-2 rounded ${
                  currentView === "dayView"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                Day
              </button>
              <button
                onClick={() => setCurrentView("weekView")}
                className={`px-4 py-2 rounded ${
                  currentView === "weekView"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setCurrentView("monthView")}
                className={`px-4 py-2 rounded ${
                  currentView === "monthView"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setCurrentView("agendaView")}
                className={`px-4 py-2 rounded ${
                  currentView === "agendaView"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                Agenda
              </button>
              {/* <button
                onClick={handleAddAppointment}
                className="px-4 py-2 rounded bg-purple-500 text-white hover:bg-purple-600 transition-colors"
              >
                Add Appointment
              </button> */}
            </div>
          </div>
        </div>
        <div className="flex-grow">
          <JqxScheduler
            ref={schedulerRef}
            width={"100%"}
            height={"100%"}
            source={schedulerAdapter}
            view={currentView}
            date={new window.$.jqx.date(new Date())}
            showLegend={true}
            resources={resources}
            views={views}
            renderAppointment={renderAppointment}
            appointmentDataFields={appointmentDataFields}
            groups={["username"]}
            editDialog={true}
            enableDragDrop={true}
            onViewChange={(event) => {
              if (event && event.args && event.args.type) {
                setCurrentView(event.args.type);
              }
            }}
            resourceHeaderTemplate={(resource) => (
              <div className="text-center p-1 font-bold">{resource.name}</div>
            )}
          />
        </div>
      </div>
      {/* Right Side: Interactive Select Users Section */}
      <div className="w-80 bg-gray-50 p-5 border-l border-gray-200 overflow-y-auto">
        <h3 className="text-2xl font-bold mb-4">Select Users</h3>
        <div className="flex flex-col gap-4">
          {availableUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center p-2 bg-white rounded hover:bg-gray-100 transition duration-200 cursor-pointer"
              onClick={() => handleUserToggle(user.id)}
            >
              <input
                type="checkbox"
                id={`user_${user.id}`}
                checked={!!selectedUsers.find((u) => u.id === user.id)}
                onChange={() => handleUserToggle(user.id)}
                className="checkbox"
              />
              <label
  htmlFor={`user_${user.id}`}
  className="font-medium pl-2 capitalize"
  style={{ color: user.color }}
>
  {user.name}
</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroupedScheduler;
