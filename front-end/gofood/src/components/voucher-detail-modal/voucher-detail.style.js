import {StyleSheet} from 'react-native';

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
    paddingRight: 16,
    position: 'absolute',
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    backgroundColor: 'white',
  },

  viewBack: {
    width: 38,
    height: 38,
    marginTop: -54,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },

  viewIconDiscount: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconDiscount: {
    width: 159,
    height: 159,
    marginTop: -80,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },

  colorIconDiscount: {
    backgroundColor: '#50429B',
  },

  colorIconPercent: {
    backgroundColor: '#FF8C21',
  },

  voucher: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#C1C1C1',
  },

  voucherName: {
    fontSize: 24,
    marginTop: 20,
    lineHeight: 33,
    marginBottom: 8,
    color: '#000000',
    fontWeight: '700',
    alignSelf: 'center',
  },

  discountType: {
    fontSize: 15,
    lineHeight: 20,
    color: '#898A8D',
    fontWeight: '400',
    alignSelf: 'center',
  },

  title: {
    fontSize: 15,
    lineHeight: 20,
    marginLeft: 16,
    color: '#50429B',
    fontWeight: '700',
    marginBottom: 12,
  },

  textItem: {
    fontSize: 15,
    lineHeight: 20,
    marginLeft: 24,
    color: '#000000',
    fontWeight: '400',
  },

  textItemDetail: {
    fontSize: 15,
    lineHeight: 20,
    marginLeft: 46,
    color: '#FF8C21',
    fontWeight: '700',
  },

  viewItem: {
    marginTop: 12,
    marginLeft: 18,
    flexDirection: 'row',
  },

  textItemAdditionalConditions: {
    fontSize: 15,
    lineHeight: 20,
    marginLeft: 12,
    color: '#000000',
    fontWeight: '400',
  },

  viewItemPurchase: {
    flexDirection: 'row',
  },

  viewFooter: {
    marginTop: 12,
    marginBottom: 12,
  },

  viewDiscountAmount: {
    marginTop: 6,
    borderRadius: 5,
    flexDirection: 'row',
    alignSelf: 'center',
  },

  discountAmount: {
    padding: 2,
    fontSize: 15,
    lineHeight: 20,
    paddingLeft: 8,
    borderRadius: 5,
    paddingRight: 8,
    color: '#FFFFFF',
    fontWeight: '400',
  },

  bgPercent: {
    backgroundColor: '#FF8C21',
  },

  bgDiscoutValue: {
    backgroundColor: '#50429B',
  },
});

export default styles;
