import cssText from "data-text:~styles.css"
import type {
  PlasmoContentScript,
  PlasmoGetInlineAnchor,
  PlasmoGetShadowHostId,
  PlasmoMountShadowHost,
} from "plasmo"
import React, { useState } from "react"

import PrintModal from "~components/PrintModal"

export const ROOT_CONTAINER_ID = "plasmo-edit-print-container-root"

export const getShadowHostId: PlasmoGetShadowHostId = () => ROOT_CONTAINER_ID

export const getInlineAnchor: PlasmoGetInlineAnchor = () =>
  document.querySelector(".edit-page-buttons")

export const mountShadowHost: PlasmoMountShadowHost = ({
  shadowHost,
  inlineAnchor,
  observer,
}) => {
  const parent = inlineAnchor.lastChild as HTMLDivElement
  const sibling = parent.querySelector(".btn-history")
  parent.insertBefore(shadowHost, sibling)
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

const EditPrint = () => {
  let imageUrl = ""
  const imageParentNode = document.getElementsByClassName("generated-image")[0]
  if (imageParentNode) {
    const imageNode = imageParentNode.querySelector("img") as HTMLImageElement
    if (imageNode) {
      imageUrl = imageNode.src
    }
  }

  const [showModal, setShowModal] = useState(false)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setShowModal(true)
  }

  return (
    <>
      <PrintModal
        visible={showModal}
        imageUrl={imageUrl}
        onClose={() => setShowModal(false)}
        shadowHostId={ROOT_CONTAINER_ID}
      />
      <button
        className="ml-2 text-sm leading-[15px] py-[10px] px-[15px] rounded-md inline-flex font-bold justify-center m-0 text-black hover:opacity-60"
        style={{
          background:
            "linear-gradient(52.73deg, #00FFA9 17.5%, #00F9FB 80.05%)",
        }}
        onClick={handleClick}>
        Print
      </button>
    </>
  )
}

export default EditPrint
