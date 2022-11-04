import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 76,
    paddingLeft: 13,
    paddingRight: 16,
    backgroundColor: '#F7FBFF',
  },

  formStoreDetail: {
    flex: 3,
    height: 76,
  },

  textStoreName: {
    fontSize: 17,
    lineHeight: 23,
    color: '#50429B',
    fontWeight: '700',
    fontStyle: 'normal',
    fontFamily: 'Nunito',
  },

  viewStoreDetail: {
    flexDirection: 'row',
  },

  addressStore: {
    height: 48,
    paddingLeft: 8,
    borderRadius: 8,
    marginRight: 16,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },

  imageStore: {
    flex: 1,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
  },

  thumbnail: {
    width: 76,
    height: 76,
    borderRadius: 12,
    borderBottomLeftRadius: 0,
  },

  textAddressStore: {
    fontSize: 13,
    lineHeight: 18,
    color: '#777777',
    fontWeight: '400',
    fontStyle: 'normal',
    fontFamily: 'Nunito',
    alignItems: 'center',
  },

  reviewStore: {
    marginTop: 12,
    flexDirection: 'row',
  },

  viewVoucher: {
    padding: 8,
    height: 64,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginRight: 12,
  },

  formVoucher: {
    flexDirection: 'row',
  },

  discountVoucher: {
    fontSize: 15,
    lineHeight: 20,
    color: '#000000',
    fontWeight: '700',
    fontStyle: 'normal',
    fontFamily: 'Nunito',
  },

  infoVoucher: {
    fontSize: 13,
    lineHeight: 18,
    color: '#376AED',
    fontWeight: '400',
    textDecorationLine: 'underline',
  },

  formReview: {
    padding: 8,
    height: 64,
    marginRight: 12,
    borderRadius: 8,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },

  viewReview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  viewVoted: {
    alignItems: 'center',
  },

  viewLocation: {
    padding: 8,
    height: 64,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },

  formLocation: {
    flexDirection: 'row',
  },

  viewHeader: {
    width: '100%',
    paddingLeft: 16,
    paddingRight: 16,
    alignSelf: 'center',
    position: 'absolute',
  },

  viewHeaderRight: {
    flex: 3,
    marginRight: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  favoriteIcon: {
    marginRight: 16,
  },

  informationIcon: {
    marginRight: 16,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },

  viewBranchInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  viewMenu: {
    margin: 16,
    flexDirection: 'row',
    position: 'absolute',
  },

  viewMenuItem: {
    padding: 4,
    marginRight: 12,
    borderRadius: 8,
    paddingLeft: 12,
    paddingRight: 12,
    justifyContent: 'center',
  },

  textMenuItem: {
    fontSize: 13,
    lineHeight: 20,
    color: '#000000',
    fontWeight: '500',
    fontFamily: 'Nunito',
  },

  backgroundColorMenuItemCative: {
    backgroundColor: 'rgba(80, 66, 155, 0.1)',
  },

  colorMenuItemActive: {
    color: '#50429B',
  },
});

export default styles;
