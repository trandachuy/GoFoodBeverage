import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  viewContainer: {
    marginTop: 12,
  },

  viewHeader: {
    marginBottom: 24,
    alignItems: 'center',
  },

  title: {
    fontSize: 24,
    marginTop: 20,
    lineHeight: 33,
    marginBottom: 24,
    color: '#000000',
    fontWeight: '700',
    fontFamily: 'Nunito',
  },

  imageCombo: {
    width: 160,
    height: 160,
    borderRadius: 80,
  },

  imageProduct: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },

  price: {
    fontSize: 24,
    lineHeight: 33,
    color: '#6654C9',
    fontWeight: '700',
    fontFamily: 'Nunito',
  },

  viewProductItem: {
    padding: 8,
    marginLeft: 16,
    borderWidth: 1,
    marginRight: 16,
    borderRadius: 16,
    marginBottom: 24,
    flexDirection: 'row',
    borderColor: '#ECECEC',
    backgroundColor: '#FFFFFF',
  },

  productDetail: {
    flex: 1,
    marginLeft: 16,
  },

  detail: {
    flexDirection: 'row',
  },

  textProductName: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    color: '#6654C9',
    fontWeight: '700',
    fontFamily: 'Nunito',
  },

  textOption: {
    fontSize: 13,
    lineHeight: 18,
    color: '#C5C5C7',
    fontWeight: '400',
    fontFamily: 'Nunito',
  },

  viewFooter: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: '#FFFFFF',
  },

  viewQuantity: {
    padding: 16,
    flexDirection: 'row',
  },

  textQuantity: {
    fontSize: 17,
    lineHeight: 23,
    color: '#000000',
    fontWeight: '700',
    fontFamily: 'Nunito',
  },

  viewPlusReduce: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  productQuantity: {
    fontSize: 15,
    lineHeight: 20,
    marginLeft: 21,
    marginRight: 21,
    color: '#000000',
    fontWeight: '700',
    fontFamily: 'Nunito',
  },

  viewBtnAdd: {
    padding: 12,
    borderRadius: 8,
    paddingBottom: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#FF8C21',
    margin: 16,
    marginTop: 0,
  },

  disabledBtnAdd: {
    backgroundColor: '#ff8c2169',
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
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 16,
  },

  viewNoteDetail: {
    maxHeight: 200,
    borderRadius: 8,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
  },

  viewIconNote: {
    marginTop: 11,
    marginLeft: 19,
    marginRight: 16,
  },

  inputNote: {
    fontSize: 15,
    width: '100%',
    color: '#A3A4A6',
    fontWeight: '400',
    fontStyle: 'normal',
    fontFamily: 'Nunito',
    marginRight: 10,
    lineHeight: 23,
    flex: 2,
    minHeight: 38,
  },

  textOptionTopping: {
    fontSize: 15,
    color: '#838383',
    fontWeight: '400',
    fontStyle: 'normal',
    fontFamily: 'Nunito',
  },

  viewProductNote: {
    marginTop: 8,
    borderRadius: 8,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: '#F9F9FF',
  },

  textProductNote: {
    marginTop: 4,
    marginBottom: 4,
    color: '#8F8F8F',
  },
});

export default styles;
