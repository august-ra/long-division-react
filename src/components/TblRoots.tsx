import React, { useState } from "react"

import type { StepInfo } from "../utils/types"


interface Props {
  pairs: StepInfo[]
}

export default function TblRoots({ pairs }: Props) {
  const [activeRoot, setActiveRoot] = useState<number>(0)

  function toggleActiveRoot(value: number = activeRoot) {
    const element: HTMLElement = document.querySelector(":root")!
    element.style.setProperty(`--root-${activeRoot}`, "#ffffffdd")
    element.style.setProperty(`--root-zero-${activeRoot}`, "gray")

    if (activeRoot === value || value === 0) {
      setActiveRoot(0)
    } else {
      element.style.setProperty(`--root-${value}`, "yellow")
      element.style.setProperty(`--root-zero-${value}`, "darkkhaki")
      setActiveRoot(value)
    }
  }

  return (
    <table className="digital-roots">
      <tbody>
        <tr>
          <td></td>
          <td className="head" title="digital roots" onClick={() => toggleActiveRoot()}>&nbsp;dr&nbsp;</td>
        </tr>

        {
          pairs.map((pair: StepInfo, index: number) => {
            return (
              <React.Fragment key={index}>
                <tr onClick={() => toggleActiveRoot(pair.first.root)}>
                  <td>{pair.first.count}</td>
                  <td data-root={`${pair.first.root}`}>{pair.first.root}</td>
                </tr>

                {
                  pair.second
                    && (
                      <tr onClick={() => toggleActiveRoot(pair.second.root)}>
                        <td className="second">{pair.second.count}</td>
                        <td className="second" data-root={`${pair.second.root}`}>{pair.second.root}</td>
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
