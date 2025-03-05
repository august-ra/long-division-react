import React, { useState } from "react"
import "./App.css"

import TblDivision from "./components/TblDivision"


export default function App() {
  const [dividend, setDividend] = useState<number>(1)
  const [divisor,  setDivisor]  = useState<number>(589)

  function changeNumber(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(event.target.name, "::", event.target.value)

    if (event.target.name === "dividend")
      setDividend(Number(event.target.value))
    else
      setDivisor(Number(event.target.value))
  }

  return (
    <>
      <div className="start">
        Введите целое делимое <input type="number" name="dividend" value={dividend} onInput={changeNumber} /> и целый делитель <input type="number" name="divisor" value={divisor} onInput={changeNumber} /> для показа деления в столбик.
      </div>

      <div className="empty" />

      <TblDivision dividend={dividend} divisor={divisor} />
    </>
  )
}
