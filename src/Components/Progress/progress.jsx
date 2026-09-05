import './progress.css'

const Progress = ({ targets, meals }) => {
  const calorieGoal = (Number(targets.protein) || 0) * 4
    + (Number(targets.carbs) || 0) * 4
    + (Number(targets.fats) || 0) * 9

  const caloriesConsumed = meals.reduce(
    (total, meal) => total + (meal.macros.protein * 4) + (meal.macros.carbs * 4) + (meal.macros.fats * 9),
    0,
  )

  const caloriesRemaining = Math.max(calorieGoal - caloriesConsumed, 0)
  const percentageComplete = calorieGoal > 0 ? Math.min((caloriesConsumed / calorieGoal) * 100, 100) : 0
  const percentageLeft = calorieGoal > 0 ? Math.max(100 - percentageComplete, 0) : 0
  const circleStyle = { '--progress': `${percentageComplete * 3.6}deg` }

  return (
    <section className="progress-section" id="progress" aria-labelledby="progress-title">
      <h1 id="progress-title">Progress</h1>
      <div className="progress-layout">
        <div className="calorie-ring" style={circleStyle} role="progressbar" aria-label="Calories consumed" aria-valuemin="0" aria-valuemax={calorieGoal} aria-valuenow={caloriesConsumed}>
          <div className="calorie-ring__center">
            <strong>{Math.round(caloriesConsumed).toLocaleString()}</strong>
            <span>kCal</span>
          </div>
        </div>

        <div className="progress-summary">
          <div className="progress-summary__top">
            <article className="summary-card">
              <span>Calorie Goal</span>
              <strong>{Math.round(calorieGoal).toLocaleString()} <small>kCal</small></strong>
            </article>
            <article className="summary-card">
              <span>Calories Consumed</span>
              <strong>{Math.round(caloriesConsumed).toLocaleString()} <small>kCal</small></strong>
            </article>
          </div>
          <article className="summary-card summary-card--remaining">
            <span>Calories Remaining</span>
            <div className="remaining-values">
              <strong>{Math.round(caloriesRemaining).toLocaleString()} <small>kCal</small></strong>
              <b>{percentageLeft.toFixed(1)}% left</b>
            </div>
            <div className="calorie-progress-track"><div className="calorie-progress-fill" style={{ width: `${percentageComplete}%` }} /></div>
          </article>
        </div>
      </div>
    </section>
  )
}

export default Progress
