import {Dimensions, StyleSheet} from 'react-native';
import {windowWidth} from '../../../utils/dimensions';
const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  viewSearch: {
    marginTop: 20,
    marginLeft: 16,
    flexDirection: 'row',
  },

  viewInputSearch: {
    borderRadius: 15,
    marginRight: 16,
    width: width - 32,
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

  textName: {
    fontSize: 15,
    lineHeight: 20,
    marginLeft: 19,
    color: '#000000',
    fontWeight: '400',
    fontFamily: 'Nunito',
  },

  textAddress: {
    fontSize: 15,
    marginLeft: 19,
    lineHeight: 20,
    color: '#898A8D',
    fontWeight: '400',
  },

  viewIconGps: {
    minHeight: 96,
    padding: 16,
    marginTop: 16,
    borderRadius: 16,
    marginBottom: 16,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginLeft: 16,
    marginRight: 16,
    maxHeight: 'auto',
  },

  marginRight16: {
    marginRight: 16,
  },

  marginRight16: {
    fontSize: 15,
    color: '#000000',
    fontWeight: '700',
    marginRight: 20,
  },

  textCurrentLocation: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 5,
    color: '#000000',
    fontWeight: '700',
    fontFamily: 'Nunito',
  },

  textUserAddress: {
    fontSize: 15,
    lineHeight: 18,
    marginRight: 16,
    paddingRight: 16,
    color: '#898A8D',
    fontWeight: '400',
    fontFamily: 'Nunito',
  },

  backRightBtnLeft: {
    right: '13%',
  },

  rowBack: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
    display: 'flex',
    flexDirection: 'row',
    width: windowWidth - 32,
    right: 0,
    left: 16,
  },

  viewAddressDetail: {
    paddingTop: 16,
    borderRadius: 5,
    paddingBottom: 16,
    justifyContent: 'center',
  },

  viewAddressItem: {
    paddingLeft: 18,
    borderRadius: 16,
    marginBottom: 15,
    paddingRight: 16,
    backgroundColor: '#FFF',
    shadowColor: '#999',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    flexDirection: 'row',
    marginLeft: 16,
    marginRight: 16,
  },

  textNameColor: {
    fontWeight: '700',
  },

  inputSearchAddress: {
    borderRadius: 15,
    alignItems: 'center',
    backgroundColor: '#F7FBFF',
  },

  toastErrorMessageContainer: {
    zIndex: 1,
    elevation: 2,
    width: width - 32,
    height: 58,
    borderRadius: 16,
  },
  textToastMessage: {
    color: '#fff',
    fontSize: 15,
    paddingLeft: 10,
    alignSelf: 'flex-start',
  },
  toastMessageView: {
    zIndex: 1,
    elevation: 2,
    width: width - 32,
    height: 58,
    borderRadius: 16,
  },
  textGroup: {
    width: width - 32,
    height: 58,
    zIndex: 2,
    elevation: 2,
    paddingRight: 18,
    paddingLeft: 18,
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
