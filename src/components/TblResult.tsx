import React from "react"

import { calcDigitalRoot, calcSumOfDigits, calcUnits } from "../utils/info"


interface Props {
  divisor:  number
  quotient: string
  periodic: string
}

function TblResult({ divisor, quotient, periodic }: Props) {
  const result: string = (() => {
    const length: number = periodic.length
    const sum:    number = calcSumOfDigits(periodic)
    const root:   number = calcDigitalRoot(sum)
    const title:  string = `${length} ${calcUnits(length, "цифр", "цифра", "цифры")} => ∑${sum} => dr ${root}`

    if (periodic)
      return quotient.replace(periodic, `(<span class="periodic" title="${title}" data-root="${root}">${periodic}</span>)`)
    else
      return quotient
  })()

  return (
    <table className="result">
      <tbody>
      <tr>
        <td>{divisor}</td>
      </tr>
      <tr>
        <td className="result" dangerouslySetInnerHTML={{ __html: result }} />
      </tr>
      </tbody>
    </table>
  )
}

export default React.memo(TblResult)
