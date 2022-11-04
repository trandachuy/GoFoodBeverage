import {Platform, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(52, 52, 52, 0.3)',
  },

  form: {
    bottom: 0,
    width: '100%',
    height: '85%',
    paddingLeft: 16,
    position: 'absolute',
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    backgroundColor: 'white',
  },

  viewBack: {
    zIndex: 1,
    width: 38,
    height: 38,
    marginTop: -54,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },

  viewImageProduct: {
    marginTop: -80,
    alignItems: 'center',
    justifyContent: 'center',
  },

  imageProduct: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#FFFFFF',
  },

  viewTitleProduct: {
    alignItems: 'center',
  },

  titleProduct: {
    fontSize: 24,
    marginTop: 16,
    lineHeight: 33,
    color: '#000000',
    fontWeight: '700',
    fontFamily: 'Nunito',
  },

  viewProductPrices: {
    marginTop: 24,
    marginBottom: 20,
    alignItems: 'center',
  },

  viewProductPrice: {
    width: 124,
    height: 83,
    marginRight: 16,
    borderRadius: 12,
    backgroundColor: '#F0EEFA',
  },

  viewTextProductPrice: {
    alignItems: 'center',
  },

  bgProductPriceSelected: {
    ...Platform.select({
      ios: {
        shadowColor: '#BABABA',
        backgroundColor: '#6654C9',
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 3,
      },
      android: {
        elevation: 5,
        backgroundColor: '#6654C9',
      },
    }),
  },

  colorProductPriceSelected: {
    color: '#FFFFFF',
  },

  productPriceNameSingle: {
    margin: 4,
    width: 116,
    height: 35,
    marginTop: 11,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#50429B',
  },

  productPriceName: {
    margin: 4,
    width: 116,
    height: 35,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },

  textProductPriceName: {
    fontSize: 15,
    lineHeight: 20,
    color: '#6654C9',
    fontWeight: '700',
    fontFamily: 'Nunito',
  },

  productPrice: {
    fontSize: 15,
    lineHeight: 20,
    color: '#6654C9',
    fontWeight: '700',
    fontFamily: 'Nunito',
  },

  txtOption: {
    fontSize: 17,
    lineHeight: 23,
    color: '#000000',
    fontWeight: '700',
    marginBottom: 16,
    fontFamily: 'Nunito',
  },

  viewOption: {
    flex: 1,
    paddingRight: 16,
  },

  viewOptionName: {
    width: 70,
    height: 29,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    fontFamily: 'Nunito',
    alignItems: 'center',
    borderColor: '#50429B',
    justifyContent: 'center',
  },

  textOptionName: {
    fontSize: 15,
    lineHeight: 20,
    color: '#50429B',
    fontWeight: '700',
    fontFamily: 'Nunito',
  },

  viewOptionLevel: {
    paddingTop: 8,
    borderRadius: 12,
    paddingBottom: 8,
    marginBottom: 20,
    backgroundColor: '#F8F8F8',
  },

  textOptionLevelName: {
    fontSize: 15,
    lineHeight: 20,
    marginRight: 12,
    color: '#151515',
    fontWeight: '400',
    fontFamily: 'Nunito',
  },

  defaultTrue: {
    color: '#50429B',
    fontWeight: '700',
  },

  txtTopping: {
    fontSize: 17,
    lineHeight: 23,
    color: '#000000',
    fontWeight: '700',
    fontFamily: 'Nunito',
  },

  textToppingItem: {
    fontSize: 15,
    lineHeight: 20,
    color: '#000000',
    fontWeight: '500',
    fontFamily: 'Nunito',
  },

  textToppingPrice: {
    fontSize: 15,
    lineHeight: 20,
    color: '#50429B',
    fontWeight: '500',
    fontFamily: 'Nunito',
  },

  textToppingQuantity: {
    fontSize: 15,
    lineHeight: 20,
    marginLeft: 21,
    marginRight: 21,
    color: '#000000',
    fontWeight: '700',
    fontFamily: 'Nunito',
  },

  textNote: {
    fontSize: 17,
    lineHeight: 23,
    marginBottom: 15,
    color: '#000000',
    fontWeight: '700',
    fontFamily: 'Nunito',
  },

  viewNote: {
    maxHeight: 200,
    marginRight: 16,
    borderRadius: 8,
    flexDirection: 'row',
    backgroundColor: '#F8F8F8',
  },

  vaildNote: {
    fontSize: 15,
    marginTop: 8,
    lineHeight: 20,
    marginBottom: 14,
    color: '#9D9D9D',
    fontWeight: '400',
    fontFamily: 'Nunito',
  },

  viewAddProduct: {
    paddingTop: 16,
    marginTop: 16,
    paddingRight: 16,
    marginLeft: -16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    justifyContent: 'center',
    marginTop: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#50429B',
        backgroundColor: '#FFFFFF',
        shadowOffset: {
          height: 2,
        },
        shadowOpacity: 3,
        shadowRadius: 5,
      },
      android: {
        elevation: 3,
      },
    }),
  },

  textAmount: {
    fontSize: 17,
    lineHeight: 23,
    color: '#000000',
    fontWeight: '700',
    fontFamily: 'Nunito',
  },

  productQuantity: {
    fontSize: 15,
    lineHeight: 20,
    marginLeft: 21,
    marginRight: 21,
    color: '#000000',
    fontWeight: '700',
  },

  viewBtnAdd: {
    height: 44,
    marginLeft: 16,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#FF8C21',
  },

  titleBtnAdd: {
    fontSize: 15,
    lineHeight: 20,
    color: '#FFFFFF',
    fontWeight: '400',
    fontFamily: 'Nunito',
  },

  total: {
    fontSize: 15,
    lineHeight: 20,
    color: '#FFFFFF',
    fontWeight: '700',
  },

  viewIconNote: {
    marginTop: 11,
    marginLeft: 19,
    marginRight: 16,
  },

  viewAmountProduct: {
    margin: 16,
    marginRight: 0,
    flexDirection: 'row',
  },

  viewPlusReduce: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  flex_1: {
    flex: 1,
  },

  viewPlusReduceTopping: {
    flex: 1,
    flexDirection: 'row',
  },

  viewTopping: {
    backgroundColor: '#F8F8F8',
    marginRight: 16,
    borderRadius: 12,
    paddingRight: 16,
    marginTop: 16,
    marginBottom: 20,
  },

  viewToppingItem: {
    padding: 16,
    flexDirection: 'row',
  },

  padding_16: {
    padding: 16,
    flexDirection: 'row',
  },

  inputNote: {
    minHeight: 38,
    fontSize: 15,
    width: '100%',
    color: '#A3A4A6',
    fontWeight: '400',
    fontStyle: 'normal',
    fontFamily: 'Nunito',
    marginRight: 10,
    lineHeight: 23,
    flex: 2,
  },

  borderStyleDotted: {
    borderRadius: 1,
    borderStyle: 'dotted',
    borderWidth: 1,
    borderColor: '#C1C1C1',
    marginHorizontal: 6,
  },

  viewAddCombo: {
    height: 100,
  },

  marginBottomTitleProduct: {
    marginBottom: 16,
    alignSelf: 'center',
  },
});

export default styles;
