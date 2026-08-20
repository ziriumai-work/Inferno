export const availableSlots: Record<string, Slot[]> = {
  "Mon": [
    { time: "09:00 AM", available: true },
    { time: "09:30 AM", available: false },
    { time: "10:00 AM", available: true },
    { time: "10:30 AM", available: true },
    { time: "11:00 AM", available: false },
    { time: "01:30 PM", available: true },
    { time: "02:00 PM", available: true },
    { time: "03:30 PM", available: false }
  ],
  "Tue": [
    { time: "09:00 AM", available: true },
    { time: "10:00 AM", available: true },
    { time: "10:30 AM", available: false },
    { time: "11:00 AM", available: true },
    { time: "01:30 PM", available: true },
    { time: "02:00 PM", available: false },
    { time: "03:30 PM", available: true }
  ],
  "Wed": [
    { time: "09:30 AM", available: true },
    { time: "10:00 AM", available: true },
    { time: "10:30 AM", available: true },
    { time: "11:00 AM", available: true },
    { time: "01:30 PM", available: false },
    { time: "02:00 PM", available: true },
    { time: "03:30 PM", available: true }
  ],
  "Thu": [
    { time: "09:00 AM", available: false },
    { time: "10:00 AM", available: true },
    { time: "10:30 AM", available: true },
    { time: "11:00 AM", available: false },
    { time: "01:30 PM", available: true },
    { time: "02:00 PM", available: true },
    { time: "03:30 PM", available: true }
  ],
  "Fri": [
    { time: "09:00 AM", available: true },
    { time: "09:30 AM", available: true },
    { time: "10:00 AM", available: false },
    { time: "10:30 AM", available: true },
    { time: "11:00 AM", available: true },
    { time: "01:30 PM", available: true },
    { time: "02:00 PM", available: false },
    { time: "03:30 PM", available: false }
  ]
};
