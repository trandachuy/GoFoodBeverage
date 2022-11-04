import {StyleSheet} from 'react-native';
import {windowWidth} from '../../utils/dimensions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmationBox: {
    width: windowWidth - 48,
    minHeight: 217,
    height: 'auto',
    backgroundColor: '#fff',
    borderRadius: 36,
    padding: 24,
  },
  confirmationText: {
    fontFamily: 'Nunito',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 30,
    textAlign: 'center',
    color: '#50429B',
    marginBottom: 16,
  },
  contentText: {
    fontFamily: 'Nunito',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 15,
    textAlign: 'center',
    letterSpacing: -0.078,
    color: '#000000',
    marginBottom: 20,
  },
  buttonBox: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  okButton: {
    minWidth: 144,
    minHeight: 44,
    backgroundColor: '#50429B',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInOkButton: {
    fontFamily: 'Nunito',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 15,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  cancelButton: {
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 25,
  },
  textInCancelButton: {
    fontFamily: 'Nunito',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 15,
    textAlign: 'center',
    color: '#50429B',
  },
});

export default styles;
