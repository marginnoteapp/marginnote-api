import { JSExtensionLifeCycle } from "src/api"
import { MN } from "./mn"

export const dev = {
  log(obj: any, suffix = "normal", ...args: any[]) {
    if (self.useConsole)
      console.log(obj, `${MN.currentAddon.key}-${suffix}`, ...args)
    else JSB.log(`${MN.currentAddon.key}-${suffix} %@`, obj)
  },
  error(obj: any, suffix = "error", ...args: any[]) {
    if (self.useConsole)
      console.error(obj, `${MN.currentAddon.key}-${suffix}`, ...args)
    else
      JSB.log(
        `${MN.currentAddon.key}-${suffix} %@`,
        String(obj) === "[object Object]"
          ? JSON.stringify(obj, undefined, 2)
          : String(obj)
      )
  },
  /** Unrelated to the real meaning, used for stringify objects */
  assert(obj: any, suffix = "normal", ...args: any[]) {
    if (self.useConsole)
      console.log(obj, `${MN.currentAddon.key}-${suffix}`, ...args)
    else
      JSB.log(
        `${MN.currentAddon.key}-${suffix} %@`,
        JSON.stringify(obj, undefined, 2)
      )
  }
}

export function defineLifecycleHandler(events: {
  instanceMethods?: Partial<JSExtensionLifeCycle.InstanceMethods>
  classMethods?: Partial<JSExtensionLifeCycle.ClassMethods>
}) {
  return events
}

export function eventHandlerController(
  handlerList: ({ event: string; handler?: string } | string)[]
) {
  const add = () => {
    handlerList.forEach(v => {
      v = typeof v == "string" ? { event: v } : v
      let handler = v.handler ?? `on${v.event}`
      NSNotificationCenter.defaultCenter().addObserverSelectorName(
        self,
        `${handler}:`,
        v.event
      )
    })
  }
  const remove = () => {
    handlerList.forEach(v => {
      NSNotificationCenter.defaultCenter().removeObserverName(
        self,
        typeof v == "string" ? v : v.event
      )
    })
  }
  return { add, remove }
}

export function defineEventHandlers<K extends string>(
  h: Record<
    K extends `on${string}` ? K : `on${K}`,
    (sener: { userInfo: Record<string, any> }) => void
  >
) {
  return h
}

export function defineGestureHandlers<K extends string>(
  h: Record<K, (sener: UIGestureRecognizer) => void>
) {
  return h
}

export function i18n<M, N>(lang: { zh: M; en: N extends M ? M : M }) {
  return MN.isZH ? lang.zh : lang.en
}
