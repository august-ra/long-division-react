import { emptyLastStep } from "./types"
import type { NumberInfo, StepInfo } from "./types"


export function fillStepInfo(info: StepInfo, first: number, zeros: number, second: number, quotient: number, periodic: boolean, output: number) {
  setNumberInfo(info.first, first, zeros)
  setNumberInfo(info.second!, second)
  info.quotient = quotient
  info.periodic = periodic
  info.output   = output
  info.offset1  = 0
  info.offset2  = 0
}

export function getLastStepInfo(first: number): StepInfo {
  const info: StepInfo = { ...emptyLastStep }
  setNumberInfo(info.first, first)

  return info
}

export function setNumberInfo(info: NumberInfo, value: number, zeros: number = 0) {
  info.value = value
  info.zeros = zeros
  info.root  = calcDigitalRoot(value)
  info.count = String(value).length
  info.text  = String(value)
}


export function calcUnits(value: number, unit_0: string, unit_1: string, unit_2: string): string {
  let reminder: number = value % 100

  if (reminder >= 11 && reminder <= 19)
    return unit_0

  reminder = reminder % 10

  if (reminder === 1)
    return unit_1
  else if (reminder >= 2 && reminder <= 4)
    return unit_2
  else
    return unit_0
}


export function calcSumOfDigits(digits: string): number {
  return digits.split("").reduce((acc: number, digit: string) => acc + Number(digit), 0)
}

export function calcDigitalRoot(value: number): number {
  return value % 9 || 9
}
