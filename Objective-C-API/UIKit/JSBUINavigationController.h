#import <Foundation/Foundation.h>
#import <CoreGraphics/CoreGraphics.h>
#import <UIKit/UIKit.h>
@import JavaScriptCore;

@protocol JSBUIViewController;

@protocol JSBUINavigationController <JSExport, JSBUIViewController>

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"

@property (nonatomic, readonly, retain) UIViewController *visibleViewController;
@property (nonatomic, getter = isNavigationBarHidden) BOOL navigationBarHidden;
@property (nonatomic, getter = isToolbarHidden) BOOL toolbarHidden;
@property (nonatomic, readonly) UIGestureRecognizer *interactivePopGestureRecognizer;
@property (nonatomic, assign) id delegate;
@property (nonatomic, readonly) UIToolbar *toolbar;
@property (nonatomic, readonly, retain) UIViewController *topViewController;
@property (nonatomic, copy) NSArray *viewControllers;
@property (nonatomic, readonly) UINavigationBar *navigationBar;

- (id)initWithRootViewController:(UIViewController *)rootViewController;
- (void)pushViewController:(UIViewController *)viewController animated:(BOOL)animated;
- (UIViewController *)popViewControllerAnimated:(BOOL)animated;
- (NSArray *)popToViewController:(UIViewController *)viewController animated:(BOOL)animated;
- (NSArray *)popToRootViewControllerAnimated:(BOOL)animated;
- (void)setViewControllers:(NSArray *)viewControllers animated:(BOOL)animated;
- (void)setNavigationBarHidden:(BOOL)hidden animated:(BOOL)animated;
- (void)setToolbarHidden:(BOOL)hidden animated:(BOOL)animated;

#pragma clang diagnostic pop

@end
