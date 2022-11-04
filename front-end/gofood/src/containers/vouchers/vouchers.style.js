import {StyleSheet, Platform} from 'react-native';
import {windowWidth} from '../../utils/dimensions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 76,
    marginTop: 16,
    backgroundColor: '#F7FBFF',
  },

  viewVoucher: {
    paddingLeft: 16,
    paddingRight: 16,
    marginBottom: 16,
    flexDirection: 'row',
  },

  viewVoucherItem: {
    width: '100%',
    elevation: 9,
    paddingBottom: 12,
    borderLeftWidth: 8,
    flexDirection: 'row',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 5,
    borderLeftColor: '#50429B',
    backgroundColor: '#FFFFFF',
    borderBottomRightRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#BABABA',
        backgroundColor: '#FFFFFF',
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 3,
      },
      android: {
        elevation: 9,
      },
    }),
  },

  viewPromo: {
    padding: 25,
    alignSelf: 'center',
  },

  iconPromoPercent: {},

  namePromo: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 20,
    color: '#000000',
    fontWeight: '700',
  },

  infoPromo: {
    fontSize: 13,
    lineHeight: 18,
    color: '#898A8D',
    fontWeight: '400',
  },

  viewDiscountAmount: {
    marginTop: 6,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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

  bgDiscountValue: {
    backgroundColor: '#50429B',
  },

  astronautImage: {
    zIndex: 1,
    width: 151,
    height: 273,
    bottom: 189,
    position: 'absolute',
    left: (windowWidth - 151) / 2,
  },

  moonImage: {
    left: 0,
    bottom: 0,
    zIndex: 0,
    height: 302,
    position: 'absolute',
    maxWidth: windowWidth,
    resizeMode: 'stretch',
  },
  voucherInfoBox: {
    width: windowWidth - 156,
  },
  isUsedText: {
    color: '#50429B',
    fontWeight: '700',
    fontSize: 15,
    fontStyle: 'normal',
    fontFamily: 'Nunito',
  },
});

export default styles;
