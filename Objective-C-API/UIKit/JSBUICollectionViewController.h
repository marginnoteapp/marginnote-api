
#import <UIKit/UIKit.h>
@import JavaScriptCore;

@protocol JSBUIViewController;

@protocol JSBUICollectionViewController <JSExport, JSBUIViewController>

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"

@property (nonatomic) BOOL clearsSelectionOnViewWillAppear;
@property (nonatomic, readonly) UICollectionViewLayout *collectionViewLayout;
@property (nonatomic, assign) BOOL useLayoutToLayoutNavigationTransitions;
@property (nonatomic, retain) UICollectionView *collectionView;

- (id)initWithCollectionViewLayout:(UICollectionViewLayout *)layout;

#pragma clang diagnostic pop

@end
