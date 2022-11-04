import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  contaner: {
    flex: 1,
    padding: 16,
    paddingLeft: 13,
    paddingRight: 13,
  },

  viewProductItem: {
    marginBottom: 16,
    flexDirection: 'row',
  },

  textPriceName: {
    fontSize: 15,
    lineHeight: 20,
    color: '#000000',
    fontWeight: '700',
    fontFamily: 'Nunito',
  },

  textPriceValue: {
    fontSize: 15,
    marginRight: 9,
    lineHeight: 20,
    color: '#000000',
    fontWeight: '700',
    fontFamily: 'Nunito',
  },

  textPriceDiscount: {
    fontSize: 13,
    lineHeight: 18,
    color: '#C1C1C1',
    fontWeight: '400',
    textDecorationLine: 'line-through',
  },

  viewUpdateQuantity: {
    marginBottom: 12,
    flexDirection: 'row',
  },

  viewQuantity: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textQuantity: {
    fontSize: 15,
    lineHeight: 20,
    color: '#000000',
    fontWeight: '700',
  },

  viewCheckout: {
    height: 77,
    alignItems: 'center',
    flexDirection: 'row',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },

  checkout: {
    height: 44,
    width: 275,
    marginLeft: 30,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF8C21',
  },

  disabledViewCheckout: {
    backgroundColor: '#ff8c2169',
  },

  textTotal: {
    fontSize: 17,
    lineHeight: 23,
    color: '#FFFFFF',
    fontWeight: '700',
  },

  textCheckout: {
    fontSize: 17,
    lineHeight: 23,
    color: '#FFFFFF',
    fontWeight: '400',
  },

  iconCart: {
    width: 30,
    height: 30,
  },

  imageProduct: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },

  viewProductPrice: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  bagIcon: {
    left: 8,
    bottom: 8,
    position: 'absolute',
  },
  heartInCartBox: {
    top: 10,
    right: 8,
    width: 24,
    height: 20,
    marginTop: -20,
    marginRight: -20,
    position: 'absolute',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  textHeart: {
    zIndex: 1,
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '700',
    fontStyle: 'normal',
    fontFamily: 'Nunito',
    position: 'absolute',
  },

  viewNote: {
    maxHeight: 200,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#F9F9FF',
  },

  textToppingOption: {
    fontSize: 15,
    lineHeight: 20,
    color: '#838383',
    fontWeight: '400',
    fontFamily: 'Nunito',
    marginLeft: 5,
  },

  viewProduct: {
    backgroundColor: '#FFFFFF',
    marginTop: 12,
    marginBottom: 12,
    borderRadius: 10,
    padding: 16,
    marginLeft: 3,
    marginRight: 3,
    ...Platform.select({
      ios: {
        shadowColor: '#50429B',
        backgroundColor: '#FFFFFF',
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1,
      },
      android: {
        shadowColor: '#50429B',
        backgroundColor: '#FFFFFF',
        shadowOffset: {
          height: 5,
        },
        shadowOpacity: 9,
        shadowRadius: 9,
        elevation: 2,
      },
    }),
  },

  inputNote: {
    fontSize: 13,
    marginLeft: 16,
    marginRight: 16,
    lineHeight: 18,
    color: '#A3A4A6',
    fontWeight: '400',
    fontStyle: 'normal',
    fontFamily: 'Nunito',
    marginTop: 4,
    marginBottom: 4,
  },

  textProductName: {
    fontSize: 15,
    lineHeight: 20,
    marginLeft: 5,
    color: '#000000',
    fontWeight: '500',
    fontFamily: 'Nunito',
  },

  textToppingName: {
    fontSize: 15,
    lineHeight: 20,
    marginLeft: 15,
    color: '#838383',
    fontWeight: '400',
    fontFamily: 'Nunito',
  },

  viewAddressItem: {
    paddingLeft: 18,
    borderRadius: 16,
    marginBottom: 15,
    paddingRight: 16,
    backgroundColor: '#FFF',
    shadowColor: '#999',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    flexDirection: 'row',
    marginLeft: 16,
    marginRight: 16,
  },

  rowBack: {
    flex: 1,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  backRightBtnRight: {
    right: 10,
  },

  backRightBtnLeft: {
    right: 50,
  },

  backRightBtn: {
    top: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },

  viewDelete: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FFE9E9',
  },

  textProductNote: {
    fontSize: 15,
    marginLeft: 15,
    marginRight: 16,
    lineHeight: 18,
    color: '#A3A4A6',
    fontWeight: '400',
    fontStyle: 'normal',
    fontFamily: 'Nunito',
    marginTop: 4,
    marginBottom: 4,
  },
});

export default styles;
