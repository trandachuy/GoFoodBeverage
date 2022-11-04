import {StyleSheet} from 'react-native';
import {ifIphoneX} from 'react-native-iphone-x-helper';

const styles = StyleSheet.create({
  container: {
    ...ifIphoneX(
      {
        paddingTop: 65,
      },
      {
        paddingTop: 20,
      },
    ),
    backgroundColor: '#F7FBFF',
    zIndex: 0,
    width: '100%',
    height: '100%',
  },

  loadingContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    backgroundColor: '#ffffff',
  },

  loadingImg: {
    width: 64,
    height: 64,
    resizeMode: 'contain',
  },

  view_header: {
    flexDirection: 'row',
  },

  view_header_left: {
    flex: 7,
  },
  bagContainer: {
    position: 'absolute',
    right: 16,
    bottom: 32,
    zIndex: 999,
    width: 72,
    height: 102,
  },
  bagWrapperInContainer: {
    width: '100%',
    height: '100%',
  },
  bagIcon: {
    position: 'absolute',
    left: 8,
    bottom: 8,
  },
  heartInCartBox: {
    position: 'absolute',
    top: 10,
    right: 8,
    width: 24,
    height: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textHeart: {
    position: 'absolute',
    zIndex: 1,
    fontFamily: 'Nunito',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 10,
    color: '#FFFFFF',
  },
  subTitle: {
    fontFamily: 'Nunito',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 17,
    lineHeight: 23,
    color: '#000000',
    paddingHorizontal: 16,
  },
});

export default styles;
