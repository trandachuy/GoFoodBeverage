import {StyleSheet} from 'react-native';
import {ifIphoneX} from 'react-native-iphone-x-helper';
import {windowHeight, windowWidth} from '../../utils/dimensions';

const styles = StyleSheet.create({
  backgroundImg: {
    flex: 1,
    zIndex: -1,
    backgroundColor: '#fff',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    resizeMode: 'stretch',
    width: windowWidth,
    height: windowHeight,
  },
  
  logoContainer: {
    ...ifIphoneX(
      {
        paddingTop: 146,
      },
      {
        paddingTop: windowHeight <= 667 ? 50 : 100,
      },
    ),
    alignItems: 'center',
    marginBottom: windowHeight <= 667 ? 32 : 70,
  },
  smallLogo: {
    width: 200,
    height: 140.3361345,
    resizeMode: 'stretch',
  },
  controlContainer: {
    paddingHorizontal: 32,
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loginButton: {
    backgroundColor: '#50429B',
    borderRadius: 12,
    width: '100%',
  },
  textInButton: {
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
    textTransform: 'uppercase',
    color: '#FFFFFF',
  },
  otherLoginWays: {
    width: 50,
    height: '100%',
    paddingTop: 13,
    alignItems: 'center',
    backgroundColor: '#F8F8FC',
    borderRadius: 12,
  },
  linkBox: {
    flexDirection: 'row',
    marginTop: windowHeight <= 667 ? 32 : 50,
    justifyContent: 'center',
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
    fontWeight: '700',
  },
  controlGroup: {
    marginBottom: 28,
  },
});

export default styles;
