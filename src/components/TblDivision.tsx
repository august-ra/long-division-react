import { useEffect, useState } from "react"

import { fillStepInfo, getLastStepInfo } from "../utils/info"
import { emptyNumber } from "../utils/types"
import type { IOperationData, StepInfo } from "../utils/types"


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

  const [mark, update] = useState<number>(0)

  useEffect(() => {
    const op = `${dividend}/${divisor}`

    if (data.operation === op)
      return

    data.operation = op
    data.pairs     = []
    data.results   = {}
    data.quotient  = ""

    if (dividend === 0 || divisor === 0)
      return

    let digits: number[] = String(dividend).split("").map(Number)

    let step:   number = 0
    let first:  number = digits.shift()!
    let second: number = 0
    let result: string = ""
    let real:  boolean = false

    const numbers: number[] = Array.from({ length: 9 }).map(() => {
      second += divisor
      return second
    })

    while (step < 1000) {
      const stepInfo: StepInfo = {
        first:    { ...emptyNumber },
        second:   { ...emptyNumber },
        quotient: 1,
        output:   0,
      }

      let zeros: number = -1

      second = numbers[0]

      if (!digits.length)
        data.results[first] = step

      while (first < second) {
        if (!digits.length) {
          data.results[first] = step

          first *= 10
          ++zeros

          data.results[first] = step
        } else {
          first = first * 10 + digits.shift()!
        }
      }

      if (zeros >= 0) {
        if (step === 0)
          result = "0."
        else if (!real)
          result += "."

        real = true

        if (zeros > 0)
          result += "0".repeat(zeros)
      }

      let quotient: number = 1

      while (first >= numbers[quotient]) {
        second = numbers[quotient]

        ++quotient
      }

      result += quotient

      const output: number = first - second

      fillStepInfo(stepInfo, first, zeros + 1, second, quotient, false, output)

      data.pairs.push(stepInfo)

      first = output

      if (digits.length) {

      } else if (first === 0) {
        const stepInfo: StepInfo = getLastStepInfo(first)
        data.pairs.push(stepInfo)

        break
      } else if (data.results[first] >= 0) {
        step = data.results[first]

        const stepInfo: StepInfo = getLastStepInfo(first)
        data.pairs.push(stepInfo)

        break
      }

      ++step
    }

    data.quotient = result

    update((prev) => ++prev)
  }, [dividend, divisor])

  if (data.quotient === "")
    return null

  return (
    <div>
      test
    </div>
  )
}
