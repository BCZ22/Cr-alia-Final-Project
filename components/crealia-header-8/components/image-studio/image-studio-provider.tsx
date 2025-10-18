"use client"

import { createContext, useContext, useReducer, type ReactNode } from "react"

type Tool = "text2image" | "enhancer" | null

interface UIState {
  activeTool: Tool
}

type Action = { type: "SET_TOOL"; payload: Tool }

const initialState: UIState = {
  activeTool: null,
}

function reducer(state: UIState, action: Action): UIState {
  switch (action.type) {
    case "SET_TOOL":
      return { ...state, activeTool: action.payload }
    default:
      return state
  }
}

interface ImageStudioContextValue {
  ui: UIState
  setActiveTool: (tool: Tool) => void
}

const ImageStudioContext = createContext<ImageStudioContextValue | null>(null)

export function ImageStudioProvider({ children }: { children: ReactNode }) {
  const [ui, dispatch] = useReducer(reducer, initialState)

  const setActiveTool = (tool: Tool) => {
    console.log("[v0] setActiveTool called with:", tool)
    dispatch({ type: "SET_TOOL", payload: tool })
  }

  return <ImageStudioContext.Provider value={{ ui, setActiveTool }}>{children}</ImageStudioContext.Provider>
}

export function useImageStudio() {
  const context = useContext(ImageStudioContext)
  if (!context) {
    throw new Error("useImageStudio must be used within ImageStudioProvider")
  }
  return context
}
