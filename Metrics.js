import {Dimensions, PixelRatio, StatusBar} from 'react-native';

// const { width, height } = Dimensions.get('window');
// // console.log("hjhdfjh",width,height)
// const guidelineBaseWidth = 375;
// const guidelineBaseHeight = 812;

// const horizontalScale = (size) => (width / guidelineBaseWidth) * size;
// const verticalScale = (size) => (height / guidelineBaseHeight) * size;
// const moderateScale = (size, factor = 0.5) => size + (horizontalScale(size) - size) * factor;

// export { horizontalScale, verticalScale, moderateScale };

export const windowWidth = Dimensions.get('window').width;
// const windowHeight = Dimensions.get('window').height;
const scaleFactor = windowWidth / 375;
// const scaleHeightFactor = windowHeight / 812;
export const scaledValue = (value = 0) => value * scaleFactor;
// export const scaledHeightValue = (value = 0) => value * scaleHeightFactor;

export const statusBarHeight = StatusBar.currentHeight;

// Reponsive Fonts
const fontScale = PixelRatio.getFontScale();
export const getFontSize = size => size / fontScale;