import {StyleSheet} from 'react-native';
import {ifIphoneX} from 'react-native-iphone-x-helper';
import {windowHeight} from '../../utils/dimensions';

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  logoContainer: {
    paddingTop: 20,
    alignItems: 'center',
    marginBottom: windowHeight <= 667 ? 32 : 60,
  },
  controlContainer: {
    paddingLeft: 32,
    paddingRight: 32,
  },
  loginButton: {
    backgroundColor: '#50429B',
    borderRadius: 12,
    marginTop: 20,
  },
  textInButton: {
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
    textTransform: 'uppercase',
    color: '#FFFFFF',
  },
  linkBox: {
    flexDirection: 'row',
    marginTop: windowHeight <= 667 ? 32 : 88,
    justifyContent: 'center',
    //marginBottom: windowHeight <= 667 ? 50 : 0,
  },
  textInLinkBox: {
    fontFamily: 'Nunito',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 15,
    color: '#000000',
  },
  textActive: {
    color: '#3F51B5',
  },
  controlGroup: {
    marginBottom: 28,
  },
  smsOtpContainer: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  smsOtpHeaderTextBox: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 33,
  },
  smsOtpText: {
    fontFamily: 'Nunito',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 15,
    textAlign: 'center',
    letterSpacing: 0.3,
    color: '#50429B',
  },
  smsOtpTextForPhone: {
    fontWeight: '700',
  },
  smsOtpItemBox: {width: '100%', height: 48},
  smsOtpItemInBox: {
    width: 48,
    height: 48,
    borderRadius: 10,
    fontFamily: 'Nunito',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 17,
    textAlign: 'center',
    color: '#000000',
  },
  smsOtpErrorCodeBox: {
    marginTop: 8,
    marginBottom: 8,
    minHeight: 20,
  },
  smsOtpErrorCode: {
    fontFamily: 'Nunito',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 15,
    textAlign: 'center',
    color: '#FF0000',
  },
  resendCodeBox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageInResendCodeBox: {
    fontFamily: 'Nunito',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 15,
    textAlign: 'center',
    color: '#9F9F9F',
    marginBottom: 20,
  },
  resendText: {
    fontWeight: '700',
    fontSize: 17,
    color: '#50429B',
  },
});

export default styles;
