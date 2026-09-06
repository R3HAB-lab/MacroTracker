import './macrotarget.css'

const MacroTarget = ({ targets, setTargets }) => {

  const updateTarget = (event) => {
    const { name, value } = event.target
    setTargets((current) => ({ ...current, [name]: value }))
  }

  const proteinCalories = (Number(targets.protein) || 0) * 4
  const carbsCalories = (Number(targets.carbs) || 0) * 4
  const fatsCalories = (Number(targets.fats) || 0) * 9
  const totalCalories = proteinCalories + carbsCalories + fatsCalories

  return (
    <section className="macro-target" id="your-target" aria-labelledby="target-title">
      <div className="macro-target__card">
        <h1 id="target-title">Enter Your Macros Target</h1>

        <div className="target-fields">
          <label>
            Enter your Protein Target:
            <input
              type="number"
              name="protein"
              value={targets.protein}
              onChange={updateTarget}
              min="0"
              placeholder="gm"
              inputMode="numeric"
            />
          </label>

          <label>
            Enter your Carbs Target:
            <input
              type="number"
              name="carbs"
              value={targets.carbs}
              onChange={updateTarget}
              min="0"
              placeholder="gm"
              inputMode="numeric"
            />
          </label>

          <label>
            Enter your Fats Target:
            <input
              type="number"
              name="fats"
              value={targets.fats}
              onChange={updateTarget}
              min="0"
              placeholder="gm"
              inputMode="numeric"
            />
          </label>
        </div>

        <div className="total-calories" aria-live="polite">
          <span>Total Calories</span>
          <strong>{totalCalories.toLocaleString()} kcal</strong>
        </div>
      </div>
    </section>
  )
}

export default MacroTarget
