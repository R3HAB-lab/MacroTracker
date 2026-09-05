import { useState } from 'react'
import './addmeal.css'

const foods = {
  'chicken breast': { protein: 31, carbs: 0, fats: 3.6 },
  egg: { protein: 12.6, carbs: 1.1, fats: 10.6 },
  rice: { protein: 2.7, carbs: 28, fats: 0.3 },
  salmon: { protein: 20.4, carbs: 0, fats: 13.4 },
}

const getNutrition = (name) => foods[name.trim().toLowerCase().replace(/[.,]/g, '')]
const newItem = () => ({ id: crypto.randomUUID(), name: '', grams: '' })
const newMeal = () => ({ id: crypto.randomUUID(), items: [newItem()], collapsed: false })

const AddMeal = ({ meals, setMeals }) => {
  const [mealCards, setMealCards] = useState([newMeal()])
  const [message, setMessage] = useState('')
  const [collapsedSavedMeals, setCollapsedSavedMeals] = useState({})
  const [editingItem, setEditingItem] = useState(null)

  const addMeal = () => setMealCards((current) => [...current, newMeal()])

  const toggleMeal = (mealId) => {
    setMealCards((current) => current.map((meal) => (
      meal.id === mealId ? { ...meal, collapsed: !meal.collapsed } : meal
    )))
  }

  const deleteMeal = (mealId) => {
    setMealCards((current) => current.filter((meal) => meal.id !== mealId))
  }

  const deleteItem = (mealId, itemId) => {
    setMealCards((current) => current.map((meal) => (
      meal.id === mealId
        ? { ...meal, items: meal.items.filter((item) => item.id !== itemId) }
        : meal
    )))
  }

  const addItem = (mealId) => {
    setMealCards((current) => current.map((meal) => (
      meal.id === mealId && meal.items.length < 4
        ? { ...meal, items: [...meal.items, newItem()] }
        : meal
    )))
  }

  const updateItem = (mealId, itemId, field, value) => {
    setMealCards((current) => current.map((meal) => (
      meal.id === mealId
        ? { ...meal, items: meal.items.map((item) => (item.id === itemId ? { ...item, [field]: value } : item)) }
        : meal
    )))
  }

  const saveMeals = (event) => {
    event.preventDefault()
    const entries = mealCards
      .flatMap((meal, mealIndex) => meal.items.map((item) => ({ ...item, mealNumber: mealIndex + 1, mealKey: meal.id })))
      .filter((item) => item.name.trim() || item.grams)
    const invalidItem = entries.find((item) => !getNutrition(item.name) || Number(item.grams) <= 0)

    if (entries.length === 0 || invalidItem) {
      setMessage('Use a supported item name and enter grams greater than zero for every item.')
      return
    }

    const savedMeals = entries.map((item) => {
      const nutrition = getNutrition(item.name)
      const multiplier = Number(item.grams) / 100
      return {
        id: item.id,
        number: item.mealNumber,
        mealKey: item.mealKey,
        name: item.name.trim(),
        grams: Number(item.grams),
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
      setMessage('Use a supported item name and enter grams greater than zero.')
      return
    }

    const multiplier = grams / 100
    setMeals((current) => current.map((meal) => (
      meal.id === editingItem.id
        ? { ...meal, name: editingItem.name.trim(), grams, macros: { protein: nutrition.protein * multiplier, carbs: nutrition.carbs * multiplier, fats: nutrition.fats * multiplier } }
        : meal
    )))
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
    setMessage('Saved meal deleted. Your macro totals and progress have been refreshed.')
  }

  return (
    <section className="add-meal" id="add-meals" aria-labelledby="add-meal-title">
      <div className="add-meal__card">
        <h1 id="add-meal-title">Add Meal Plan</h1>
        <p className="add-meal__hint">Supported items: Chicken breast, Egg, Rice, and Salmon.</p>

        <form onSubmit={saveMeals}>
          {mealCards.map((meal, mealIndex) => (
            <article className="meal-builder" key={meal.id}>
              <div className="meal-builder__heading">
                <h2>Meal {mealIndex + 1}</h2>
                <div className="meal-builder__controls">
                  <span>{meal.items.length} / 4 items</span>
                  <button type="button" onClick={() => toggleMeal(meal.id)} aria-expanded={!meal.collapsed}>
                    {meal.collapsed ? 'Expand' : 'Collapse'}
                  </button>
                  <button className="delete-button" type="button" onClick={() => deleteMeal(meal.id)}>Delete meal</button>
                </div>
              </div>
              {!meal.collapsed && <>
                <div className="meal-builder__items">
                  {meal.items.map((item, itemIndex) => (
                    <div className="meal-item-row" key={item.id}>
                      <label>Item {itemIndex + 1}
                        <input value={item.name} onChange={(event) => updateItem(meal.id, item.id, 'name', event.target.value)} placeholder="Chicken breast" />
                      </label>
                      <label>Grams
                        <input type="number" min="1" value={item.grams} onChange={(event) => updateItem(meal.id, item.id, 'grams', event.target.value)} placeholder="200" inputMode="numeric" />
                      </label>
                      <button className="delete-button delete-item-button" type="button" onClick={() => deleteItem(meal.id, item.id)} aria-label={`Delete item ${itemIndex + 1}`}>Delete</button>
                    </div>
                  ))}
                </div>
                <button className="add-meal__secondary-button" type="button" onClick={() => addItem(meal.id)} disabled={meal.items.length === 4}>+ Add meal item</button>
              </>}
            </article>
          ))}

          <button className="add-meal__secondary-button add-meal__new-card" type="button" onClick={addMeal}>+ Add another meal card</button>
          <button className="add-meal__save-button" type="submit">Save Meals</button>
        </form>

        {message && <p className="add-meal__message" role="status">{message}</p>}
        {meals.length > 0 && <div className="saved-meals">
          <h2>Saved Meals</h2>
          {Object.entries(savedMealGroups).map(([mealKey, mealGroup]) => (
            <article className="saved-meal-card" key={mealKey}>
              <div className="saved-meal-card__heading">
                <h3>Meal {mealGroup.number}</h3>
                <button type="button" onClick={() => setCollapsedSavedMeals((current) => ({ ...current, [mealKey]: !current[mealKey] }))} aria-expanded={!collapsedSavedMeals[mealKey]}>
                  {collapsedSavedMeals[mealKey] ? 'Expand' : 'Collapse'}
                </button>
                <button className="saved-meal-delete" type="button" onClick={() => deleteSavedMeal(mealKey)}>Delete meal</button>
              </div>
              {!collapsedSavedMeals[mealKey] && mealGroup.items.map((meal) => (
                editingItem?.id === meal.id ? (
                  <form className="saved-item-edit" key={meal.id} onSubmit={updateSavedItem}>
                    <input value={editingItem.name} onChange={(event) => setEditingItem((current) => ({ ...current, name: event.target.value }))} aria-label="Item name" />
                    <input type="number" min="1" value={editingItem.grams} onChange={(event) => setEditingItem((current) => ({ ...current, grams: event.target.value }))} aria-label="Item grams" />
                    <button type="submit">Update</button>
                    <button type="button" onClick={() => setEditingItem(null)}>Cancel</button>
                  </form>
                ) : (
                  <div className="saved-item" key={meal.id}>
                    <span>{meal.name} — {meal.grams}g</span>
                    <button type="button" onClick={() => setEditingItem({ id: meal.id, name: meal.name, grams: meal.grams })}>Edit</button>
                  </div>
                )
              ))}
            </article>
          ))}
        </div>}
      </div>
    </section>
  )
}

export default AddMeal
