import type { AnimationProps } from "motion/react"

export const spotlightAnimation: AnimationProps["animate"] = {
  x: [0, 3, 2, 4, 8],
  y: [0, -2, 3, 3, 2],
  scale: [1, 1.1, 1, 1.02, 1],
  opacity: 0.7,
  transition: {
    opacity: {
      delay: 0.5,
      duration: 1.2,
      ease: "easeIn"
    },
    duration: 6,
    repeat: Number.POSITIVE_INFINITY,
    repeatType: "reverse" as const,
    ease: "easeInOut"
  }
}
