import cssText from "data-text:~styles.css"
import type { PlasmoContentScript, PlasmoGetRootContainer } from "plasmo"

const waitForElement = (selector: string) => {
  return new Promise((resolve) => {
    const observer = new MutationObserver((mutations) => {
      const element = document.querySelector(selector)
      if (element) {
        observer.disconnect()
        resolve(element)
      }
    })
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    })
  })
}

export const getRootContainer: PlasmoGetRootContainer = async () => {
  const container = document.createElement("div")
  container.id = "plasmo-root-container"

  await waitForElement(".create-page")
  const parentNode = document.getElementsByClassName("create-page")[0]
  const siblingNode = document.getElementsByClassName(
    "image-prompt-form-wrapper",
  )[0]
  parentNode.insertBefore(container, siblingNode)

  return container
}

export const config: PlasmoContentScript = {
  matches: ["https://labs.openai.com/"],
  css: ["../styles.css", "../style-override.css"],
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const promptOptions = [
  ["Pick a Subject", "Not implemented."],
  ["Pick a Style", "Not implemented."],
  ["Pick a Setting", "Not implemented."],
]

const PlasmoOverlay = () => {
  return (
    <div className="w-full border-gray-50 rounded-md flex justify-start">
      <div className="flex-col">
        <h4 className="text-primary text-black font-bold mb-0">
          Continual <span className="italic">x</span> Coalesce &middot;{" "}
          <span className="">Prompt Builder</span>
        </h4>
        <div className="flex justify-start gap-4 py-4">
          {promptOptions.map((option) => (
            <div
              key={option[0]}
              className="border-black border rounded-md bg-white p-2">
              <p className="font-semibold">{option[0]}</p>
              <span className="text-sm text-secondary">{option[1]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PlasmoOverlay
