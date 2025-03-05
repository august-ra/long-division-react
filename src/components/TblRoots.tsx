import React from "react"

import type { StepInfo } from "../utils/types"


interface Props {
  pairs: StepInfo[]
}

export default function TblRoots({ pairs }: Props) {
  return (
    <table className="digital-roots">
      <tbody>
        <tr>
          <td></td>
          <td title="digital roots">&nbsp;dr&nbsp;</td>
        </tr>

        {
          pairs.map((pair: StepInfo, index: number) => {
            return (
              <React.Fragment key={index}>
                <tr>
                  <td>{pair.first.count}</td>
                  <td>{pair.first.root}</td>
                </tr>

                {
                  pair.second
                    && (
                      <tr>
                        <td className="second">{pair.second.count}</td>
                        <td className="second">{pair.second.root}</td>
                      </tr>
                    )
                }
              </React.Fragment>
            )
          })
        }
      </tbody>
    </table>
  )
}
