import React from "react"


interface Props {
  divisor:  number
  quotient: string
  periodic: string
}

function TblResult({ divisor, quotient, periodic }: Props) {
  const result: string = (() => {
    if (periodic)
      return quotient.replace(periodic, `(<span class="periodic">${periodic}</span>)`)
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
