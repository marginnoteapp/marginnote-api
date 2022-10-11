export const enum UIAlertViewStyle {
  // A standard alert.
  Default,
  // Allows the user to enter text, but the text field is obscured.
  SecureTextInput,
  // Allows the user to enter text.
  PlainTextInput,
  // Allows the user to enter a login id and a password.
  LoginAndPasswordInput
}

declare global {
  const UIAlertView: {
    showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      title: string,
      message: string,
      style: UIAlertViewStyle,
      cancelButtonTitle: string,
      otherButtonTitles: Array<string>,
      tapBlock: (alert: UIAlertView, buttonIndex: number) => any
    ): void
    makeWithTitleMessageDelegateCancelButtonTitleOtherButtonTitles(
      title: string,
      message: string,
      delegate: any,
      cancelButtonTitle: string,
      otherButtonTitles: Array<string>
    ): void
  }
}

export declare type UIAlertView = {
  textFieldAtIndex(textFieldIndex: number): UITextField
}
