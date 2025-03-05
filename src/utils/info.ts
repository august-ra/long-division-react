import { emptyLastStep } from "./types"
import type { NumberInfo, StepInfo } from "./types"


export function fillStepInfo(info: StepInfo, first: number, zeros: number, second: number, quotient: number, periodic: boolean, output: number) {
  setNumberInfo(info.first, first, zeros)
  setNumberInfo(info.second!, second)
  info.quotient = quotient
  info.periodic = periodic
  info.output   = output
}

export function getLastStepInfo(first: number): StepInfo {
  const info: StepInfo = { ...emptyLastStep }
  setNumberInfo(info.first, first)

  return info
}

export function setNumberInfo(info: NumberInfo, value: number, zeros: number = 0) {
  info.value = value
  info.zeros = zeros
  info.count = String(value).length
}
