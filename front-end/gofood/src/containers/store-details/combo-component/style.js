import {Platform, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  comboName: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 12,
    color: '#000000',
    fontWeight: '700',
    fontStyle: 'normal',
    fontFamily: 'Nunito',
  },

  viewLeft: {
    flex: 4,
    padding: 2,
    marginRight: 8,
    paddingLeft: 16,
    borderRadius: 10,
    marginLeft: 3,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#50429B',
        backgroundColor: '#FFFFFF',
        shadowOffset: {
          height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,
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

  productName: {
    fontSize: 15,
    lineHeight: 20,
    color: '#000000',
    fontWeight: '500',
    fontStyle: 'normal',
    fontFamily: 'Nunito',
  },

  productPromo: {
    flex: 1,
    height: 26,
    alignItems: 'center',
    borderTopRightRadius: 8,
    justifyContent: 'center',
    borderBottomLeftRadius: 8,
    backgroundColor: '#FF8C21',
  },

  textPromo: {
    fontSize: 13,
    lineHeight: 18,
    color: '#FFFFFF',
    fontWeight: '400',
    fontStyle: 'normal',
    fontFamily: 'Nunito',
  },

  productOriginal: {
    fontSize: 15,
    lineHeight: 18,
    marginLeft: 16,
    color: '#C1C1C1',
    fontWeight: '400',
    fontStyle: 'normal',
    fontFamily: 'Nunito',
    textDecorationLine: 'line-through',
  },

  viewProduct: {
    height: 30,
    flexDirection: 'row',
  },

  viewProductName: {
    flex: 3,
    marginTop: 6,
  },

  productDiscount: {
    fontSize: 15,
    lineHeight: 20,
    color: '#50429B',
    fontWeight: '700',
    fontStyle: 'normal',
    fontFamily: 'Nunito',
  },

  viewProductDiscount: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },

  viewAdd: {
    paddingTop: 5,
    paddingLeft: 12,
    borderRadius: 8,
    paddingBottom: 5,
    paddingRight: 12,
    alignItems: 'center',
    backgroundColor: '#50429B',
  },

  textAdd: {
    fontSize: 13,
    lineHeight: 18,
    color: '#FFFFFF',
    fontWeight: '400',
    fontStyle: 'normal',
    fontFamily: 'Nunito',
  },

  viewBtn: {
    marginLeft: 8,
  },

  viewBtnAdd: {
    flex: 1,
    paddingLeft: 5,
    justifyContent: 'flex-end',
  },

  productItem: {
    marginBottom: 16,
    flexDirection: 'row',
  },

  quantityProduct: {
    flex: 1,
    marginRight: 12,
    alignItems: 'flex-end',
  },

  textQuantityProduct: {
    fontSize: 15,
    lineHeight: 20,
    color: '#E94544',
    fontWeight: '700',
    fontFamily: 'Nunito',
  },

  descriptionProduct: {
    fontSize: 13,
    color: '#C1C1C1',
    fontFamily: 'Nunito',
  },

  viewDetailDiscount: {
    flex: 2,
    flexDirection: 'row',
  },

  viewThumbnail: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },

  textComboProduct: {
    color: '#A5ABDE',
    fontSize: 13,
    fontFamily: 'Nunito',
    lineHeight: 17,
  },
});

export default styles;
