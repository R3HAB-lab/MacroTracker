import { useEffect, useState } from 'react'
import Navbar from './Components/Navbar/navbar'
import DayPicker from './Components/DayPicker/daypicker'
import MacrosCount from './Components/MacrosCount/macrocount'
import MacrosTarget from './Components/MacrosTarget/macrotarget'
import AddMeals from './Components/AddMeals/addmeal'
import Progress from './Components/Progress/progress'

const storageKey = 'macro-tracker-days'
const emptyDay = () => ({ targets: { protein: '', carbs: '', fats: '' }, meals: [] })
const getToday = () => new Date().toLocaleDateString('en-CA')

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

  return (
    <div>
      <Navbar />
      <DayPicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      <MacrosCount targets={currentDay.targets} meals={currentDay.meals} />
      <MacrosTarget targets={currentDay.targets} setTargets={(update) => updateCurrentDay('targets', update)} />
      <AddMeals meals={currentDay.meals} setMeals={(update) => updateCurrentDay('meals', update)} />
      <Progress targets={currentDay.targets} meals={currentDay.meals} />
    </div>
  )
}

export default App
