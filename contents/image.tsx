import cssText from "data-text:~styles.css"
import type {
  PlasmoContentScript,
  PlasmoGetRootContainer,
  PlasmoRender,
} from "plasmo"
import { createRoot } from "react-dom/client"

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

export const IMAGE_CONTAINER_ID = "plasmo-image-container-root"

export const getRootContainer: PlasmoGetRootContainer = async () => {
  let rootContainer: HTMLDivElement
  await waitForElement(".image-prompt-overlay-container")

  const images = document.getElementsByClassName(
    "image-prompt-overlay-container",
  )
  for (let i = 0; i < images.length; i++) {
    const image = images[i]
    if (!image.querySelector(`#${IMAGE_CONTAINER_ID}`)) {
      const container = document.createElement("div", {})
      container.id = IMAGE_CONTAINER_ID
      container.style.position = "absolute"
      container.style.right = "20px"
      container.style.bottom = "20px"
      image.appendChild(container)

      rootContainer = container
    }
  }

  return rootContainer
}

export const config: PlasmoContentScript = {
  matches: ["https://labs.openai.com/"],
  css: ["../style-override.css"],
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const ImageOverlay = () => {
  return (
    <div
      className="h-[24px] w-[24px] rounded-full bg-red-500"
      // style={{
      //   height: 24,
      //   width: 24,
      //   borderRadius: "50%",
      //   backgroundColor: "red",
      // }}
    />
  )
}

export const render: PlasmoRender = async (
  createRootContainer, // This creates the default root container
  MountContainer, // This creates the default MountContainer
) => {
  const rootContainer = await createRootContainer() // creates all image root containers as mounting points for this app
  const containers = document.querySelectorAll(`#${IMAGE_CONTAINER_ID}`)
  for (let i = 0; i < containers.length; i++) {
    const container = containers[i]
    const root = createRoot(container)
    root.render(<ImageOverlay />)
  }
}

export default ImageOverlay
