import React from "react"

import type { StepInfo } from "../utils/types"


interface Props {
  pairs: StepInfo[]
}

export default function TblIndexes({ pairs }: Props) {
  return (
    <table>
      <tbody>
        <tr>
          <td className="head">№ п/п</td>
        </tr>
        {
          pairs.map((pair: StepInfo, index: number) => (
            pair.second
              ? (
                <React.Fragment key={`DI.${index}`}>
                  <tr>
                    <td>{index + 1}.</td>
                  </tr>
                  <tr>
                    <td className="second">&nbsp;</td>
                  </tr>
                </React.Fragment>
              )
              : (
                <React.Fragment key={`DI.${index}`}>
                  <tr>
                    <td>{index + 1}.</td>
                  </tr>
                </React.Fragment>
              )
          ))
        }
      </tbody>
    </table>
  )
}
