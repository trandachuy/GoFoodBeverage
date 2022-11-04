import { StyleSheet } from 'react-native';
import { windowWidth } from '../../utils/dimensions';
import { windowHeight } from '../../utils/dimensions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: windowWidth,
    height: windowHeight,
    backgroundColor: '#F9F9F9',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  topContent:
  {
    marginTop: 14,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textLanguage:
  {
    fontFamily: 'Nunito',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 17,
    lineHeight: 23,
    color: '#000000',
  },
  bottomContent:
  {
    height: windowHeight,
  },
  languagesContent: {
    marginTop: 10,
    width: windowWidth,
    height: windowHeight - 137,
  },
  bottomButton:
  {
    justifyContent: 'center',
    backgroundColor: '#000000',
    borderRadius: 14,
    backgroundColor: '#50429B',
    width: windowWidth - 32,
    height: 48,
    marginLeft: 16,
    marginRight: 16,
  },
  textButton:
  {
    fontFamily: 'Nunito',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 17,
    lineHeight: 23,
    color: '#FFFFFF',
  },
  padding_16: {
    marginTop: 20,
    flexDirection: 'row',
  },
  checkIconBox: {
    height: 36,
    width: 30,
    marginRight: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIcon: {
  },
  flagBox: {
    width: 36,
    height: 36,
    marginLeft: 20,
  },
  textLanguageBox:
  {
    marginLeft: 20,
    width: windowWidth - 20 - 36 - 20 - 22 - 30,
    height: 36,
    justifyContent: 'center',
  },
  textLanguageName: {
    fontFamily: 'Nunito',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 15,
    lineHeight: 20,
    display: 'flex',
    alignItems: 'center',
    color: '#000000'
  }
});

export default styles;