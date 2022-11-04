import {Dimensions, Platform, StyleSheet} from 'react-native';
import {windowWidth} from '../../utils/dimensions';

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  viewHeader: {
    marginTop: 13,
    borderRadius: 20,
    marginBottom: 16,
    alignSelf: 'center',
    width: '100%',
    height: 150,
    paddingLeft: 16,
    paddingRight: 16,
  },

  viewOrderCancelled: {
    flexDirection: 'row',
  },

  imageCanceled: {
    height: 150,

    borderRadius: 40,
  },

  borderRadiusImage: {
    borderRadius: 20,
  },

  textOrderCanceled: {
    flex: 1,
    fontSize: 15,
    marginTop: 40,
    marginLeft: 30,
    lineHeight: 20,
    color: '#FFFFFF',
    fontWeight: '700',
    fontFamily: 'Nunito',
  },

  viewIconCancelled: {
    flex: 1,
    height: 150,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },

  IconCancelled: {
    marginRight: 40,
    marginBottom: 15,
  },

  viewOrderDetail: {
    flex: 1,
    paddingTop: 16,
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 16,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#50429B',
        backgroundColor: '#FFFFFF',
        shadowOffset: {
          height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
      android: {
        shadowColor: '#50429B',
        backgroundColor: '#FFFFFF',
        shadowOffset: {
          height: 5,
        },
        shadowOpacity: 9,
        shadowRadius: 9,
        elevation: 5,
      },
    }),
  },

  viewOrderDetailsItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E4E7FF',
  },

  orderTitle: {
    fontSize: 15,
    lineHeight: 20,
    color: '#50429B',
    fontWeight: '800',
  },

  viewNotComplete: {
    marginBottom: 24,
  },

  viewOrderNotComplete: {
    flexDirection: 'row',
  },

  orderNotComplete: {
    flex: 3,
    justifyContent: 'center',
  },

  iconOrderNotComplete: {
    flex: 1,
  },

  orderInfo: {
    marginTop: 12,
    flexDirection: 'row',
  },

  labelOrderTitle: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    color: '#50555C',
    fontWeight: '400',
  },

  textOrderTitle: {
    flex: 2,
    fontSize: 15,
    lineHeight: 20,
    color: '#50555C',
    fontWeight: '400',
    textAlign: 'right',
  },

  viewDeliveryDetail: {
    flexDirection: 'row',
    marginTop: 16,
  },

  labelStoreLocation: {
    fontSize: 12,
    lineHeight: 15,
    marginLeft: 16,
    color: '#898A8D',
    fontWeight: '400',
    fontFamily: 'Nunito',
  },

  textStoreLocation: {
    fontSize: 15,
    marginTop: 5,
    lineHeight: 16,
    marginLeft: 16,
    color: '#000000',
    fontWeight: '700',
    fontFamily: 'Nunito',
  },

  textReceiverAddress: {
    fontSize: 15,
    marginTop: 5,
    lineHeight: 16,
    marginLeft: 16,
    color: '#000000',
    fontWeight: '400',
    fontFamily: 'Nunito',
  },

  textOrderItems: {
    flex: 6,
    fontSize: 15,
    lineHeight: 20,
    color: '#000000',
    fontWeight: '700',
  },

  textOrderItemsQuantity: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    color: '#000000',
    fontWeight: '700',
    textAlign: 'right',
  },

  textOrderItem: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    color: '#9D9D9D',
    fontWeight: '400',
  },

  textOrderItemQuantity: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    color: '#000000',
    fontWeight: '400',
    textAlign: 'right',
  },

  labelPaymentDetail: {
    flex: 3,
    fontSize: 15,
    lineHeight: 20,
    color: '#50555C',
    fontWeight: '400',
  },

  textPaymentDetail: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    color: '#000000',
    fontWeight: '400',
    textAlign: 'right',
  },

  viewTotal: {
    flexDirection: 'row',
    marginBottom: 12,
  },

  labelTotal: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    color: '#000000',
    fontWeight: '400',
  },

  textTotal: {
    flex: 1,
    fontSize: 17,
    lineHeight: 23,
    color: '#50429B',
    fontWeight: '700',
    textAlign: 'right',
  },

  textPaymentMethod: {
    fontSize: 15,
    lineHeight: 20,
    color: '#FF8C21',
    fontWeight: '400',
  },

  colorPaymentStatusName: {
    color: '#50429B',
  },

  indicatorStyles: {
    stepIndicatorSize: 8,
    currentStepIndicatorSize: 16,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 8,
    stepStrokeCurrentColor: '#50429B',
    stepStrokeWidth: 4,
    stepStrokeFinishedColor: '#50429B',
    stepStrokeUnFinishedColor: '#898A8D',
    separatorFinishedColor: '#50429B',
    separatorUnFinishedColor: '#898A8D',
    labelColor: '#898A8D',
    labelSize: 13,
    currentStepLabelColor: '#50429B',
  },

  containOrderDetail: {
    marginBottom: 72,
  },

  reOrderBox: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#F7FBFF',
    width: windowWidth,
    height: 72,
    zIndex: 9,
    elevation: 9,
    alignItems: 'center',
    justifyContent: 'center',
    buttonReOrder: {
      width: windowWidth - 32,
      backgroundColor: '#50429B',
      borderRadius: 12,
      textStyle: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '700',
      },
    },
  },

  viewTotalBorderBottom: {
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E4E7FF',
  },

  viewNote: {
    marginTop: 16,
    paddingLeft: 8,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#F9F9FF',
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 16,
  },

  textNote: {
    fontSize: 15,
    marginLeft: 12,
    color: '#50429B',
    fontWeight: '400',
    fontFamily: 'Nunito',
    marginRight: 24,
  },

  textNoteProduct: {
    color: '#50429B',
  },

  viewProductOption: {
    marginLeft: 5,
    flexDirection: 'row',
  },

  viewComboOption: {
    marginLeft: 15,
    flexDirection: 'row',
  },
});

export default styles;
