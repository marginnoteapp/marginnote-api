#import <Foundation/Foundation.h>
#import <CoreGraphics/CoreGraphics.h>
#import <QuartzCore/CATransform3D.h>

#import <UIKit/UIKit.h>
@import JavaScriptCore;

@protocol JSBNSObject;

@protocol JSBUICollectionViewLayoutAttributes <JSExport, JSBNSObject>

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"

@property (nonatomic, readonly) BOOL invalidateEverything;
@property (nonatomic, readonly) NSIndexPath *indexPathAfterUpdate;
@property (nonatomic, readonly) UICollectionView *collectionView;
@property (nonatomic) CGRect frame;
@property (nonatomic, readonly) NSString *representedElementKind;
//@property (nonatomic, readonly) UICollectionUpdateAction updateAction;
@property (nonatomic, retain) NSIndexPath *indexPath;
@property (nonatomic) CGSize size;
@property (nonatomic) CATransform3D transform3D;
//@property (nonatomic, readonly) UICollectionElementCategory representedElementCategory;
@property (nonatomic) CGAffineTransform transform;
@property (nonatomic) CGFloat alpha;
@property (nonatomic) CGPoint center;
@property (nonatomic, getter = isHidden) BOOL hidden;
@property (nonatomic) NSInteger zIndex;
@property (nonatomic, readonly) NSIndexPath *indexPathBeforeUpdate;
@property (nonatomic) CGRect bounds;
@property (nonatomic, readonly) BOOL invalidateDataSourceCounts;

+ (instancetype)layoutAttributesForCellWithIndexPath:(NSIndexPath *)indexPath;
+ (instancetype)layoutAttributesForSupplementaryViewOfKind:(NSString *)elementKind withIndexPath:(NSIndexPath *)indexPath;
+ (instancetype)layoutAttributesForDecorationViewOfKind:(NSString *)decorationViewKind withIndexPath:(NSIndexPath *)indexPath;

#pragma clang diagnostic pop

@end
