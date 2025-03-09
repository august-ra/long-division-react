import React, { useMemo, useState } from "react"

import type { ColorSettings, StepInfo } from "../utils/types"


interface Props {
  pairs: StepInfo[]
}

export default function TblRoots({ pairs }: Props) {
  const theme = useMemo<ColorSettings>(() => {
    const element: HTMLElement = document.querySelector(".header")!
    const text = getComputedStyle(element).backgroundColor.toLowerCase()

    if (text === "rgb(255, 255, 255)" || text === "#ffffff") // light
      return {
        active:   "goldenrod",
        inactive: "#242424",
      }
    else
      return {
        active:   "yellow",
        inactive: "#ffffffdd",
      }
  }, [])

  const [activeRoot, setActiveRoot] = useState<number>(0)

  function toggleActiveRoot(value: number = activeRoot) {
    const element: HTMLElement = document.querySelector(":root")!
    element.style.setProperty(`--root-${activeRoot}`, theme.inactive)

    if (activeRoot === value || value === 0) {
      setActiveRoot(0)
    } else {
      element.style.setProperty(`--root-${value}`, theme.active)

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
                  <td className="cnt">{pair.first.count}</td>
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
