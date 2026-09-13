import { useEffect, useState } from 'react'
import Navbar from './Components/Navbar/navbar'
import DayPicker from './Components/DayPicker/daypicker'
import MacrosCount from './Components/MacrosCount/macrocount'
import MacrosTarget from './Components/MacrosTarget/macrotarget'
import AddMeals from './Components/AddMeals/addmeal'
import Progress from './Components/Progress/progress'

const storageKey = 'macro-tracker-days'
const emptyBody = () => ({ weight: '', unit: 'kg', goal: 'maintain' })
const emptyDay = () => ({ targets: { protein: '', carbs: '', fats: '' }, meals: [], body: emptyBody() })
const getToday = () => new Date().toLocaleDateString('en-CA')

const findPreviousBody = (days, date) => {
  const previousDate = Object.keys(days)
    .filter((day) => day < date && days[day]?.body?.weight)
    .sort()
    .pop()
  return previousDate ? days[previousDate].body : emptyBody()
}

const loadDays = () => {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || {}
  } catch {
    return {}
  }
}

const App = () => {
  const [selectedDate, setSelectedDate] = useState(getToday)
  const [days, setDays] = useState(loadDays)
  const currentDay = days[selectedDate] || emptyDay()
  const previousBody = findPreviousBody(days, selectedDate)
  const dayBody = currentDay.body || {}
  const currentBody = {
    weight: dayBody.weight || previousBody.weight,
    unit: dayBody.unit || previousBody.unit,
    goal: dayBody.goal || previousBody.goal,
  }

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(days))
  }, [days])

  const updateCurrentDay = (field, update) => {
    setDays((current) => {
      const day = current[selectedDate] || emptyDay()
      const value = typeof update === 'function' ? update(day[field]) : update
      return { ...current, [selectedDate]: { ...day, [field]: value } }
    })
  }

  const setCurrentBody = (update) =>
    updateCurrentDay('body', typeof update === 'function' ? update(currentBody) : update)

  return (
    <div className="app-shell">
      <Navbar />
      <DayPicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      <MacrosCount targets={currentDay.targets} meals={currentDay.meals} />
      <MacrosTarget
        targets={currentDay.targets}
        setTargets={(update) => updateCurrentDay('targets', update)}
        body={currentBody}
        setBody={setCurrentBody}
      />
      <AddMeals meals={currentDay.meals} setMeals={(update) => updateCurrentDay('meals', update)} />
      <Progress targets={currentDay.targets} meals={currentDay.meals} />
    </div>
  )
}

export default App
