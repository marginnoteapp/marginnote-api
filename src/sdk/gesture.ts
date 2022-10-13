import { UISwipeGestureRecognizerDirection } from "src/api"

export function gestureHandlerController(
  handlerList: {
    view: UIView
    gesture: UIGestureRecognizer
  }[]
) {
  const add = () => {
    handlerList.forEach(v => {
      v.view.addGestureRecognizer(v.gesture)
    })
  }
  const remove = () => {
    handlerList.forEach(v => {
      v.view.removeGestureRecognizer(v.gesture)
    })
  }
  return { add, remove }
}

export const initGesture = {
  swipe(
    touchNumber: number,
    direction: UISwipeGestureRecognizerDirection,
    action: string
  ) {
    const swipe = new UISwipeGestureRecognizer(self, `on${action}:`)
    swipe.numberOfTouchesRequired = touchNumber
    swipe.direction = direction
    return swipe
  },
  tap(touchNumber: number, tapNumber: number, action: string) {
    const tap = new UITapGestureRecognizer(self, `on${action}:`)
    tap.numberOfTapsRequired = tapNumber
    tap.numberOfTouchesRequired = touchNumber
    return tap
  }
}
