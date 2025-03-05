import { useState } from "react"

import type { IOperationData } from "../utils/types"


interface Props {
  dividend: number
  divisor:  number
}

export default function TblDivision({ dividend, divisor }: Props) {
  const [data] = useState<IOperationData>({
    operation: "0/0",
    pairs:     [],
    results:   {},
    quotient:  "",
  })

  return (
    <div>
      test
    </div>
  )
}
