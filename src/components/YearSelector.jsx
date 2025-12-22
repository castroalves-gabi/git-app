export default function YearSelector({ year, setYear }) {
  const years = [2025, 2026, 2027, 2028, 2029, 2030];

  return (
    <div className="year-selector">
      {years.map(y => (
        <button
          key={y}
          className={y === year ? "active" : ""}
          onClick={() => setYear(y)}
        >
          {y}
        </button>
      ))}
    </div>
  );
}
