import {StyleSheet} from 'react-native';
import {windowHeight, windowWidth} from '../../utils/dimensions';

const styles = StyleSheet.create({
  viewModalProfile: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'flex-end',
    height: windowHeight,
    width: windowWidth,
  },
  containModal: {
    zIndex: 1,
    elevation: 1,
    flex: 1,
    marginTop: 47,
    marginRight: 16,
    alignItems: 'center',
    width: windowWidth - 76,
  },
  containModalTop: {
    height: 256,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 2,
    zIndex: 2,
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
  },
  containModalBottom: {
    borderRadius: 30,
    backgroundColor: '#F2F2F2',
    elevation: 3,
    zIndex: 3,
    paddingTop: 24,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 24,
    position: 'relative',
    top: -50,
    width: '100%',
    height: windowHeight - 285,
  },
  textUserName: {
    zIndex: 4,
    elevation: 4,
    paddingBottom: 60,
    position: 'absolute',
    flexDirection: 'row',
    bottom: 0,
  },
  textTitle: {
    flex: 1,
    fontSize: 25,
    fontWeight: '800',
    color: '#FCFCFE',
    marginLeft: 40,
  },
  buttonOption: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingLeft: 20,
    paddingRight: 20,
    height: 44,
  },
  buttonOptionText: {
    color: '#000000',
    fontSize: 15,
    alignSelf: 'flex-start',
    paddingLeft: 15,
  },
  buttonOptionIcon: {
    marginRight: 16,
  },
  buttonOptionBottom: {
    marginTop: 16,
  },
  backIcon: {
    position: 'absolute',
    zIndex: 4,
    elevation: 4,
    top: 15,
    left: 20,
  },
  buttonLoginOption: {
    paddingLeft: 24,
  },
  columnButtonOption: {
    height: 480,
  },
  textVersion: {
    fontSize: 13,
    color: '#9A9A9A',
  },
  avatarUser: {
    elevation: 3,
    zIndex: 3,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    width: '100%',
    height: '100%',
  },
  shadowOption: {
    elevation: 3,
    zIndex: 3,
    width: '100%',
  },
  buttonPaddingOption: {
    paddingLeft: 24,
  },
  columnVersion: {
    marginTop: 10,
  },
  viewIconRightProfile: {
    marginRight: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});

export default styles;
