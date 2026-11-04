import test from "node:test";
import assert from "node:assert/strict";

// Helper function logic under test
function getSolicitationStatus(deadlineStr, nowDate = new Date()) {
  const dateParts = deadlineStr.split("T")[0].split("-");
  let deadlineUtc;

  if (dateParts.length === 3) {
    const year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1;
    const day = parseInt(dateParts[2], 10);
    deadlineUtc = new Date(Date.UTC(year, month, day, 23, 59, 59, 999));
  } else {
    deadlineUtc = new Date(deadlineStr);
  }

  const diffMs = deadlineUtc.getTime() - nowDate.getTime();
  const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffMs < 0) {
    return {
      status: "closed",
      label: "Closed / Concluded",
      isPast: true,
      daysRemaining: 0,
    };
  }

  if (diffMs <= 7 * 24 * 60 * 60 * 1000) {
    return {
      status: "closing_soon",
      label: `Closing Soon (${daysRemaining}d left)`,
      isPast: false,
      daysRemaining,
    };
  }

  return {
    status: "open",
    label: "Active Solicitation",
    isPast: false,
    daysRemaining,
  };
}

test("identifies closed solicitations with past deadlines", () => {
  const refDate = new Date("2026-11-04T12:00:00Z");
  const res = getSolicitationStatus("2026-09-25", refDate);
  assert.equal(res.status, "closed");
  assert.equal(res.isPast, true);
});

test("identifies closing soon solicitations within 7 days", () => {
  const refDate = new Date("2026-11-04T12:00:00Z");
  const res = getSolicitationStatus("2026-11-08", refDate);
  assert.equal(res.status, "closing_soon");
  assert.equal(res.isPast, false);
});

test("identifies open solicitations beyond 7 days", () => {
  const refDate = new Date("2026-11-04T12:00:00Z");
  const res = getSolicitationStatus("2026-11-20", refDate);
  assert.equal(res.status, "open");
  assert.equal(res.isPast, false);
});

test("handles UTC end-of-day edge correctly on the exact deadline date", () => {
  // At 14:00 on the deadline date, deadline is 23:59:59.999Z, so still closing soon / open on that date
  const refDate = new Date("2026-11-04T14:00:00Z");
  const res = getSolicitationStatus("2026-11-04", refDate);
  assert.equal(res.status, "closing_soon");
  assert.equal(res.isPast, false);

  // One minute after UTC midnight of deadline date
  const pastDate = new Date("2026-11-05T00:00:01Z");
  const resPast = getSolicitationStatus("2026-11-04", pastDate);
  assert.equal(resPast.status, "closed");
  assert.equal(resPast.isPast, true);
});

