import DayCell from "./DayCell";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function YearGrid({ year, tasks, selectedDate, onSelectDay }) {
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);

  const days = [];
  let current = new Date(start);
  while (current <= end) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  const firstDayOffset = start.getDay();
  const numRows = 7;
  const totalCells = firstDayOffset + days.length;
  const numCols = Math.ceil(totalCells / numRows);

  const grid = Array.from({ length: numRows * numCols }, (_, index) => {
    const row = index % numRows;
    const col = Math.floor(index / numRows);
    const dayIndex = col * numRows + row - firstDayOffset;
    return dayIndex >= 0 && dayIndex < days.length ? days[dayIndex] : null;
  });

  // labels dos meses
  const monthLabels = {};
  days.forEach((d, index) => {
    if (d.getDate() === 1) {
      const col = Math.floor((index + firstDayOffset) / 7);
      monthLabels[col] = months[d.getMonth()];
    }
  });

  return (
    <div className="calendar-wrapper">
      <div className="month-row">
        {Array.from({ length: numCols }).map((_, i) => (
          <div key={i} className="month-label">
            {monthLabels[i] || ""}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        <div className="week-labels">
          {weekDays.map(d => <div key={d}>{d}</div>)}
        </div>

        <div
          className="year-grid"
          style={{
            display: "grid",
            gridTemplateRows: `repeat(${numRows}, 14px)`,
            gridAutoFlow: "column",
            gap: "3px"
          }}
        >
          {grid.map((date, i) => {
            if (!date) return <div key={i} />;
            const key = date.toISOString().slice(0, 10);
            return (
              <DayCell
                key={key}
                date={date}
                iso={key}
                tasks={tasks[key] || []}
                selected={selectedDate === key}
                onClick={() => onSelectDay(key)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
