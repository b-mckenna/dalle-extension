import cssText from "data-text:~styles.css"
import type {
  PlasmoContentScript,
  PlasmoGetInlineAnchor,
  PlasmoGetShadowHostId,
  PlasmoMountShadowHost,
} from "plasmo"
import React, { useEffect, useState } from "react"

import PrintModal from "~components/PrintModal"

export const ROOT_CONTAINER_ID = "plasmo-edit-image-container-root"

export const getShadowHostId: PlasmoGetShadowHostId = () => ROOT_CONTAINER_ID

export const config: PlasmoContentScript = {
  matches: ["https://labs.openai.com/*"],
  css: ["../styles.css", "../style-override.css"],
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export const getInlineAnchor: PlasmoGetInlineAnchor = () =>
  document.querySelector(".edit-page-image-buttons")

export const mountShadowHost: PlasmoMountShadowHost = async ({
  shadowHost,
  inlineAnchor,
  observer,
}) => {
  if (inlineAnchor) {
    const siblingNode = inlineAnchor.childNodes[0]
    inlineAnchor.insertBefore(shadowHost, siblingNode)
  }
}

interface ImageOverlayProps {
  imageUrl?: string
}

const EditPagePrintButton: React.FC<ImageOverlayProps> = ({ imageUrl }) => {
  const [showModal, setShowModal] = useState(false)

  if (!imageUrl) {
    const img = document.querySelector(
      "div.generated-image img",
    ) as HTMLImageElement
    if (img) {
      imageUrl = img.src
    }
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
        tabIndex={0}
        className="text-black bg-[#ececf1] h-[35px] w-[35px] rounded-[6px] font-bold inline-flex items-center justify-center cursor-pointer hover:opacity-60"
        type="button"
        style={{
          marginRight: 8,
          transition:
            "opacity .3s,box-shadow .3s,background-color .3s,color .3s",
          background:
            "linear-gradient(52.73deg, #00FFA9 17.5%, #00F9FB 80.05%)",
        }}
        onClick={() => setShowModal(true)}>
        <span className="btn-label-wrap">
          <span className="btn-label-inner">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_45_767)">
                <path
                  d="M3.5 5.25002V1.16669H10.5V5.25002"
                  stroke="black"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3.49984 10.5H2.33317C2.02375 10.5 1.72701 10.3771 1.50821 10.1583C1.28942 9.9395 1.1665 9.64275 1.1665 9.33333V6.41667C1.1665 6.10725 1.28942 5.8105 1.50821 5.59171C1.72701 5.37292 2.02375 5.25 2.33317 5.25H11.6665C11.9759 5.25 12.2727 5.37292 12.4915 5.59171C12.7103 5.8105 12.8332 6.10725 12.8332 6.41667V9.33333C12.8332 9.64275 12.7103 9.9395 12.4915 10.1583C12.2727 10.3771 11.9759 10.5 11.6665 10.5H10.4998"
                  stroke="black"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.5 8.16669H3.5V12.8334H10.5V8.16669Z"
                  stroke="black"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_45_767">
                  <rect width="14" height="14" fill="black" />
                </clipPath>
              </defs>
            </svg>
          </span>
        </span>
      </button>
    </>
  )
}

export default EditPagePrintButton
