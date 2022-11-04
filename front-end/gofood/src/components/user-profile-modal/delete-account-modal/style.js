import {Platform, StyleSheet} from 'react-native';
import {windowHeight, windowWidth} from '../../../utils/dimensions';

const styles = StyleSheet.create({
  container: {
    width: windowWidth,
    height: windowHeight,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row-reverse',
  },
  confirmationBox: {
    width: windowWidth - 50,
    height: 'auto',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    zIndex: 1,
    paddingBottom: 16,
  },
  headerTitleBox: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  headerImg: {width: 144, height: 113, marginBottom: 4},
  headerTitleText: {
    fontFamily: 'Nunito',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 17,
    color: '#50429B',
  },
  canNotDeleteAccountBox: {
    paddingLeft: 16,
    paddingRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  firstTextInCannotDeleteAccountBox: {
    marginBottom: 3,
  },
  textInCannotDeleteAccountBox: {
    fontFamily: 'Nunito',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 15,
    textAlign: 'center',
    color: '#000000',
    lineHeight: 20,
  },
  lastTextInCannotDeleteAccountBox: {
    marginTop: 3,
  },
  textBold: {
    fontWeight: '700',
  },
  orderBox: {
    marginLeft: 22,
    marginRight: 8,
  },
  orderItemBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderStyle: Platform.OS === 'ios' ? 'solid' : 'dashed',
    paddingBottom: 12,
    marginBottom: 12,
  },
  textInModal: {
    fontFamily: 'Nunito',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 15,
  },
  orderNameInItemBox: {
    color: '#3C3C3C',
    marginBottom: 5,
  },
  orderCodeInItemBox: {
    color: '#A3A4A6',
  },
  rightSectionInItemBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textRightInRightSection: {
    color: '#FF8C21',
    fontSize: 13,
    marginRight: 15,
  },
  closeButton: {
    backgroundColor: '#50429B',
    borderRadius: 16,
    width: 279,
  },
  textInCloseButton: {
    color: '#ffffff',
  },
  buttonBox: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 27,
  },
  showMoreOrderItemBox: {
    marginTop: 4,
  },
  textInShowMoreOrderItemBox: {
    color: '#50429B',
    textDecorationLine: 'underline',
  },
  headerDeleteAccountBox: {
    marginTop: 11,
    marginBottom: 4,
  },
  contentBox: {
    justifyContent: 'center',
  },
  warningAccount: {
    color: '#FF0000',
    textAlign: 'center',
    marginBottom: 9,
  },
  textMainConfirmation: {
    color: '#4A4A4A',
    paddingLeft: 24,
    paddingRight: 24,
  },
  policyItem: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 32,
    paddingRight: 32,
  },
  firstItemInPolicyItem: {
    marginTop: 18,
    marginBottom: 18,
  },
  textInPolicy: {
    marginLeft: 16,
  },
  deleteButtonIsDisabled: {
    backgroundColor: '#FFABAB',
    borderRadius: 16,
    height: 44,
    width: windowWidth - 106,
    marginLeft: 28,
    marginRight: 28,
  },
  deleteButtonIsEnabled: {
    backgroundColor: '#FF5656',
  },
  cancelButton: {
    marginTop: 12,
    marginBottom: 4,
    width: 'auto',
    paddingLeft: 5,
    paddingRight: 5,
    height: 30,
  },
  textInCancelButton: {
    color: '#50429B',
  },
  buttonBoxForAccountDeletion: {
    marginTop: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
