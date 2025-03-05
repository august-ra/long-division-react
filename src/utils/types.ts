
export interface IOperationData {
  operation: string
  pairs:     StepInfo[]
  results:   Record<number, number>
  quotient:  string
}


export interface NumberInfo {
  value: number
  zeros: number
  count: number
}

export interface StepInfo {
  first:    NumberInfo
  second:   NumberInfo | null
  quotient: number
  output:   number
}


export const emptyNumber: NumberInfo = {
  value: 0,
  zeros: 0,
  count: 0,
}

export const emptyLastStep: StepInfo = {
  first:    { ...emptyNumber },
  second:   null,
  quotient: 0,
  output:   0,
}
