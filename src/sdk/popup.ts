import type { UIAlertView } from "../api"
import { UIAlertViewStyle } from "../api"
import { lang } from "./lang"
import { MN } from "./mn"
import { byteSlice } from "./utils"

export function popup<T>(
  {
    title = MN.currentAddon.title,
    message,
    type = UIAlertViewStyle.Default,
    buttons = [lang.sure],
    canCancel = true,
    multiLine = false
  }: {
    title?: string
    message: string
    buttons?: string[]
    type?: UIAlertViewStyle
    canCancel?: boolean
    multiLine?: boolean
  },
  f: ({ alert, buttonIndex }: { alert: UIAlertView; buttonIndex: number }) => T
) {
  return new Promise<T>(resolve =>
    canCancel
      ? UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          title,
          message,
          type,
          lang.cancel,
          multiLine
            ? buttons.map(k => byteSlice(k.replace(/\n/g, ""), 0, 40))
            : buttons,
          (alert: UIAlertView, buttonIndex: number) => {
            resolve(
              f({
                alert,
                buttonIndex: buttonIndex - 1
              })
            )
          }
        )
      : UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          title,
          message,
          type,
          multiLine
            ? byteSlice(buttons[0].replace(/\n/g, ""), 0, 40)
            : buttons[0],
          multiLine
            ? buttons.slice(1).map(k => byteSlice(k.replace(/\n/g, ""), 0, 40))
            : buttons.slice(1),
          (alert: UIAlertView, buttonIndex: number) => {
            resolve(
              f({
                alert,
                buttonIndex
              })
            )
          }
        )
  )
}

export async function confirm(title = MN.currentAddon.title, message = "") {
  const { option } = await popup(
    {
      title,
      message,
      buttons: [lang.sure],
      multiLine: false,
      canCancel: true
    },
    ({ buttonIndex }) => ({
      option: buttonIndex
    })
  )
  return option === 0 ? true : false
}

export async function select(
  parts: string[],
  title = MN.currentAddon.title,
  message = lang.make_your_choice,
  canCancel = false
) {
  const { option } = await popup(
    {
      title,
      message,
      buttons: parts,
      multiLine: true,
      canCancel
    },
    ({ buttonIndex }) => ({
      option: buttonIndex
    })
  )
  return parts[option]
}

export async function selectIndex(
  parts: string[],
  title = MN.currentAddon.title,
  message = lang.make_your_choice,
  canCancel = false
) {
  const { option } = await popup(
    {
      title,
      message,
      buttons: parts,
      multiLine: true,
      canCancel
    },
    ({ buttonIndex }) => ({
      option: buttonIndex
    })
  )
  return option
}
