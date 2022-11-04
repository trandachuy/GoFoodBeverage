import {StyleSheet} from 'react-native';
import {Platforms} from '../../constants/platform.constants';
import {windowHeight, windowWidth} from '../../utils/dimensions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 16,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: '#F7FBFF',
  },
  contentContainerStyle: {
    paddingBottom: 86,
  },
  rowItem: {
    paddingTop: 12,
    paddingLeft: 16,
    marginBottom: 16,
    borderRadius: 16,
    paddingRight: 16,
    paddingBottom: 12,
    backgroundColor: '#ffffff',
    shadowColor: '#313dae40',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  headerInRow: {
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerInRowNoBorder: {
    borderBottomWidth: 0,
    minHeight: 60,
    marginBottom: 0,
  },
  leftSectionInHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  defaultText: {
    fontSize: 15,
    lineHeight: 20,
    color: '#000000',
    fontWeight: '400',
    fontStyle: 'normal',
    fontFamily: 'Nunito',
  },
  colorTextNoAVailable: {
    color: '#7B7B7B',
  },
  textInHeaderInRow: {
    fontSize: 15,
    fontWeight: '800',
  },
  iconBoxInLeftSection: {
    marginRight: 25,
    alignSelf: 'flex-start',
  },
  changeLocationButton: {
    width: 122,
    height: 26,
    borderWidth: 1,
    borderRadius: 8,
    borderStyle: 'solid',
    borderColor: '#FF8C21',
  },
  textInChangeLocationButton: {
    fontSize: 13,
    color: '#FF8C21',
  },
  textAddressBoxInRow: {
    paddingLeft: 16,
    paddingRight: 7,
  },
  locationName: {
    lineHeight: 21,
    color: '#000000',
    fontWeight: '700',
  },
  locationAddress: {
    color: '#636363',
    lineHeight: 21,
  },
  addressNote: {
    color: '#A5ABDE',
    lineHeight: 21,
  },
  addItemLink: {
    fontWeight: '600',
    color: '#50429B',
  },
  orderItemBox: {
    marginBottom: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E4E7FF',
    justifyContent: 'space-between',
  },
  lastOrderItemBox: {
    marginBottom: 0,
    paddingBottom: 0,
    borderBottomWidth: 0,
  },
  orderItemLeftBox: {
    width: windowWidth - 176,
  },
  orderItemRightBox: {
    width: 107,
  },
  quantityControlBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productImgBox: {
    borderRadius: 8,
    marginBottom: 26,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  productImg: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  textBold: {
    fontWeight: '700',
  },
  headerBoxInOrderItemLeftBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productName: {
    marginLeft: 8,
  },
  priceTextBox: {
    marginTop: 16,
    flexDirection: 'row',
  },
  priceText: {
    color: '#50429B',
  },
  textPriceDiscount: {
    marginLeft: 10,
    fontSize: 13,
    lineHeight: 18,
    color: '#C1C1C1',
    fontWeight: '400',
    textDecorationLine: 'line-through',
  },
  productItemInCombo: {
    marginTop: 12,
  },
  textInProductItemInCombo: {
    lineHeight: 20,
  },
  textInTakeNote: {
    color: '#C5C5C7',
    fontSize: 15,
    fontWeight: '400',
  },
  textInSmallItem: {
    fontSize: 15,
    fontWeight: '600',
  },
  summarizePricesBox: {
    borderStyle: 'solid',
    borderColor: '#E4E7FF',
    flexWrap: 'wrap',
    borderBottomWidth: 0,
    marginBottom: 17,
  },
  priceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceItemMargin: {
    marginBottom: 10,
  },
  priceItemBox: {
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#E4E7FF',
  },
  totalPricesBox: {
    marginTop: 12,
  },
  textInTotalPricesBox: {
    fontSize: 17,
  },
  activeTextInTotalPricesBox: {
    color: '#50429B',
    fontWeight: '700',
  },
  checkoutBox: {
    position: 'absolute',
    bottom: 0,
    zIndex: 9,
    height: 100,
    paddingLeft: 16,
    paddingRight: 16,
    width: windowWidth,
    alignItems: 'center',
    flexDirection: 'row',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: '#ffffff',
    justifyContent: 'space-between',
  },
  totalPriceBoxInCheckoutBox: {
    height: '100%',
    justifyContent: 'center',
  },
  totalPriceTextInCheckoutBox: {
    fontSize: 13,
    color: '#898A8D',
    fontWeight: '600',
  },
  totalPriceNumberInCheckoutBox: {
    fontSize: 20,
    color: '#50429B',
    fontWeight: '700',
    lineHeight: 0,
  },
  checkoutButtonContainer: {
    width: 180,
    height: 49,
    borderRadius: 8,
    backgroundColor: '#FF8C21',
  },
  disableStyleButton: {
    backgroundColor: '#ff8c2169',
  },
  textInCheckoutButton: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  separator: {
    marginBottom: 16,
  },
  methodItemBox: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#f0f0f0f0',
    padding: 5,
    marginBottom: 10,
  },
  lastMethodItemBox: {
    marginBottom: 0,
  },
  textInMethodItemBox: {
    fontSize: 15,
    marginLeft: 16,
  },
  imgInMethodItemBox: {
    height: 32,
    width: 32,
    resizeMode: 'contain',
  },
  selectedTextBox: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    maxWidth: 80,
  },
  transparentBox: {
    zIndex: 0,
    width: windowWidth,
    height: windowHeight,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  contentBoxInModal: {
    width: windowWidth,
    height: windowHeight,
    backgroundColor: '#F5F5F5',
  },
  itemInContentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 52,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingLeft: 16,
    paddingRight: 16,
    marginBottom: 16,
    marginLeft: 16,
    marginRight: 16,
  },
  headerTitleBoxInModal: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 24,
    marginTop: 20,
  },
  leftArrowInHeaderTitleBox: {
    marginRight: 15,
    marginLeft: 16,
  },
  textInHeaderTitleBox: {
    fontSize: 17,
  },
  leftSectionOfItemInContentBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textCenter: {
    textAlign: 'center',
  },
  textInSelectedTextBox: {
    fontSize: 15,
    lineHeight: 20,
    color: '#979797',
    fontWeight: '600',
    fontFamily: 'Nunito',
  },
  textCheckoutItems: {
    color: '#50429B',
  },
  textFeeValue: {
    fontSize: 13,
    lineHeight: 18,
    color: '#FF8C21',
    fontWeight: '500',
    fontFamily: 'Nunito',
  },
  viewCheckDeliveryMethod: {
    width: 30,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },

  viewItemRight: {
    flexDirection: 'row',
  },

  btnComfirmDeliveryMethod: {
    height: 48,
    backgroundColor: '#50429B',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
    marginRight: 16,
  },

  disabledComfirmDeliveryMethod: {
    backgroundColor: '#DDDDDD',
  },
  textBtnomfirmDeliveryMethod: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 17,
    lineHeight: 23,
    fontFamily: 'Nunito',
  },

  textNote: {
    fontSize: 15,
    lineHeight: 20,
    color: '#000000',
    fontWeight: '400',
    overflow: 'hidden',
    width: windowWidth - 150,
  },

  textNoteProduct: {
    fontSize: 13,
    lineHeight: 18,
    color: '#979797',
    fontWeight: '400',
    fontFamily: 'Nunito',
  },

  textComboProduct: {
    fontSize: 15,
    marginLeft: 10,
    marginRight: 16,
    lineHeight: 18,
    color: '#A3A4A6',
    fontWeight: '400',
    fontStyle: 'normal',
    fontFamily: 'Nunito',
  },

  textNoteComboProduct: {
    fontSize: 15,
    color: '#50429B',
    fontFamily: 'Nunito',
  },
  confirmShippingMethodBtn: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  deliveryMethodContainer: {
    height:
      Platform.OS === Platforms.ANDROID
        ? windowHeight - 100
        : windowHeight - 150,
    justifyContent: 'space-between',
  },

  viewAhamoveNotWorking: {
    height: 48,
    marginLeft: 16,
    marginRight: 16,
    borderRadius: 16,
    marginBottom: 19,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#293450',
  },

  textAhamoveNotWorking: {
    fontSize: 15,
    marginLeft: 9,
    lineHeight: 20,
    color: '#FFFFFF',
    fontWeight: '400',
    fontFamily: 'Nunito',
  },
});

export default styles;
