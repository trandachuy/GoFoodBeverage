import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    minHeight: 50,
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
    // paddingBottom: 0,
  },
  resultItem: {
    flexDirection: 'row',
    width: '100%',
    height: 100,
  },

  itemThumbnail: {
    width: 96,
    flex: 1,
    height: '100%',
    margin: 2,
  },
  imgBox_Img: {
    height: 96,
    width: 96,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  itemPROMO: {
    position: 'absolute',
    padding: 5,
    top: 0,
    right: -15.5,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 8,

    fontFamily: 'Nunito',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 12,
    lineHeight: 16,

    backgroundColor: '#FF8C21',
    color: '#FFFFFF',
  },
  itemInfo: {
    flex: 3,
    marginLeft: 20,

    paddingVertical: 8,
    paddingHorizontal: 16,

    backgroundColor: '#fff',
    borderRadius: 10,
  },
  itemTitle: {
    flex: 2,
    width: '100%',
    fontFamily: 'Nunito',
    fontWeight: '400',
    color: '#000',
    // lineHeight: '20.46',
  },
  itemRatingDistance: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  itemRating: {
    flexDirection: 'row',
    width: 60,
    alignItems: 'center',
  },
  itemDistance: {
    flexDirection: 'row',
    width: 60,
    alignItems: 'center',
  },
  resultProducts: {
    minHeight: 70,
    width: '100%',
  },
  productItem: {
    height: 56,
    width: '100%',
    marginTop: 16,
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  productItem_ImageBox: {
    width: 96,
    height: 56,
  },
  productItem_Image: {
    height: '100%',
    borderRadius: 8,
    height: 39,
    width: 39,
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
  },
  productItem_Name: {
    flex: 3,
    backgroundColor: '#fff',
    marginLeft: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,

    borderRadius: 10,
    color: '#000',
  },
  productItem_Prices: {
    // color: '#000',
    flex: 1,
  },
  productItem_SellingPrices: {
    flexDirection: 'row',
  },
  nameUnmatch: {
    color: '#000000',
    fontWeight: '400',
    fontFamily: 'Nunito',
  },
  nameMatch: {
    color: '#FF8C21',
    fontWeight: '700',
    fontFamily: 'Nunito',
  },
  flex_start: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  lineThrough: {
    color: '#9D9D9D',
    textDecorationLine: 'line-through',
  },
});

export default styles;
