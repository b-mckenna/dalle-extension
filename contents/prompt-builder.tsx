import backgroundPng from "data-base64:~assets/gradient.png"
import backgroundImg from "data-base64:~assets/gradient.svg"
import logo from "data-base64:~assets/logo_continual.svg"
import cssText from "data-text:~styles.css"
import type { PlasmoContentScript, PlasmoGetRootContainer } from "plasmo"
import { ChangeEventHandler, useState } from "react"

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
  const siblingNode = document.getElementsByClassName("create-page")[0]
  const parentNode = siblingNode.parentNode
  parentNode.insertBefore(container, siblingNode)

  const historyNode = document.getElementsByClassName("create-page-header")
  if (historyNode.length > 0) {
    const node = historyNode[0]
    node.className = `hidden`
  }

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

const howItWorksSections: { title: string; description: string }[] = [
  {
    title: "Create a prompt",
    description:
      "Type in your prompt or use our prompt builder. Then, click Generate.",
  },
  {
    title: "Iterate on images",
    description: "Create variations of or edit your favorite images.",
  },
  {
    title: "Finalize and print",
    description:
      "Click the Print button to send yourself a digital copy and print your sticker. You can find your sticker at the nearby printer.",
  },
]

const PromptBuilder = () => {
  const [subject, setSubject] = useState("")
  const [activity, setActivity] = useState("")
  const [descriptor, setDescriptor] = useState("")

  const buildPromptSections: {
    title: string
    tags: string[]
    value: string
    onChange: ChangeEventHandler<HTMLInputElement>
  }[] = [
    {
      title: "Subject",
      tags: ["characters", "animals", "places", "occupations", "objects"],
      value: subject,
      onChange: (e) => setSubject(e.target.value),
    },
    {
      title: "Activity",
      tags: ["sports", "hobbies", "everyday", "labor"],
      value: activity,
      onChange: (e) => setActivity(e.target.value),
    },
    {
      title: "Descriptor",
      tags: [
        "artistic style",
        "environments",
        "physical characteristics",
        "artists",
        "feelings",
        "art medium",
      ],
      value: descriptor,
      onChange: (e) => setDescriptor(e.target.value),
    },
  ]

  return (
    <div
      className="w-[calc(100%+40px)] border-gray-50 rounded-md flex justify-start h-[500px] bg-no-repeat relative mx-[-20px] mt-[-20px] mb-[20px]"
      style={{
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: "100% auto",
        zIndex: 50,
      }}>
      <div
        className="absolute top-0 left-0 h-full w-full"
        style={{
          background:
            "linear-gradient(52.73deg, #00FFA9 17.5%, #00F9FB 80.05%)",
          opacity: 0.2,
          boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.05)",
        }}
      />

      <div className="flex-col py-8 w-full z-50">
        <div className="flex flex-col w-[1240px] mx-auto gap-8">
          <div className="flex w-full justify-between items-start">
            <div>
              <h3 className="mt-0 font-bold">
                Coalesce Sticker Bot — Get Your Custom DALL&middot;E 2 Sticker
              </h3>
              <p className="text-secondary">
                DALL&middot;E is a product of OpenAI and is not affiliated with
                Continual.
              </p>
            </div>
            <img src={logo} className="opacity-100 z-50" />
          </div>

          <section>
            <h4>How It Works</h4>
            <div className="flex justify-between gap-4">
              {howItWorksSections.map((section, idx) => (
                <div className="flex justify-start gap-2 w-1/3">
                  <div className="p-4 rounded-full bg-white h-[24px] w-[24px] inline-flex items-center justify-center text-sm font-bold text-black">
                    {idx + 1}
                  </div>
                  <div key={section.title} className="flex flex-col">
                    <h5 className="font-semibold mb-2">{section.title}</h5>
                    <p className="text-secondary">{section.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h4>Build Your Prompt</h4>
            <div className="flex gap-4 justify-between">
              {buildPromptSections.map((section, idx) => (
                <div
                  key={section.title}
                  className="inline-flex flex-col w-1/3 gap-2">
                  <h5 className="font-semibold mb-2">{section.title}</h5>
                  <input
                    className="z-50 h-[40px] border border-[#ECECF1] w-full p-[16px]"
                    value={section.value}
                    onChange={section.onChange}
                  />
                  <div className="flex flex-wrap gap-2">
                    {section.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-secondary text-xs bg-white rounded-[99px] w-fit px-[8px] py-[4px]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default PromptBuilder
