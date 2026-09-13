import { useState } from 'react'
import './macrotarget.css'

const goals = {
  maintain: {
    label: 'Maintain',
    hint: 'Eat at maintenance and hold your current weight.',
    caloriesPerKg: 30,
    proteinPerKg: 1.6,
    fatsPerKg: 0.9,
  },
  muscle: {
    label: 'Build Muscle',
    hint: 'Slight surplus with higher protein to support new muscle.',
    caloriesPerKg: 35,
    proteinPerKg: 2,
    fatsPerKg: 1,
  },
  fatloss: {
    label: 'Lose Body Fat',
    hint: 'Calorie deficit with high protein to protect muscle.',
    caloriesPerKg: 24,
    proteinPerKg: 2.2,
    fatsPerKg: 0.8,
  },
}

const goalOptions = Object.keys(goals)
const poundsPerKg = 2.20462

const toKilograms = (weight, unit) => {
  const value = Number(weight) || 0
  return unit === 'lb' ? value / poundsPerKg : value
}

const buildSuggestion = (weightInKg, goal) => {
  const protein = Math.round(weightInKg * goal.proteinPerKg)
  const fats = Math.round(weightInKg * goal.fatsPerKg)
  const remainingCalories = weightInKg * goal.caloriesPerKg - protein * 4 - fats * 9
  const carbs = Math.max(Math.round(remainingCalories / 4), 0)
  return { protein, carbs, fats, calories: protein * 4 + carbs * 4 + fats * 9 }
}

const MacroTarget = ({ targets, setTargets, body, setBody }) => {
  const [message, setMessage] = useState('')

  const updateTarget = (event) => {
    const { name, value } = event.target
    setTargets((current) => ({ ...current, [name]: value }))
  }

  const updateBody = (field, value) => {
    setBody((current) => ({ ...current, [field]: value }))
    setMessage('')
  }

  const proteinCalories = (Number(targets.protein) || 0) * 4
  const carbsCalories = (Number(targets.carbs) || 0) * 4
  const fatsCalories = (Number(targets.fats) || 0) * 9
  const totalCalories = proteinCalories + carbsCalories + fatsCalories

  const goal = goals[body.goal] || goals.maintain
  const weightInKg = toKilograms(body.weight, body.unit)
  const suggestion = weightInKg > 0 ? buildSuggestion(weightInKg, goal) : null

  const applySuggestion = () => {
    if (!suggestion) {
      setMessage('Enter your body weight to calculate a macro split.')
      return
    }
    setTargets((current) => ({
      ...current,
      protein: String(suggestion.protein),
      carbs: String(suggestion.carbs),
      fats: String(suggestion.fats),
    }))
    setMessage(`Targets set for "${goal.label.toLowerCase()}". You can still fine-tune them below.`)
  }

  return (
    <section className="macro-target" id="your-target" aria-labelledby="target-title">
      <div className="macro-target__card">
        <h1 id="target-title">Enter Your Macros Target</h1>

        <div className="macro-calculator">
          <h2 className="macro-calculator__title">Calculate From Body Weight</h2>
          <p className="macro-calculator__hint">
            Enter your body weight and pick a goal to get a suggested protein, carb, and fat split.
          </p>

          <label className="macro-calculator__weight">
            Body weight
            <div className="macro-calculator__weight-row">
              <input
                type="number"
                min="0"
                step="0.1"
                value={body.weight}
                onChange={(event) => updateBody('weight', event.target.value)}
                placeholder={body.unit === 'lb' ? 'lb' : 'kg'}
                inputMode="decimal"
              />
              <select
                value={body.unit}
                onChange={(event) => updateBody('unit', event.target.value)}
                aria-label="Body weight unit"
              >
                <option value="kg">kg</option>
                <option value="lb">lb</option>
              </select>
            </div>
          </label>

          <fieldset className="goal-options">
            <legend>Your goal</legend>
            <div className="goal-options__grid">
              {goalOptions.map((goalKey) => (
                <label
                  className={`goal-option${body.goal === goalKey ? ' goal-option--active' : ''}`}
                  key={goalKey}
                >
                  <input
                    type="radio"
                    name="goal"
                    value={goalKey}
                    checked={body.goal === goalKey}
                    onChange={(event) => updateBody('goal', event.target.value)}
                  />
                  <span className="goal-option__label">{goals[goalKey].label}</span>
                  <span className="goal-option__hint">{goals[goalKey].hint}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="macro-suggestion" aria-live="polite">
            {suggestion ? (
              <>
                <div className="macro-suggestion__values">
                  <span>
                    Protein <strong>{suggestion.protein}g</strong>
                  </span>
                  <span>
                    Carbs <strong>{suggestion.carbs}g</strong>
                  </span>
                  <span>
                    Fats <strong>{suggestion.fats}g</strong>
                  </span>
                  <span>
                    Calories <strong>{suggestion.calories.toLocaleString()} kcal</strong>
                  </span>
                </div>
                <button className="macro-calculator__button" type="button" onClick={applySuggestion}>
                  Use these targets
                </button>
              </>
            ) : (
              <p className="macro-suggestion__empty">
                Enter a body weight above to see your suggested macros.
              </p>
            )}
          </div>

          {message && (
            <p className="macro-calculator__message" role="status">
              {message}
            </p>
          )}
        </div>

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
