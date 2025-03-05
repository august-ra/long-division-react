import React from "react"


interface Props {
  divisor:  number
  quotient: string
}

function TblResult({ divisor, quotient }: Props) {
  return (
    <table className="result">
      <tbody>
      <tr>
        <td>{divisor}</td>
      </tr>
      <tr>
        <td className="result">{quotient}</td>
      </tr>
      </tbody>
    </table>
  )
}

export default React.memo(TblResult)
