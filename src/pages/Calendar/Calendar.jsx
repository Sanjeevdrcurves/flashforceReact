import React, { useState } from "react";
import { Scheduler } from "@aldabil/react-scheduler";
import { useGoogleLogin } from "@react-oauth/google";

// ----- Initial Data & Configurations -----
// Initial static members
const initialMembers = [
  { id: "1", name: "Alice", color: "#FF5733" }, // reddish
  { id: "2", name: "Bob", color: "#33FF57" },   // greenish
];

const contacts = [
  { id: "c1", name: "Client A" },
  { id: "c2", name: "Client B" },
];

const timezones = [
  { value: "America/New_York", label: "America/New_York" },
  { value: "Europe/London", label: "Europe/London" },
  { value: "Asia/Tokyo", label: "Asia/Tokyo" },
];

// Working hours (not used for blocking defaults here)
const workingHours = {
  0: null, // Sunday: closed
  1: { start: "09:00", end: "18:30", breakStart: "12:00", breakEnd: "13:00" },
  2: { start: "09:00", end: "18:30", breakStart: "12:00", breakEnd: "13:00" },
  3: { start: "09:00", end: "18:30", breakStart: "12:00", breakEnd: "13:00" },
  4: { start: "09:00", end: "18:30", breakStart: "12:00", breakEnd: "13:00" },
  5: { start: "09:00", end: "18:30", breakStart: "12:00", breakEnd: "13:00" },
  6: { start: "09:00", end: "14:00", breakStart: null, breakEnd: null },
};

// ----- Helper Functions -----
// Generate a random hex color
const generateRandomColor = () => {
  let color = Math.floor(Math.random() * 16777215).toString(16);
  while (color.length < 6) {
    color = "0" + color;
  }
  return `#${color}`;
};

// Compute available time slots for a selected date based on that day's working hours.
const availableTimeSlotsForDate = (selectedDate) => {
  if (!selectedDate) return [];
  const dateObj = new Date(selectedDate);
  const dayOfWeek = dateObj.getDay();
  const hours = workingHours[dayOfWeek];
  if (!hours) return [];
  const { start, end, breakStart, breakEnd } = hours;
  const startHour = parseInt(start.split(":")[0], 10);
  const endHour = parseInt(end.split(":")[0], 10);
  let slots = [];
  for (let h = startHour; h < endHour; h++) {
    // Skip if a full one-hour slot doesn't fit
    if (h + 1 > endHour) continue;
    // Skip lunch break if applicable
    if (breakStart && breakEnd) {
      const breakStartHour = parseInt(breakStart.split(":")[0], 10);
      const breakEndHour = parseInt(breakEnd.split(":")[0], 10);
      if (h >= breakStartHour && h < breakEndHour) continue;
    }
    const slotStr = (h < 10 ? "0" + h : h) + ":00";
    slots.push(slotStr);
  }
  return slots;
};

// ----- Main Component -----
export default function CalendarApp() {
  // Scheduler view state
  const [view, setView] = useState("week");
  // Appointments (user-booked events)
  const [events, setEvents] = useState([]);
  // Custom block events (from Block Off Time form)
  const [customBlockedEvents, setCustomBlockedEvents] = useState([]);
  // Holiday events (all day events added via holiday form)
  const [holidayEvents, setHolidayEvents] = useState([]);
  // Form visibility states
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showBlockForm, setShowBlockForm] = useState(false);
  const [showHolidayForm, setShowHolidayForm] = useState(false);
  // Dynamic members state – initially from static members
  const [membersList, setMembersList] = useState(initialMembers);
  // Filter state for members – default: all member IDs
  const [selectedMembers, setSelectedMembers] = useState(
    initialMembers.map((m) => m.id)
  );
  // Google OAuth state
  const [googleAccessToken, setGoogleAccessToken] = useState("");
  const [currentGoogleUserId, setCurrentGoogleUserId] = useState("");

  // -----------------------
  // Appointment Form State
  // -----------------------
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [member, setMember] = useState("");
  const [timezone, setTimezone] = useState("America/New_York");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [locationType, setLocationType] = useState("default");
  const [customLocation, setCustomLocation] = useState("");
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState("Confirmed");
  const [errors, setErrors] = useState({});

  // -----------------------
  // Block Off Time Form State
  // -----------------------
  const [blockTitle, setBlockTitle] = useState("");
  const [blockMember, setBlockMember] = useState("");
  const [blockTimezone, setBlockTimezone] = useState("America/New_York");
  const [blockStartDate, setBlockStartDate] = useState("");
  const [blockStartTime, setBlockStartTime] = useState("");
  const [blockEndDate, setBlockEndDate] = useState("");
  const [blockEndTime, setBlockEndTime] = useState("");
  const [blockErrors, setBlockErrors] = useState({});

  // -----------------------
  // Holiday Form State
  // -----------------------
  const [holidayTitle, setHolidayTitle] = useState("");
  const [holidayStartDate, setHolidayStartDate] = useState("");
  const [holidayEndDate, setHolidayEndDate] = useState("");
  const [holidayErrors, setHolidayErrors] = useState({});

  // -----------------------
  // Google OAuth Login using @react-oauth/google
  // -----------------------
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const accessToken = tokenResponse.access_token;
      setGoogleAccessToken(accessToken);
      try {
        const userInfoResponse = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        const userInfo = await userInfoResponse.json();
        const googleId = userInfo.sub;
        const googleName = userInfo.name;
        setCurrentGoogleUserId(googleId);
        const newMember = {
          id: googleId,
          name: googleName,
          color: generateRandomColor(),
        };
        setMembersList((prev) =>
          prev.some((m) => m.id === googleId) ? prev : [...prev, newMember]
        );
        setSelectedMembers((prev) =>
          prev.includes(googleId) ? prev : [...prev, googleId]
        );
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
            event_id: item.id,
            title: item.summary || "No Title",
            start: new Date(startDate),
            end: new Date(endDate),
            member: googleId,
            bgColor: newMember.color,
          };
        });
        setEvents((prev) => [...prev, ...googleEvents]);
        alert("Google Calendar events imported successfully!");
      } catch (error) {
        console.error("Error fetching Google Calendar events", error);
        alert("Failed to import Google Calendar events.");
      }
    },
    onError: (error) => {
      console.error("Google login error", error);
      alert("Google login failed.");
    },
  });

  const handleIntegrateGoogleCalendar = () => {
    googleLogin();
  };

  // -----------------------
  // Helper: Insert event into Google Calendar
  // -----------------------
  const insertEventToGoogleCalendar = async (event) => {
    if (!googleAccessToken) return;
    const eventData = {
      summary: event.title,
      description: event.description,
      start: {
        dateTime: event.start.toISOString(),
        timeZone: event.timezone,
      },
      end: {
        dateTime: event.end.toISOString(),
        timeZone: event.timezone,
      },
    };
    try {
      const response = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${googleAccessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventData),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to insert event in Google Calendar", errorData);
      } else {
        console.log("Event inserted into Google Calendar");
      }
    } catch (error) {
      console.error("Error inserting event into Google Calendar", error);
    }
  };

  // -----------------------
  // Validation for Appointment Form
  // -----------------------
  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Appointment title is required.";
    if (!member) newErrors.member = "Please select a member.";
    if (!date) newErrors.date = "Please select a date.";
    if (!timeSlot) newErrors.timeSlot = "Please select a time slot.";
    if (locationType === "custom" && !customLocation.trim())
      newErrors.customLocation = "Please enter a custom location.";
    if (!contact) newErrors.contact = "Please select a contact.";
  
    // Prevent booking on a holiday:
    const appointmentDay = new Date(date + "T00:00:00");
    holidayEvents.forEach((holiday) => {
      if (
        appointmentDay.getTime() >= holiday.start.getTime() &&
        appointmentDay.getTime() <= holiday.end.getTime()
      ) {
        newErrors.date = "Cannot book an appointment on a holiday.";
      }
    });
  
    // Prevent booking during block off time for the same member:
    if (timeSlot && date && member) {
      const appointmentStart = new Date(date + "T" + timeSlot + ":00");
      const appointmentEnd = new Date(appointmentStart.getTime() + 60 * 60 * 1000);
      customBlockedEvents.forEach((block) => {
        if (block.member === member) {
          // If the appointment overlaps the block off period
          if (appointmentStart < block.end && appointmentEnd > block.start) {
            newErrors.timeSlot = "Cannot book appointment during blocked off time.";
          }
        }
      });
    }
    return newErrors;
  };

  // -----------------------
  // Appointment Form Submission Handler
  // -----------------------
  const handleBookAppointment = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    const start = new Date(`${date}T${timeSlot}:00`);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    const selectedMemberObj = membersList.find((m) => m.id === member);
    const bgColor = selectedMemberObj ? selectedMemberObj.color : "#000000";
    const newEvent = {
      event_id: Date.now(),
      title,
      start,
      end,
      description,
      member,
      timezone,
      meetingLocation: locationType === "custom" ? customLocation : "Calendar Default",
      contact,
      status,
      color:bgColor,
    };
    setEvents((prev) => [...prev, newEvent]);
    alert("Appointment booked successfully!");
    if (member === currentGoogleUserId) {
      await insertEventToGoogleCalendar(newEvent);
    }
    setShowBookingForm(false);
    setTitle("");
    setDescription("");
    setMember("");
    setTimezone("America/New_York");
    setDate("");
    setTimeSlot("");
    setLocationType("default");
    setCustomLocation("");
    setContact("");
    setStatus("Confirmed");
    setErrors({});
  };

  const handleCancelBooking = () => {
    setShowBookingForm(false);
    setErrors({});
  };

  // -----------------------
  // Validation for Block Off Time Form
  // -----------------------
  const validateBlockForm = () => {
    const errors = {};
    if (!blockTitle.trim()) errors.blockTitle = "Block title is required.";
    if (!blockMember) errors.blockMember = "Please select a calendar/user.";
    if (!blockStartDate) errors.blockStartDate = "Please select a start date.";
    if (!blockStartTime) errors.blockStartTime = "Please select a start time.";
    if (!blockEndDate) errors.blockEndDate = "Please select an end date.";
    if (!blockEndTime) errors.blockEndTime = "Please select an end time.";
    if (blockStartDate && blockStartTime && blockEndDate && blockEndTime) {
      const start = new Date(`${blockStartDate}T${blockStartTime}:00`);
      const end = new Date(`${blockEndDate}T${blockEndTime}:00`);
      if (start >= end) errors.blockTime = "Start time must be before end time.";
    }
    return errors;
  };

  const handleBlockTime = (e) => {
    e.preventDefault();
    const errors = validateBlockForm();
    if (Object.keys(errors).length > 0) {
      setBlockErrors(errors);
      return;
    }
    const start = new Date(`${blockStartDate}T${blockStartTime}:00`);
    const end = new Date(`${blockEndDate}T${blockEndTime}:00`);
    const disabledColor = "#AAAAAA"; // Fixed disabled color for block events.
    const newBlockEvent = {
      event_id: Date.now(),
      title: blockTitle,
      start,
      end,
      member: blockMember,
      timezone: blockTimezone,
      blocked: true,
      bgColor: disabledColor,
    };
    setCustomBlockedEvents((prev) => [...prev, newBlockEvent]);
    alert("Time blocked successfully!");
    setShowBlockForm(false);
    setBlockTitle("");
    setBlockMember("");
    setBlockTimezone("America/New_York");
    setBlockStartDate("");
    setBlockStartTime("");
    setBlockEndDate("");
    setBlockEndTime("");
    setBlockErrors({});
  };

  const handleCancelBlock = () => {
    setShowBlockForm(false);
    setBlockErrors({});
  };

  // -----------------------
  // Validation for Holiday Form
  // -----------------------
  const validateHolidayForm = () => {
    const errors = {};
    if (!holidayTitle.trim()) errors.holidayTitle = "Holiday title is required.";
    if (!holidayStartDate) errors.holidayStartDate = "Please select a start date.";
    if (!holidayEndDate) errors.holidayEndDate = "Please select an end date.";
    if (holidayStartDate && holidayEndDate) {
      const start = new Date(`${holidayStartDate}T00:00:00`);
      const end = new Date(`${holidayEndDate}T23:59:59`);
      if (start > end) errors.holidayTime = "Start date must be before or equal to end date.";
    }
    return errors;
  };

  const handleAddHoliday = (e) => {
    e.preventDefault();
    const errors = validateHolidayForm();
    if (Object.keys(errors).length > 0) {
      setHolidayErrors(errors);
      return;
    }
    const start = new Date(`${holidayStartDate}T00:00:00`);
    const end = new Date(`${holidayEndDate}T23:59:59`);
    const holidayColor = "#FFCCCC"; // Fixed holiday color.
    const newHolidayEvent = {
      event_id: Date.now(),
      title: holidayTitle,
      start,
      end,
      blocked: true,
      holiday: true,
      bgColor: holidayColor,
    };
    setHolidayEvents((prev) => [...prev, newHolidayEvent]);
    alert("Holiday added successfully!");
    setShowHolidayForm(false);
    setHolidayTitle("");
    setHolidayStartDate("");
    setHolidayEndDate("");
    setHolidayErrors({});
  };

  const handleCancelHoliday = () => {
    setShowHolidayForm(false);
    setHolidayErrors({});
  };

  // -----------------------
  // Custom Event Renderer
  // -----------------------
  const customEventRenderer = ({ event }) => (
    <div
      style={{
        backgroundColor: event.bgColor || "#1976d2",
        padding: "2px 4px",
        borderRadius: 4,
        color: "#fff",
        fontSize: "0.85em",
        pointerEvents: event.blocked ? "none" : "auto",
      }}
    >
      {event.title}
    </div>
  );

  // -----------------------
  // Filter Change Handler
  // -----------------------
  const handleMemberFilterChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedMembers((prev) => [...prev, value]);
    } else {
      setSelectedMembers((prev) => prev.filter((id) => id !== value));
    }
  };

  const todayISO = new Date().toISOString().split("T")[0];

  // Combined events: appointments + custom block events + holiday events
  const combinedEvents = [...events, ...customBlockedEvents, ...holidayEvents].filter(
    (evt) => (evt.member ? selectedMembers.includes(evt.member) : true)
  );

  return (
    <div className="relative max-w-4xl mx-auto p-5">
      {/* Header with title and buttons */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold">My Calendar</h2>
        <div className="flex space-x-4">
          <button
            onClick={handleIntegrateGoogleCalendar}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition-colors"
          >
            Integrate Google Calendar
          </button>
          <button
            onClick={() => setShowBookingForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
          >
            Book New Appointment
          </button>
          <button
            onClick={() => setShowBlockForm(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded transition-colors"
          >
            Block Off Time
          </button>
          <button
            onClick={() => setShowHolidayForm(true)}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-colors"
          >
            Add Holiday
          </button>
        </div>
      </div>

     

      {/* Member Filter Checkboxes */}
      <div className="mb-5">
        <h3 className="text-xl font-medium mb-2">Filter by Member</h3>
        <div className="flex space-x-4">
          {membersList.map((m) => (
            <label key={m.id} className="flex items-center space-x-1">
              <input
                type="checkbox"
                value={m.id}
                checked={selectedMembers.includes(m.id)}
                onChange={handleMemberFilterChange}
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              <span>{m.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Scheduler Container */}
      <div className="relative z-0">
        <Scheduler
          view={view}
          events={combinedEvents}
          onConfirm={async (event, action) => {
            if (action === "edit" && event && !event.blocked) {
              setEvents((prev) =>
                prev.map((evt) =>
                  evt.event_id === event.event_id ? event : evt
                )
              );
              return event;
            }
          }}
          onDelete={async (deletedId) => {
            setEvents((prev) =>
              prev.filter((evt) => evt.event_id !== deletedId)
            );
            return deletedId;
          }}
          useFormPopup={false}
          useDetailPopup={false}
          editable={true}
          deletable={true}
          eventItemRenderer={customEventRenderer}
        />
      </div>

      {/* Booking Form Drawer */}
      {showBookingForm && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={handleCancelBooking}
          ></div>
          <div
            className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-lg z-50 p-6 overflow-y-auto transition-transform duration-300 ${
              showBookingForm ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <h2 className="text-2xl font-bold mb-4">Book a New Appointment</h2>
            <form onSubmit={handleBookAppointment} className="space-y-4">
              {/* Appointment Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Appointment Title*
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.title && (
                  <span className="text-red-600 text-sm">{errors.title}</span>
                )}
              </div>
              {/* Appointment Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Appointment Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {/* Select Member */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Member*
                </label>
                <select
                  value={member}
                  onChange={(e) => setMember(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Select Member --</option>
                  {membersList.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
                {errors.member && (
                  <span className="text-red-600 text-sm">{errors.member}</span>
                )}
              </div>
              {/* Select Timezone */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Timezone
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {timezones.map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </select>
              </div>
              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date Selection*
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.date && (
                  <span className="text-red-600 text-sm">{errors.date}</span>
                )}
              </div>
              {/* Time Slot Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Time Slot Selection*
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Select Time Slot --</option>
                  {date &&
                    availableTimeSlotsForDate(date).map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                </select>
                {errors.timeSlot && (
                  <span className="text-red-600 text-sm">{errors.timeSlot}</span>
                )}
              </div>
              {/* Meeting Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Meeting Location
                </label>
                <div className="mt-1 flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      id="default"
                      name="location"
                      value="default"
                      checked={locationType === "default"}
                      onChange={() => setLocationType("default")}
                      className="form-radio text-blue-600"
                    />
                    <span className="ml-2">Calendar Default</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      id="custom"
                      name="location"
                      value="custom"
                      checked={locationType === "custom"}
                      onChange={() => setLocationType("custom")}
                      className="form-radio text-blue-600"
                    />
                    <span className="ml-2">Custom</span>
                  </label>
                </div>
                {locationType === "custom" && (
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="Enter custom location"
                      value={customLocation}
                      onChange={(e) => setCustomLocation(e.target.value)}
                      className="w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.customLocation && (
                      <span className="text-red-600 text-sm">
                        {errors.customLocation}
                      </span>
                    )}
                  </div>
                )}
              </div>
              {/* Select Contact */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Contact*
                </label>
                <select
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Select Contact --</option>
                  {contacts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors.contact && (
                  <span className="text-red-600 text-sm">{errors.contact}</span>
                )}
              </div>
              {/* Status Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pending">Pending</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              {/* Form Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCancelBooking}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                >
                  Book Appointment
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Block Off Time Form Drawer */}
      {showBlockForm && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={handleCancelBlock}
          ></div>
          <div
            className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-lg z-50 p-6 overflow-y-auto transition-transform duration-300 ${
              showBlockForm ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <h2 className="text-2xl font-bold mb-4">Block Off Time</h2>
            <form onSubmit={handleBlockTime} className="space-y-4">
              {/* Block Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Block Title*
                </label>
                <input
                  type="text"
                  value={blockTitle}
                  onChange={(e) => setBlockTitle(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {blockErrors.blockTitle && (
                  <span className="text-red-600 text-sm">{blockErrors.blockTitle}</span>
                )}
              </div>
              {/* Select Calendar/Member for Block */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Calendar/Member*
                </label>
                <select
                  value={blockMember}
                  onChange={(e) => setBlockMember(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Select Member --</option>
                  {membersList.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
                {blockErrors.blockMember && (
                  <span className="text-red-600 text-sm">{blockErrors.blockMember}</span>
                )}
              </div>
              {/* Select Timezone */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Timezone
                </label>
                <select
                  value={blockTimezone}
                  onChange={(e) => setBlockTimezone(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {timezones.map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </select>
              </div>
              {/* Start Date & Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Date & Time*
                </label>
                <div className="flex space-x-2">
                  <input
                    type="date"
                    value={blockStartDate}
                    onChange={(e) => setBlockStartDate(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="time"
                    value={blockStartTime}
                    onChange={(e) => setBlockStartTime(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {blockErrors.blockStartDate && (
                  <span className="text-red-600 text-sm">{blockErrors.blockStartDate}</span>
                )}
                {blockErrors.blockStartTime && (
                  <span className="text-red-600 text-sm">{blockErrors.blockStartTime}</span>
                )}
              </div>
              {/* End Date & Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  End Date & Time*
                </label>
                <div className="flex space-x-2">
                  <input
                    type="date"
                    value={blockEndDate}
                    onChange={(e) => setBlockEndDate(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="time"
                    value={blockEndTime}
                    onChange={(e) => setBlockEndTime(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {blockErrors.blockEndDate && (
                  <span className="text-red-600 text-sm">{blockErrors.blockEndDate}</span>
                )}
                {blockErrors.blockEndTime && (
                  <span className="text-red-600 text-sm">{blockErrors.blockEndTime}</span>
                )}
                {blockErrors.blockTime && (
                  <span className="text-red-600 text-sm">{blockErrors.blockTime}</span>
                )}
              </div>
              {/* Form Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCancelBlock}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded"
                >
                  Block Time
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Holiday Form Drawer */}
      {showHolidayForm && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={handleCancelHoliday}
          ></div>
          <div
            className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-lg z-50 p-6 overflow-y-auto transition-transform duration-300 ${
              showHolidayForm ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <h2 className="text-2xl font-bold mb-4">Add Holiday</h2>
            <form onSubmit={handleAddHoliday} className="space-y-4">
              {/* Holiday Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Holiday Title*
                </label>
                <input
                  type="text"
                  value={holidayTitle}
                  onChange={(e) => setHolidayTitle(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {holidayErrors.holidayTitle && (
                  <span className="text-red-600 text-sm">{holidayErrors.holidayTitle}</span>
                )}
              </div>
              {/* Holiday Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Holiday Date Range*
                </label>
                <div className="flex space-x-2">
                  <input
                    type="date"
                    value={holidayStartDate}
                    onChange={(e) => setHolidayStartDate(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="date"
                    value={holidayEndDate}
                    onChange={(e) => setHolidayEndDate(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {holidayErrors.holidayStartDate && (
                  <span className="text-red-600 text-sm">{holidayErrors.holidayStartDate}</span>
                )}
                {holidayErrors.holidayEndDate && (
                  <span className="text-red-600 text-sm">{holidayErrors.holidayEndDate}</span>
                )}
                {holidayErrors.holidayTime && (
                  <span className="text-red-600 text-sm">{holidayErrors.holidayTime}</span>
                )}
              </div>
              {/* Form Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCancelHoliday}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
                >
                  Add Holiday
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Scheduler Container */}
      {/* <div className="relative z-0 mt-4">
        <Scheduler
          view={view}
          events={combinedEvents}
          onConfirm={async (event, action) => {
            if (action === "edit" && event && !event.blocked) {
              setEvents((prev) =>
                prev.map((evt) =>
                  evt.event_id === event.event_id ? event : evt
                )
              );
              return event;
            }
          }}
          onDelete={async (deletedId) => {
            setEvents((prev) =>
              prev.filter((evt) => evt.event_id !== deletedId)
            );
            return deletedId;
          }}
          useFormPopup={false}
          useDetailPopup={false}
          editable={true}
          deletable={true}
          eventItemRenderer={customEventRenderer}
        />
      </div> */}
    </div>
  );
}
