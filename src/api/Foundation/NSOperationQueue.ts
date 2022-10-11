declare global {
  const NSOperationQueue: {
    new (): NSOperationQueue
    mainQueue(): NSOperationQueue
  }
}

export declare type NSOperationQueue = {}
