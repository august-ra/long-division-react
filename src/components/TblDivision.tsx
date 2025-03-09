import React, { useCallback, useEffect, useState } from "react"

import TblIndexes from "./TblIndexes"
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
    cellWidth: "",
  })

  const [_, update] = useState<number>(0)

  useEffect(() => {
    if (data.cellWidth)
      return

    const element: Element | null = document.querySelector("td.cnt")

    if (element)
      data.cellWidth = getComputedStyle(element).width
  })

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

  const fillVars = useCallback(function () {
    const element: HTMLElement = document.querySelector(":root")!

    if (data.cellWidth)
      element.style.setProperty("--width", data.cellWidth)

    if (data.pairs.length) {
      const first = data.pairs[0].first
      element.style.setProperty("--count", `${first.count - first.zeros}`)
    }
  }, [data.cellWidth, data.pairs])

  fillVars()

  if (data.quotient === "")
    return null

  let offset: number = 0
  let width: number = data.pairs.reduce((acc: number, pair: StepInfo) => {
    const localOffset: number = pair.output === 0 ? pair.first.count : pair.first.count - String(pair.output).length
    acc += localOffset

    return acc
  }, 0)
  const str0: string = String(dividend)

  return (
    <table className="main">
      <tbody>
        <tr>
          <td>
            <TblIndexes pairs={data.pairs} />
          </td>

          <td>
            <TblRoots pairs={data.pairs} />
          </td>

          <td>
            <table>
              <tbody>
                <tr>
                  <td className="cell">&nbsp;</td>
                  {
                    Array.from({ length: Math.max(str0.length, data.pairs[0].first.count) + 1 }).map((_, index: number) => (
                      <td key={`DH.${index}`} className="cell">&nbsp;</td>
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
                    const str1:  string = level === 0 && first.zeros === 0 ? str0 : String(first.value).slice(0, -first.zeros || 100)
                    const str2:  string = second ? String(second.value) : ""

                    if (!first.value && !second)
                      --offset

                    const offset2: number = second ? first.count - second.count : 0

                    function getSecondClass(index: number) {
                      if (index < offset)
                        return "bordered cell"
                      else if (index >= offset && index < offset + offset2 + str2.length)
                        return "bordered second cell"
                      else
                        return "cell"
                    }

                    const render1 = (
                      <tr key={`DF.${level}`}>
                        {
                          Array.from({ length: width + 1 }).map((_, index: number) => (
                            index === offset + 1
                              ? (() => {
                                if (level === 0 && zeros)
                                  return (
                                    <td className="number dotted cell">
                                      {str1}<div className="dot">.</div><span className="zero">{zeros}</span>
                                    </td>
                                  )
                                else if (zeros)
                                  return (
                                    <td className="number cell">
                                      {str1}<span className="zero">{zeros}</span>
                                    </td>
                                  )
                                else
                                  return (
                                    <td className="number cell">
                                      {str1}
                                    </td>
                                  )
                              })()
                            : index === offset && second
                              ? (
                                <td key={`DFC.${index}`} rowSpan={2} className="minus cell"><span>&minus;</span></td>
                              )
                              : (
                                <td key={`DFC.${index}`} className="cell">&nbsp;</td>
                              )
                          ))
                        }
                      </tr>
                    )

                    const render2 = str2
                      ? (
                        <tr key={`DS.${level}`}>
                          {
                            Array.from({ length: width }).map((_, index: number) => (
                              index === offset + offset2
                                ? (
                                  <td key={`DSC.${index}`} className={`number ${getSecondClass(index)}`}>{str2}</td>
                                )
                                : (
                                  <td key={`DSC.${index}`} className={getSecondClass(index)}>&nbsp;</td>
                                )
                            ))
                          }
                        </tr>
                      )
                      : null

                    const localOffset: number = pair.output === 0 ? first.count : first.count - String(pair.output).length
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
