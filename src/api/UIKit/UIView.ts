import { CGFloat, CGPoint, CGRect, UIResponder, UIColor } from "."

export const enum UIViewAutoresizing {}
declare global {
  class UIView extends UIResponder {
    constructor(frame?: CGRect)
    bounds: CGRect
    frame: CGRect
    layer: CALayer
    hidden: boolean
    autoresizingMask: UIViewAutoresizing
    superview: UIView
    subviews: Array<UIView>
    center: CGPoint
    tag: number
    autoresizesSubviews: boolean
    backgroundColor: UIColor
    convertRectToView(rect: CGRect, view: UIView): CGRect
    convertPointToView(point: CGPoint, view: UIView): CGPoint
    addSubview(view: UIView): void
    addGestureRecognizer(gestureRecognizer: UIGestureRecognizer): void
    removeGestureRecognizer(gestureRecognizer: UIGestureRecognizer): void
  }
}

export declare class CALayer {
  masksToBounds: boolean
  frame: CGRect
  cornerRadius: CGFloat
  borderWidth: CGFloat
  borderColor: UIColor
  opacity: CGFloat
}
