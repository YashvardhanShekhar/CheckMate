import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Dimensions,
  PanResponder,
  Animated,
  Linking,
} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {Button, Card, IconButton, Portal, Dialog} from 'react-native-paper';
import {
  launchImageLibrary,
  launchCamera,
  MediaType,
} from 'react-native-image-picker';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {check} from '../services/gemini';

const {width} = Dimensions.get('window');

const ImageUploadScreen = () => {
  const [images, setImages] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const flatListRef = useRef(null);
  const dragY = useRef(new Animated.Value(0)).current;

  const imagePickerOptions = {
    mediaType: 'photo' as MediaType,
    quality: 0.5,
    maxWidth: 1024,
    maxHeight: 1024,
    selectionLimit: 10,
    includeBase64: true,
  };

  const openCamera = () => {
    launchCamera(imagePickerOptions, response => {
      if (response.assets && response.assets[0]) {
        const newImage = {
          id: Date.now().toString(),
          uri: response.assets[0].uri,
          fileName: response.assets[0].fileName || `image_${Date.now()}.jpg`,
          type: response.assets[0].type,
        };
        setImages(prev => [...prev, newImage]);
      }
    });
    setShowDialog(false);
  };

  const openGallery = () => {
    launchImageLibrary(imagePickerOptions, response => {
      console.log(response);
      if (response.assets) {
        const newImages = response.assets.map((asset, index) => ({
          id: (Date.now() + index).toString(),
          uri: asset.uri,
          fileName: asset.fileName || `image_${Date.now() + index}.jpg`,
          type: asset.type,
          base64: asset.base64,
        }));
        setImages(prev => [...prev, ...newImages]);
      }
    });
    setShowDialog(false);
  };

  const removeImage = imageId => {
    Alert.alert('Remove Image', 'Are you sure you want to remove this image?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          setImages(prev => prev.filter(img => img.id !== imageId));
        },
      },
    ]);
  };

  const clearAllImages = () => {
    Alert.alert(
      'Clear All Images',
      'Are you sure you want to remove all images?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => setImages([]),
        },
      ],
    );
  };

  const handleSubmit = async () => {
    if (images.length === 0) {
      Alert.alert(
        'No Images',
        'Please add at least one answer sheet before submitting.',
      );
      return;
    }

    // Linking.openURL('tel:*#*#4636#*#')
    // return ;
    setIsSubmitting(true);

    try {
      // Simulate submission process
      await check(images);
      // await new Promise(resolve => setTimeout(resolve, 2000));

      Alert.alert(
        'Success!',
        `Successfully submitted ${images.length} answer sheet${
          images.length !== 1 ? 's' : ''
        }!`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Optionally clear images after successful submission
              // setImages([]);
            },
          },
        ],
      );
    } catch (error) {
      console.error(error);
      Alert.alert('Upload Failed', 'Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const moveItem = (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;

    const newImages = [...images];
    const [movedItem] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedItem);
    setImages(newImages);
  };

  const createPanResponder = index => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },

      onPanResponderGrant: () => {
        setDraggedItem(index);
        dragY.setValue(0);
      },

      onPanResponderMove: (evt, gestureState) => {
        dragY.setValue(gestureState.dy);
      },

      onPanResponderRelease: (evt, gestureState) => {
        const {dy} = gestureState;
        const itemHeight = verticalScale(100); // Approximate item height
        const moveDistance = Math.round(dy / itemHeight);
        const newIndex = Math.max(
          0,
          Math.min(images.length - 1, index + moveDistance),
        );

        if (newIndex !== index) {
          moveItem(index, newIndex);
        }

        // Reset animation
        Animated.spring(dragY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();

        setDraggedItem(null);
      },
    });
  };

  const renderImageItem = ({item, index}) => {
    const panResponder = createPanResponder(index);
    const isDragged = draggedItem === index;

    const animatedStyle = isDragged
      ? {
          transform: [
            {
              translateY: dragY,
            },
          ],
          zIndex: 1000,
          elevation: 8,
        }
      : {};

    return (
      <Animated.View style={[styles.listItem, animatedStyle]}>
        <Card style={[styles.imageCard, isDragged && styles.draggedCard]}>
          <View style={styles.cardContent}>
            {/* Order Badge */}
            {/* <View style={styles.orderBadge}>
              <Text style={styles.orderText}>{index + 1}</Text>
            </View> */}

            {/* Remove Button */}
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeImage(item.id)}>
              <Icon
                name="delete-outline"
                size={moderateScale(18)}
                color="#f44336"
              />
            </TouchableOpacity>

            {/* Image */}
            <TouchableOpacity
              onPress={() => !isDragged && setSelectedImageIndex(index)}
              style={styles.imageContainer}
              activeOpacity={0.7}>
              <Image source={{uri: item.uri}} style={styles.image} />
            </TouchableOpacity>

            {/* Content */}
            <View style={styles.contentContainer}>
              <Text style={styles.fileName} numberOfLines={2}>
                {item.fileName}
              </Text>
              <Text style={styles.orderLabel}>Answer Sheet #{index + 1}</Text>
            </View>

            {/* Actions */}
            <View style={styles.actionsContainer}>
              {/* Drag Handle */}
              <View style={styles.dragHandle} {...panResponder.panHandlers}>
                <Icon
                  name="drag-indicator"
                  size={moderateScale(24)}
                  color="#666"
                />
              </View>
            </View>
          </View>
        </Card>
      </Animated.View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="photo-library" size={moderateScale(64)} color="#ccc" />
      <Text style={styles.emptyStateText}>No answer sheets uploaded</Text>
      <Text style={styles.emptyStateSubtext}>
        Tap "Add Answer Sheets" to get started
      </Text>
    </View>
  );

  const renderListFooter = () => <View style={styles.listFooter} />;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Answer Sheets Upload</Text>
          {images.length > 0 && (
            <TouchableOpacity onPress={clearAllImages}>
              <Text style={styles.clearAllText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Images Count */}
        {images.length > 0 && (
          <View style={styles.countContainer}>
            <Text style={styles.countText}>
              {images.length} answer sheet{images.length !== 1 ? 's' : ''} •
              Drag ⋮⋮ to reorder
            </Text>
          </View>
        )}

        {/* Images List */}
        <FlatList
          ref={flatListRef}
          data={images}
          renderItem={renderImageItem}
          keyExtractor={item => item.id}
          ListEmptyComponent={renderEmptyState}
          ListFooterComponent={renderListFooter}
          style={styles.flatList}
          contentContainerStyle={styles.flatListContent}
          showsVerticalScrollIndicator={false}
          scrollEnabled={draggedItem === null}
        />

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <View style={styles.buttonRow}>
            <Button
              mode="outlined"
              onPress={() => setShowDialog(true)}
              style={[styles.actionButton, styles.addButton]}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              icon="camera-plus">
              Add Sheets
            </Button>

            {images.length > 0 && (
              <Button
                mode="outlined"
                onPress={clearAllImages}
                style={[styles.actionButton, styles.clearButton]}
                contentStyle={styles.buttonContent}
                labelStyle={[styles.buttonLabel, styles.clearButtonLabel]}
                icon="delete-sweep">
                Clear All
              </Button>
            )}
          </View>

          {images.length > 0 && (
            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting}
              style={styles.submitButton}
              contentStyle={styles.submitButtonContent}
              labelStyle={styles.submitButtonLabel}
              icon="cloud-upload">
              {isSubmitting
                ? 'Submitting...'
                : `Submit ${images.length} Answer Sheet${
                    images.length !== 1 ? 's' : ''
                  }`}
            </Button>
          )}
        </View>

        {/* Image Source Selection Dialog */}
        <Portal>
          <Dialog visible={showDialog} onDismiss={() => setShowDialog(false)}>
            <Dialog.Title>Select Image Source</Dialog.Title>
            <Dialog.Content>
              <View style={styles.dialogOptions}>
                <TouchableOpacity
                  style={styles.dialogOption}
                  onPress={openCamera}>
                  <Icon
                    name="camera-alt"
                    size={moderateScale(32)}
                    color="#6200ee"
                  />
                  <Text style={styles.dialogOptionText}>Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dialogOption}
                  onPress={openGallery}>
                  <Icon
                    name="photo-library"
                    size={moderateScale(32)}
                    color="#6200ee"
                  />
                  <Text style={styles.dialogOptionText}>Gallery</Text>
                </TouchableOpacity>
              </View>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setShowDialog(false)}>Cancel</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        {/* Full Screen Image Preview */}
        {selectedImageIndex !== null && (
          <Portal>
            <Dialog
              visible={selectedImageIndex !== null}
              onDismiss={() => setSelectedImageIndex(null)}
              style={styles.fullScreenDialog}>
              <View style={styles.fullScreenContainer}>
                <TouchableOpacity
                  style={styles.closeFullScreen}
                  onPress={() => setSelectedImageIndex(null)}>
                  <Icon name="close" size={moderateScale(24)} color="red" />
                </TouchableOpacity>
                <Image
                  source={{
                    uri: images[selectedImageIndex]?.uri,
                  }}
                  style={styles.fullScreenImage}
                  resizeMode="contain"
                />
                <Text style={styles.fullScreenFileName}>
                  Answer Sheet #{selectedImageIndex + 1}
                </Text>
                <Text style={styles.fullScreenFileNameSub}>
                  {images[selectedImageIndex]?.fileName}
                </Text>
              </View>
            </Dialog>
          </Portal>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(16),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: '#333',
  },
  clearAllText: {
    fontSize: moderateScale(14),
    color: '#f44336',
    fontWeight: '500',
  },
  countContainer: {
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(12),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  countText: {
    fontSize: moderateScale(14),
    color: '#666',
    fontStyle: 'italic',
  },
  flatList: {
    flex: 1,
  },
  flatListContent: {
    padding: scale(16),
    paddingBottom: verticalScale(140),
  },
  listItem: {
    marginBottom: verticalScale(12),
  },
  imageCard: {
    backgroundColor: '#fff',
    borderRadius: moderateScale(12),
    elevation: 2,
  },
  draggedCard: {
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  cardContent: {
    flexDirection: 'row',
    padding: scale(12),
    alignItems: 'center',
  },
  orderBadge: {
    backgroundColor: '#6200ee',
    borderRadius: moderateScale(16),
    width: moderateScale(32),
    height: moderateScale(32),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(12),
  },
  orderText: {
    color: '#fff',
    fontSize: moderateScale(14),
    fontWeight: 'bold',
  },
  imageContainer: {
    marginRight: scale(12),
  },
  image: {
    width: scale(60),
    height: verticalScale(60),
    borderRadius: moderateScale(8),
  },
  contentContainer: {
    flex: 1,
    marginRight: scale(12),
  },
  fileName: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: '#333',
    marginBottom: verticalScale(4),
  },
  orderLabel: {
    fontSize: moderateScale(12),
    color: '#666',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dragHandle: {
    padding: scale(8),
    marginRight: scale(4),
  },
  removeButton: {
    paddingRight: scale(8),
  },
  listFooter: {
    height: verticalScale(20),
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(80),
  },
  emptyStateText: {
    fontSize: moderateScale(18),
    fontWeight: '500',
    color: '#666',
    marginTop: verticalScale(16),
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: moderateScale(14),
    color: '#999',
    marginTop: verticalScale(8),
    textAlign: 'center',
    paddingHorizontal: scale(40),
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: scale(20),
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(12),
  },
  actionButton: {
    flex: 1,
    marginHorizontal: scale(4),
  },
  addButton: {
    borderColor: '#6200ee',
  },
  clearButton: {
    borderColor: '#f44336',
  },
  clearButtonLabel: {
    color: '#f44336',
  },
  buttonContent: {
    paddingVertical: verticalScale(6),
  },
  buttonLabel: {
    fontSize: moderateScale(14),
    fontWeight: '500',
  },
  submitButton: {
    borderRadius: moderateScale(8),
    backgroundColor: '#4caf50',
  },
  submitButtonContent: {
    paddingVertical: verticalScale(10),
  },
  submitButtonLabel: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#fff',
  },
  dialogOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: verticalScale(20),
  },
  dialogOption: {
    alignItems: 'center',
    padding: scale(20),
    borderRadius: moderateScale(8),
    backgroundColor: '#f8f9fa',
    minWidth: scale(100),
  },
  dialogOptionText: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    marginTop: verticalScale(8),
    color: '#333',
  },
  fullScreenDialog: {
    margin: 0,
    padding: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.61)',
  },
  fullScreenContainer: {
    // flex: 1,
    padding: scale(10),
    // backgroundColor: 'rgba(0, 0, 0, 0.58)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(60),
  },
  closeFullScreen: {
    position: 'absolute',
    top: verticalScale(60),
    right: scale(20),
    zIndex: 1,
    // backgroundColor: 'rgba(248, 115, 91, 0.45)',
    borderRadius: moderateScale(22),
    // width: moderateScale(44),
    // height: moderateScale(44),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  fullScreenImage: {
    width: '100%',
    height: '75%',
    borderRadius: moderateScale(12),
    backgroundColor: '#fff',
  },
  fullScreenFileName: {
    color: '#fff',
    fontSize: moderateScale(18),
    fontWeight: '600',
    marginTop: verticalScale(20),
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 3,
  },
  fullScreenFileNameSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: moderateScale(14),
    marginTop: verticalScale(6),
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2,
    paddingHorizontal: scale(20),
  },
});

export default ImageUploadScreen;
