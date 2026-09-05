import './daypicker.css'

const DayPicker = ({ selectedDate, setSelectedDate }) => (
  <section className="day-picker" aria-label="Select tracking date">
    <div className="day-picker__content">
      <label htmlFor="tracking-date">Tracking date</label>
      <input id="tracking-date" type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} />
      <span>Your meals, macros, and calories are saved separately for each day.</span>
    </div>
  </section>
)

export default DayPicker
