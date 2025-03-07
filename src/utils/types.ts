
export interface IOperationData {
  operation: string
  pairs:     StepInfo[]
  results:   Record<number, number>
  quotient:  string
  periodic:  string
}


export interface NumberInfo {
  value: number
  zeros: number
  root:  number
  count: number
}

export interface StepInfo {
  first:    NumberInfo
  second:   NumberInfo | null
  quotient: number
  periodic: boolean
  output:   number
}


export const emptyNumber: NumberInfo = {
  value: 0,
  zeros: 0,
  root:  0,
  count: 0,
}

export const emptyUsualStep: StepInfo = {
  first:    { ...emptyNumber },
  second:   { ...emptyNumber },
  quotient: 0,
  periodic: false,
  output:   0,
}

export const emptyLastStep: StepInfo = {
  first:    { ...emptyNumber },
  second:   null,
  quotient: 0,
  periodic: false,
  output:   0,
}


export interface ColorSettings {
  active:   string
  inactive: string
}
