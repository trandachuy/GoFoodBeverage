import {Dimensions, StyleSheet} from 'react-native';
import {windowHeight, windowWidth} from '../../../utils/dimensions';
const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
    paddingLeft: 16,
    paddingRight: 16,
  },

  textName: {
    fontSize: 15,
    marginTop: 19,
    lineHeight: 20,
    color: '#000000',
    fontWeight: '400',
    fontFamily: 'Nunito',
  },

  inputName: {
    height: 48,
    padding: 12,
    marginTop: 5,
    fontSize: 15,
    lineHeight: 20,
    borderRadius: 12,
    color: '#000000',
    fontWeight: '400',
    fontFamily: 'Nunito',
    backgroundColor: '#FFFFFF',
  },

  labelAddress: {
    fontSize: 15,
    lineHeight: 20,
    color: '#636363',
    fontWeight: '400',
    fontFamily: 'Nunito',
  },

  requiedInputName: {
    backgroundColor: '#F2F3F2',
  },

  viewErrorName: {
    marginTop: 6,
    width: '100%',
  },

  textErrorName: {
    fontSize: 15,
    color: '#FF0000',
    fontWeight: '400',
    textAlign: 'right',
    fontStyle: 'normal',
    fontFamily: 'Nunito',
  },

  textAddress: {
    fontSize: 15,
    marginTop: 19,
    lineHeight: 20,
    color: '#000000',
    fontWeight: '400',
    fontFamily: 'Nunito',
  },

  viewLocation: {
    padding: 12,
    marginTop: 5,
    paddingRight: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
  },

  textAddressDetail: {
    fontSize: 15,
    lineHeight: 20,
    color: '#000000',
    fontWeight: '400',
    fontFamily: 'Nunito',
  },

  textNote: {
    fontSize: 15,
    lineHeight: 20,
    color: '#000000',
    fontWeight: '400',
    fontFamily: 'Nunito',
  },

  viewSaveAddress: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#50429B',
  },

  textSaveAddress: {
    fontSize: 17,
    lineHeight: 23,
    color: '#FFFFFF',
    fontWeight: '700',
    fontFamily: 'Nunito',
  },

  marginTop16: {
    marginTop: 16,
    marginBottom: 32,
  },

  viewFooter: {
    marginLeft: 16,
    marginRight: 16,
    position: 'relative',
    bottom: 20,
  },
});

export default styles;
