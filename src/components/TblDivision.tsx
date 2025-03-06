import React, { useEffect, useState } from "react"

import TblResult from "./TblResult"
import TblRoots from "./TblRoots"

import { calcDigitalRoot, fillStepInfo, getLastStepInfo } from "../utils/info"
import { emptyNumber } from "../utils/types"
import type { IOperationData, NumberInfo, StepInfo } from "../utils/types"


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
    periodic:  "",
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
    data.periodic  = ""

    if (dividend === 0) {
      const stepInfo: StepInfo = getLastStepInfo(0)
      data.pairs.push(stepInfo)
      data.quotient = "0"
      data.periodic = ""

      update((prev) => ++prev)

      return
    } else if (divisor === 0) {
      const stepInfo: StepInfo = getLastStepInfo(dividend)
      data.pairs.push(stepInfo)
      data.quotient = "undefined"
      data.periodic = ""

      update((prev) => ++prev)

      return
    }

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
        periodic: false,
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

      if (step === 0)
        stepInfo.first.root = calcDigitalRoot(dividend)

      data.pairs.push(stepInfo)

      first = output

      if (first === 0 && digits.length) {
        let isZeros: boolean = true

        for (const digit of digits)
          if (digit) {
            isZeros = false

            break
          }

        if (isZeros) {
          result += "0".repeat(digits.length)

          const stepInfo: StepInfo = getLastStepInfo(first)
          data.pairs.push(stepInfo)
          data.periodic = ""

          break
        }
      } else if (digits.length) {

      } else if (first === 0) {
        const stepInfo: StepInfo = getLastStepInfo(first)
        data.pairs.push(stepInfo)
        data.periodic = ""

        break
      } else if (data.results[first] >= 0) {
        step = data.results[first]

        data.pairs[step].periodic = true
        data.periodic = data.pairs.reduce((acc: string, item: StepInfo, index: number) => {
          if (index < step)
            return ""

          let zeros: number

          if (index === step)
            zeros = item.first.count - String(first).length - 1
          else
            zeros = item.first.zeros - 1

          if (zeros > 0)
            return acc + "0".repeat(zeros) + item.quotient
          else
            return acc + item.quotient
        }, "")

        const stepInfo: StepInfo = getLastStepInfo(first)
        data.pairs.push(stepInfo)

        break
      }

      ++step
    }

    if (step >= 1000) {
      const stepInfo: StepInfo = getLastStepInfo(first)
      data.pairs.push(stepInfo)
      data.periodic = ""
    }

    data.quotient = result

    update((prev) => ++prev)
  }, [dividend, divisor])

  if (data.quotient === "")
    return null

  let previous: NumberInfo | null = null
  let offset:   number            = 0

  const str0: string = String(dividend)

  return (
    <table className="division">
      <tbody>
        <tr>
          <td>
            <TblRoots pairs={data.pairs} />
          </td>

          <td>
            <table>
              <tbody>
                <tr>
                  <td>&nbsp;</td>
                  {
                    Array.from({ length: Math.max(str0.length, data.pairs[0].first.count) + 1 }).map((_, index: number) => (
                      <td key={`DH.${index}`} />
                    ))
                  }
                  <td rowSpan={2}>
                    <TblResult divisor={divisor} quotient={data.quotient} periodic={data.periodic} />
                  </td>
                </tr>

                {
                  data.pairs.map((pair: StepInfo, level: number) => {
                    const first:  NumberInfo        = pair.first
                    const second: NumberInfo | null = pair.second

                    const zeros: string = "0".repeat(first.zeros)
                    const str1:  string = String(first.value)
                    const str2:  string = second ? first.value === second.value ? str1 : String(second.value) : ""

                    const offset2: number = second ? first.count - second.count : 0

                    previous = first

                    const render1 = (
                      <tr key={`DP.${level}`}>
                        {
                          Array.from({ length: offset }).map((_, index: number) => (
                            <td key={`DFS.${index}`} />
                          ))
                        }

                        {
                          second
                            ? (
                              <td className="minus" rowSpan={2}>&minus;</td>
                            )
                            : (
                              <td />
                            )
                        }

                        {
                          (level === 0 && first.zeros === 0 ? str0 : str1.slice(0, -first.zeros || 100)).split("")
                            .map((item: string, index: number, array: string[]) => (
                              level === 0 && index === array.length - 1 && zeros
                                ? (
                                  <td key={`DFD.${index}`} className="first" data-root={`${first.root}`}>
                                    {item}
                                    <div className="dot">.</div>
                                  </td>
                                )
                                : (
                                  <td key={`DFD.${index}`} className="first" data-root={`${first.root}`}>{item}</td>
                                )
                            ))
                        }
                        {
                          zeros.split("").map((_, index: number) => (
                            <td key={`DFZ.${index}`} className="zero" data-root={`${first.root}`}>0</td>
                          ))
                        }
                        {
                          level === 0
                            ? (
                              <td>&nbsp;</td>
                            )
                            : null
                        }
                      </tr>
                    )

                    const render2 = str2
                      ? (
                        <tr key={`DS.${level}`} className="second">
                          {
                            Array.from({ length: offset }).map((_, index: number) => (
                              <td key={`DSS.${index}`} />
                            ))
                          }

                          {
                            Array.from({ length: offset2 }).map((_, index: number) => (
                              <td key={`DSZ.${index}`} className="second" />
                            ))
                          }

                          {
                            str2.split("").map((item: string, index:number) => (
                              <td key={`DSD.${index}`} className="second" data-root={`${second!.root}`}>{item}</td>
                            ))
                          }
                        </tr>
                      )
                      : null

                    const localOffset = previous ? previous.count - String(pair.output).length : 0
                    offset += localOffset

                    return (
                      <React.Fragment key={`DP.${level}`}>
                        { render1 }
                        { render2 }
                      </React.Fragment>
                    )
                  })
                }
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  )
}
