import {StyleSheet} from 'react-native';
import {windowHeight, windowWidth} from '../../utils/dimensions';

const styles = StyleSheet.create({
  viewContainer: {
    height: '100%',
    position: 'relative',
    flexDirection: 'column',
  },

  viewSearch: {
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 24,
    flexDirection: 'row',
  },

  viewInputSearch: {
    borderRadius: 15,
    marginRight: 16,
    width: windowWidth - 32,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  containerIconSearch: {
    backgroundColor: '#FFFFFF',
    height: '100%',
    borderBottomLeftRadius: 15,
    borderTopLeftRadius: 15,
    paddingTop: 18,

    viewIconSearch: {
      marginLeft: 12,
      marginRight: 12,
    },
  },

  viewMap: {
    width: 56,
    height: 56,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F3F2',
  },

  alignItemsCenter: {
    alignItems: 'center',
  },

  textAddressInMind: {
    fontSize: 15,
    lineHeight: 20,
    color: '#000000',
    fontWeight: '700',
    fontFamily: 'Nunito',
  },

  textSearchLabel: {
    fontSize: 15,
    lineHeight: 20,
    color: '#979797',
    fontFamily: 'Nunito',
  },

  viewImageBackground: {
    flex: 1,
  },

  areaImage: {
    zIndex: 1,
    marginLeft: 35,
  },

  moonImage: {
    zIndex: 0,
    height: 302,
    maxWidth: windowWidth,
    resizeMode: 'stretch',
    alignItems: 'center',
  },

  astronautImage: {
    zIndex: 2,
    marginTop: -80,
  },

  inputSearchAddress: {
    borderRadius: 15,
    alignItems: 'center',
    backgroundColor: '#F7FBFF',
  },

  imageNotAddress: {
    position: 'absolute',
    bottom: 0,
    width: windowWidth,
    height: windowHeight - 300,
    resizeMode: 'stretch',
    top: 300,
  },

  containSearch: {
    flex: 1,
    zIndex: 5,
    elevation: 5,
  },

  textInputSearch: {
    height: '100%',
    width: windowWidth - 70,
    top: 2,
    right: 10,
    borderRadius: 15,
  },
});

export default styles;
