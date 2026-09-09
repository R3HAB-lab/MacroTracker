import { useState } from 'react'
import './addmeal.css'

const foods = {
  'chicken breast': { protein: 31, carbs: 0, fats: 3.6 },
  'whole egg': { protein: 6, carbs: 0, fats: 4.5, calories: 78, unit: 'count' },
  'egg white': { protein: 3.5, carbs: 0, fats: 0, calories: 18, unit: 'count' },
  chapati: { protein: 4, carbs: 25, fats: 0, calories: 119, unit: 'count' },
  rice: { protein: 2.7, carbs: 28, fats: 0.3 },
  'Fish Fillet': { protein: 20.4, carbs: 0, fats: 13.4 },

  // Dairy (per 100ml / 100g)
  'nandini milk': { protein: 3.5, carbs: 5, fats: 4, calories: 71 },
  curd: { protein: 3.7, carbs: 4.4, fats: 3, calories: 60 },

  // Paneer (per 100g)
  'milky mist high protein paneer': { protein: 25, carbs: 5.7, fats: 9, calories: 203 },
  'milky mist paneer': { protein: 16.1, carbs: 5.1, fats: 22, calories: 283 },
  'nandini paneer': { protein: 21.4, carbs: 1.5, fats: 28, calories: 344 },

  // Butter (stored per 100g)
  butter: { protein: 0, carbs: 0, fats: 83, calories: 750 },

  // Oats & fruits (per 100g)
  oats: { protein: 12, carbs: 68, fats: 10, calories: 407 },
  banana: { protein: 1, carbs: 23, fats: 0, calories: 89 },
}

const foodOptions = Object.keys(foods)

const getNutrition = (name) => (name ? foods[name.trim().toLowerCase().replace(/[.,]/g, '')] : null)
const getUnit = (name) => getNutrition(name)?.unit || 'grams'
const getQuantityLabel = (name) => (getUnit(name) === 'count' ? 'Number' : 'Grams')
const getQuantitySuffix = (name) => (getUnit(name) === 'count' ? '' : 'g')

const calculateCalories = (nutrition, multiplier) => {
  if (nutrition.calories !== undefined) {
    return nutrition.calories * multiplier
  }
  const proteinCals = nutrition.protein * 4
  const carbsCals = nutrition.carbs * 4
  const fatsCals = nutrition.fats * 9
  return (proteinCals + carbsCals + fatsCals) * multiplier
}

const formatFoodLabel = (str) => str.replace(/\b\w/g, (char) => char.toUpperCase())

const newItem = () => ({ id: crypto.randomUUID(), name: '', grams: '' })
const newMeal = () => ({ id: crypto.randomUUID(), items: [newItem()], collapsed: false })
const getNextMealNumber = (meals) =>
  meals.reduce((highestNumber, meal) => Math.max(highestNumber, Number(meal.number) || 0), 0) + 1

const AddMeal = ({ meals, setMeals }) => {
  const [mealCards, setMealCards] = useState([newMeal()])
  const [message, setMessage] = useState('')
  const [collapsedSavedMeals, setCollapsedSavedMeals] = useState({})
  const [editingItem, setEditingItem] = useState(null)

  const addMeal = () => setMealCards((current) => [...current, newMeal()])

  const toggleMeal = (mealId) => {
    setMealCards((current) =>
      current.map((meal) => (meal.id === mealId ? { ...meal, collapsed: !meal.collapsed } : meal))
    )
  }

  const deleteMeal = (mealId) => {
    setMealCards((current) => current.filter((meal) => meal.id !== mealId))
  }

  const deleteItem = (mealId, itemId) => {
    setMealCards((current) =>
      current.map((meal) =>
        meal.id === mealId
          ? { ...meal, items: meal.items.filter((item) => item.id !== itemId) }
          : meal
      )
    )
  }

  const addItem = (mealId) => {
    setMealCards((current) =>
      current.map((meal) =>
        meal.id === mealId && meal.items.length < 4
          ? { ...meal, items: [...meal.items, newItem()] }
          : meal
      )
    )
  }

  const updateItem = (mealId, itemId, field, value) => {
    setMealCards((current) =>
      current.map((meal) =>
        meal.id === mealId
          ? {
              ...meal,
              items: meal.items.map((item) =>
                item.id === itemId ? { ...item, [field]: value } : item
              ),
            }
          : meal
      )
    )
  }

  const saveMeals = (event) => {
    event.preventDefault()
    const firstMealNumber = getNextMealNumber(meals)
    const entries = mealCards
      .flatMap((meal, mealIndex) =>
        meal.items.map((item) => ({
          ...item,
          mealNumber: firstMealNumber + mealIndex,
          mealKey: meal.id,
        }))
      )
      .filter((item) => item.name.trim() || item.grams)

    const invalidItem = entries.find((item) => !getNutrition(item.name) || Number(item.grams) <= 0)

    if (entries.length === 0 || invalidItem) {
      setMessage('Select a valid food item and enter a quantity greater than zero for every item.')
      return
    }

    const savedMeals = entries.map((item) => {
      const nutrition = getNutrition(item.name)
      const multiplier = nutrition.unit === 'count' ? Number(item.grams) : Number(item.grams) / 100
      return {
        id: item.id,
        number: item.mealNumber,
        mealKey: item.mealKey,
        name: item.name.trim(),
        grams: Number(item.grams),
        unit: getUnit(item.name),
        calories: calculateCalories(nutrition, multiplier),
        macros: {
          protein: nutrition.protein * multiplier,
          carbs: nutrition.carbs * multiplier,
          fats: nutrition.fats * multiplier,
        },
      }
    })

    setMeals((current) => [...current, ...savedMeals])
    setMealCards([newMeal()])
    setMessage('Meals saved. Your macro totals have been updated.')
  }

  const updateSavedItem = (event) => {
    event.preventDefault()
    const nutrition = getNutrition(editingItem.name)
    const grams = Number(editingItem.grams)

    if (!nutrition || grams <= 0) {
      setMessage('Select a valid food item and enter a quantity greater than zero.')
      return
    }

    const multiplier = nutrition.unit === 'count' ? grams : grams / 100
    setMeals((current) =>
      current.map((meal) =>
        meal.id === editingItem.id
          ? {
              ...meal,
              name: editingItem.name.trim(),
              grams,
              unit: getUnit(editingItem.name),
              calories: calculateCalories(nutrition, multiplier),
              macros: {
                protein: nutrition.protein * multiplier,
                carbs: nutrition.carbs * multiplier,
                fats: nutrition.fats * multiplier,
              },
            }
          : meal
      )
    )
    setEditingItem(null)
    setMessage('Item updated. Your macro totals and progress have been refreshed.')
  }

  const savedMealGroups = meals.reduce((groups, meal) => {
    const key = meal.mealKey || meal.id
    if (!groups[key]) groups[key] = { number: meal.number, items: [] }
    groups[key].items.push(meal)
    return groups
  }, {})

  const deleteSavedMeal = (mealKey) => {
    setMeals((current) => current.filter((meal) => (meal.mealKey || meal.id) !== mealKey))
    setEditingItem(null)
    setMessage('Saved meal deleted. Your macro totals and progress have been refreshed.')
  }

  return (
    <section className="add-meal" id="add-meals" aria-labelledby="add-meal-title">
      <div className="add-meal__card">
        <h1 id="add-meal-title">Add Meal Plan</h1>
        <p className="add-meal__hint">
          Select a food item from the list and enter the quantity (count or grams).
        </p>

        <form onSubmit={saveMeals}>
          {mealCards.map((meal, mealIndex) => (
            <article className="meal-builder" key={meal.id}>
              <div className="meal-builder__heading">
                <h2>Meal {getNextMealNumber(meals) + mealIndex}</h2>
                <div className="meal-builder__controls">
                  <span>{meal.items.length} / 4 items</span>
                  <button
                    type="button"
                    onClick={() => toggleMeal(meal.id)}
                    aria-expanded={!meal.collapsed}
                  >
                    {meal.collapsed ? 'Expand' : 'Collapse'}
                  </button>
                  <button
                    className="delete-button"
                    type="button"
                    onClick={() => deleteMeal(meal.id)}
                  >
                    Delete meal
                  </button>
                </div>
              </div>
              {!meal.collapsed && (
                <>
                  <div className="meal-builder__items">
                    {meal.items.map((item, itemIndex) => (
                      <div className="meal-item-row" key={item.id}>
                        <label>
                          Item {itemIndex + 1}
                          <select
                            value={item.name}
                            onChange={(event) =>
                              updateItem(meal.id, item.id, 'name', event.target.value)
                            }
                          >
                            <option value="" disabled>
                              Select an item
                            </option>
                            {foodOptions.map((foodKey) => (
                              <option key={foodKey} value={foodKey}>
                                {formatFoodLabel(foodKey)}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label>
                          {getQuantityLabel(item.name)}
                          <input
                            type="number"
                            min="1"
                            value={item.grams}
                            onChange={(event) =>
                              updateItem(meal.id, item.id, 'grams', event.target.value)
                            }
                            placeholder={getUnit(item.name) === 'count' ? '1' : 'gm'}
                            inputMode="numeric"
                          />
                        </label>
                        <button
                          className="delete-button delete-item-button"
                          type="button"
                          onClick={() => deleteItem(meal.id, item.id)}
                          aria-label={`Delete item ${itemIndex + 1}`}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    className="add-meal__secondary-button"
                    type="button"
                    onClick={() => addItem(meal.id)}
                    disabled={meal.items.length === 4}
                  >
                    + Add meal item
                  </button>
                </>
              )}
            </article>
          ))}

          <button
            className="add-meal__secondary-button add-meal__new-card"
            type="button"
            onClick={addMeal}
          >
            + Add another meal card
          </button>
          <button className="add-meal__save-button" type="submit">
            Save Meals
          </button>
        </form>

        {message && (
          <p className="add-meal__message" role="status">
            {message}
          </p>
        )}

        {meals.length > 0 && (
          <div className="saved-meals">
            <h2>Saved Meals</h2>
            {Object.entries(savedMealGroups).map(([mealKey, mealGroup]) => (
              <article className="saved-meal-card" key={mealKey}>
                <div className="saved-meal-card__heading">
                  <h3>Meal {mealGroup.number}</h3>
                  <button
                    type="button"
                    onClick={() =>
                      setCollapsedSavedMeals((current) => ({
                        ...current,
                        [mealKey]: !current[mealKey],
                      }))
                    }
                    aria-expanded={!collapsedSavedMeals[mealKey]}
                  >
                    {collapsedSavedMeals[mealKey] ? 'Expand' : 'Collapse'}
                  </button>
                  <button
                    className="saved-meal-delete"
                    type="button"
                    onClick={() => deleteSavedMeal(mealKey)}
                  >
                    Delete meal
                  </button>
                </div>
                {!collapsedSavedMeals[mealKey] &&
                  mealGroup.items.map((meal) =>
                    editingItem?.id === meal.id ? (
                      <form className="saved-item-edit" key={meal.id} onSubmit={updateSavedItem}>
                        <select
                          value={editingItem.name}
                          onChange={(event) =>
                            setEditingItem((current) => ({ ...current, name: event.target.value }))
                          }
                          aria-label="Item name"
                        >
                          <option value="" disabled>
                            Select an item
                          </option>
                          {foodOptions.map((foodKey) => (
                            <option key={foodKey} value={foodKey}>
                              {formatFoodLabel(foodKey)}
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          min="1"
                          value={editingItem.grams}
                          onChange={(event) =>
                            setEditingItem((current) => ({
                              ...current,
                              grams: event.target.value,
                            }))
                          }
                          placeholder={getUnit(editingItem.name) === 'count' ? '1' : 'gm'}
                          aria-label={`Item ${getQuantityLabel(editingItem.name).toLowerCase()}`}
                        />
                        <button type="submit">Update</button>
                        <button type="button" onClick={() => setEditingItem(null)}>
                          Cancel
                        </button>
                      </form>
                    ) : (
                      <div className="saved-item" key={meal.id}>
                        <span>
                          {formatFoodLabel(meal.name)} — {meal.grams}
                          {getQuantitySuffix(meal.name)}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setEditingItem({ id: meal.id, name: meal.name, grams: meal.grams })
                          }
                        >
                          Edit
                        </button>
                      </div>
                    )
                  )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default AddMeal