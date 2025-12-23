import React from "react";
import DayCell from "./DayCell";

const months = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"]; // Domingo a Sábado

function YearGrid({ year, tasks, selectedDate, onSelectDay }) {
  // Cria array de todos os dias do ano
  const days = [];
  const firstDayOfYear = new Date(year, 0, 1).getDay(); // 0 = domingo
  const lastDay = new Date(year, 11, 31);

  for (let d = new Date(year, 0, 1); d <= lastDay; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }

  const numRows = 7;
  const numCols = Math.ceil((days.length + firstDayOfYear) / 7);

  // Cria grid de dias com possíveis células vazias
  const grid = new Array(numCols * numRows).fill(null);
  days.forEach((date, index) => {
    const col = Math.floor((index + firstDayOfYear) / 7);
    const row = (index + firstDayOfYear) % 7;
    grid[col * numRows + row] = date;
  });

  // Função para pegar a primeira letra do mês se for o primeiro dia
  const getMonthLetter = (date) => {
    if (date.getDate() === 1) {
      const month = months[date.getMonth()];
      return month.slice(0, 3).charAt(0).toLowerCase() + month.slice(1, 3);
    }
    return "";
  };

  return (
    <div className="calendar-wrapper">
      <div className="calendar-grid">
        {/* Week labels */}
        <div className="week-labels">
          {weekDays.map((d, i) => (
            <div key={i}>{d}</div>
          ))}
        </div>

        {/* Grid de dias */}
        <div
          className="year-grid"
          style={{
            display: "grid",
            gridTemplateRows: `repeat(${numRows}, 20px)`,
            gridAutoFlow: "column",
            gap: "3px",
          }}
        >
          {grid.map((date, i) => {
            if (!date) return <div key={i} />;

            const key = date.toISOString().slice(0, 10);
            const monthLetter = getMonthLetter(date);

            return (
              <DayCell
                key={key}
                date={date}
                iso={key}
                tasks={tasks[key] || []}
                selected={selectedDate === key}
                onClick={() => onSelectDay(key)}
              >
                {monthLetter}
              </DayCell>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default YearGrid;
