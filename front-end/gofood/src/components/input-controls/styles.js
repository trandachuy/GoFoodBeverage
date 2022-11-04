import {Platform, StyleSheet} from 'react-native';
import {windowWidth} from '../../utils/dimensions';

const styles = StyleSheet.create({
  inputControlBox: {
    borderRadius: 12,
    backgroundColor: '#F8F8FC',
    height: 48,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 12,
  },
  leftIconBox: {
    marginRight: 8,
  },
  inputControl: {
    fontFamily: 'Nunito',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 15,
    color: '#000000',
    height: 48,
    width: '100%',
  },
  textInputControl: {
    paddingRight: 24,
    minWidth: 230,
    // maxWidth: 230,
  },
  passwordInputControl: {
    paddingRight: 80,
  },
  labelBox: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Nunito',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 15,
    color: '#000000',
  },
  passwordBox: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  rightIconBox: {
    position: 'absolute',
    right: 12,
  },
  errorBox: {
    width: '100%',
    marginTop: 6,
  },
  errorMessage: {
    fontFamily: "'Nunito'",
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 15,
    color: '#FF0000',
    lineHeight: 20,
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#FF0000',
  },
  inputOk: {
    borderWidth: 1,
    borderColor: '#3F51B5',
  },
  phoneInputControlBox: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
  },
  phoneCodeBox: {
    height: 48,
    width: 88,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8FC',
    borderRadius: 12,
    padding: 12,
  },
  phoneIcon: {
    marginRight: 4,
  },
  phoneCodeText: {
    fontFamily: 'Nunito',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 15,
    color: '#000000',
  },
  phoneInputBox: {
    marginLeft: 9,
    borderRadius: 12,
    backgroundColor: '#F8F8FC',
    width: 214,
  },
  phoneInput: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  modalOverlay: {
    backgroundColor: '#000',
    zIndex: 0,
    width: '100%',
    height: '100%',
    opacity: 0.5,
  },
  modalBody: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  modalBodyContent: {
    bottom: 50,
    width: windowWidth - 32,
    height: 417,
    borderRadius: 30,
    position: 'absolute',
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#F2F2F2',
  },
  headerOfModalBodyContent: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  textInHeaderModal: {
    fontFamily: 'Nunito',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 17,
    color: '#000000',
  },
  searchBoxInModal: {
    marginTop: 16,
    marginBottom: 16,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    height: 36,
    paddingLeft: 12,
    paddingRight: 12,
    alignItems: 'center',
    flexDirection: 'row',
  },
  searchIconBox: {
    marginRight: 8,
  },
  searchIcon: {
    color: '#DADADA',
  },
  searchInputBoxInSearchBox: {
    height: 36,
    width: windowWidth - 115,
  },
  searchInputSearchControl: {
    width: '100%',
    height: 36,
    fontFamily: 'Nunito',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: '#9F9F9F',
  },
  currentSelectedBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderStyle: Platform.OS === 'ios' ? 'solid' : 'dashed',
    borderBottomColor: '#898A8D',
  },
  checkedIcon: {
    color: '#50429B',
  },
  countryListBox: {
    height: 270,
  },
  countryItemBox: {
    marginTop: 16,
    marginBottom: 16,
  },
  textInCountryItemBox: {
    fontFamily: 'Nunito',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 15,
    color: '#000000',
    textTransform: 'capitalize',
    paddingLeft: 24,
  },
  textInCurrentSelectedBox: {
    textTransform: 'capitalize',
  },

  textColorShow: {
    fontSize: 15,
    lineHeight: 20,
    color: '#376AED',
    fontWeight: '400',
    fontFamily: 'Nunito',
  },
});

export default styles;
