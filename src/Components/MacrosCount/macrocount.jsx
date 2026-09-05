import './macrocount.css'

const MacroCount = ({ targets, meals }) => {
  const totals = meals.reduce(
    (sum, meal) => ({
      protein: sum.protein + meal.macros.protein,
      carbs: sum.carbs + meal.macros.carbs,
      fats: sum.fats + meal.macros.fats,
    }),
    { protein: 0, carbs: 0, fats: 0 },
  )

  const macros = [
    { name: 'Protein', value: totals.protein, goal: Number(targets.protein) || 0, color: 'purple' },
    { name: 'Carbs', value: totals.carbs, goal: Number(targets.carbs) || 0, color: 'pink' },
    { name: 'Fats', value: totals.fats, goal: Number(targets.fats) || 0, color: 'orange' },
  ]

  return (
    <main className="macro-count" id="macros-count" aria-label="Daily macro progress">
      <h1 className="macro-count__title">Your Macros Count</h1>
      <section className="macro-card">
        {macros.map((macro) => {
          const progress = macro.goal > 0
            ? Math.min((macro.value / macro.goal) * 100, 100)
            : 0

          return (
            <article className="macro-item" key={macro.name}>
              <div className="macro-heading">
                <h2>{macro.name}</h2>
                <span>{macro.value.toFixed(1)} / {macro.goal}g</span>
              </div>
              <div
                className="progress-track"
                role="progressbar"
                aria-label={`${macro.name} progress`}
                aria-valuemin="0"
                aria-valuemax={macro.goal}
                aria-valuenow={macro.value}
              >
                <div
                  className={`progress-fill progress-fill--${macro.color}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </article>
          )
        })}
      </section>
    </main>
  )
}

export default MacroCount
