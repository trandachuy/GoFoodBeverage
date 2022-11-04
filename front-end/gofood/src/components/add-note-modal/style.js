import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  confirmationBox: {
    padding: 24,
    minHeight: 217,
    height: 'auto',
    borderRadius: 36,
    backgroundColor: '#fff',
  },

  confirmationText: {
    fontSize: 30,
    marginBottom: 16,
    color: '#50429B',
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'center',
    fontFamily: 'Nunito',
  },

  buttonBox: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },

  okButton: {
    minWidth: 144,
    minHeight: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#50429B',
  },

  textInOkButton: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'center',
    fontStyle: 'normal',
    fontFamily: 'Nunito',
  },

  cancelButton: {
    minHeight: 44,
    marginRight: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },

  textInCancelButton: {
    fontSize: 15,
    color: '#50429B',
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'center',
    fontFamily: 'Nunito',
  },

  viewInput: {
    height: 98,
    width: 279,
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: '#F2F4FF',
  },

  input: {
    marginLeft: 12,
    marginRight: 12,
    color: '#A5ABDE',
  },
});

export default styles;
