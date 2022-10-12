import cssText from "data-text:~styles.css"
import type {
  PlasmoContentScript,
  PlasmoGetInlineAnchor,
  PlasmoGetRootContainer,
  PlasmoMountShadowHost,
} from "plasmo"
import { useState } from "react"

export const getInlineAnchor: PlasmoGetInlineAnchor = () =>
  document.querySelector(".surprise-button")

export const mountShadowHost: PlasmoMountShadowHost = ({
  shadowHost,
  inlineAnchor,
  observer,
}) => {
  if (inlineAnchor) {
    const parentNode = inlineAnchor.parentNode

    if (parentNode.childElementCount === 1) {
      parentNode.appendChild(shadowHost)
    } else {
      parentNode.insertBefore(shadowHost, parentNode.children[1])
    }
  }
}

export const config: PlasmoContentScript = {
  matches: ["https://labs.openai.com/*"],
  css: ["../styles.css", "../style-override.css"],
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const Loading = () => (
  <svg
    className="animate-spin -ml-1 mr-1 h-3 w-3 text-gray-600"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
)

const Spice = () => {
  const [loading, setLoading] = useState(false)
  const handleSpice = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    setLoading(true)

    let inputNode: HTMLInputElement
    const nodes = document.getElementsByClassName("image-prompt-input")
    if (nodes.length > 0) {
      inputNode = nodes[0] as HTMLInputElement
    } else {
      return
    }

    const prompt = inputNode.value

    try {
      const res = await fetch("http://127.0.0.1:8000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: prompt }),
      })

      const data = await res.json()

      console.log({ data })

      if (data && data?.completion) {
        inputNode.select()
        document.execCommand("insertText", false, data.completion)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  return (
    <button
      tabIndex={1}
      className="text-black bg-[#ececf1] leading-[13px] text-xs rounded-[6px] font-bold inline-flex items-center justify-center cursor-pointer hover:opacity-60"
      type="button"
      style={{
        marginLeft: 7,
        marginRight: 7,
        transition: "opacity .3s,box-shadow .3s,background-color .3s,color .3s",
        padding: "7px 10px 6px",
      }}
      onClick={handleSpice}>
      {loading && <Loading />} {loading ? "Spicing" : "Spice"} it up 🌶️
    </button>
  )
}

export default Spice
