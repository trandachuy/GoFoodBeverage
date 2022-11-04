import {Platform, StyleSheet} from 'react-native';
import {windowWidth} from '../../utils/dimensions';
const storeItemWidth = windowWidth / 2 - 22;
const categoryItem = (windowWidth - 70) / 3;

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  containerPadding: {
    paddingHorizontal: 16,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  flex_1: {
    flex: 1,
  },

  flex_2: {
    flex: 2,
  },

  flex_3: {
    flex: 3,
  },

  review: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },

  distance: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  viewMenu: {
    marginTop: 32,
    marginLeft: 5,
    marginRight: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  viewStores: {
    marginTop: 40,
    paddingBottom: 50,
    flexDirection: 'row',
    justifyContent: 'center',
  },

  storeItem: {
    height: storeItemWidth - 30,
  },

  imageStore: {
    marginTop: -50,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: '#FFFFFF',
    width: storeItemWidth - 16,
    height: storeItemWidth - 16,
  },

  viewPromo: {
    padding: 5,
    height: 26,
    alignItems: 'center',
    borderTopRightRadius: 8,
    justifyContent: 'center',
    borderBottomLeftRadius: 8,
    backgroundColor: '#FF8C21',
  },

  textPromo: {
    fontSize: 12,
    lineHeight: 16,
    color: '#FFFFFF',
    fontWeight: '700',
  },

  viewStore: {
    marginTop: 22,
    marginBottom: 10,
    flexDirection: 'row',
  },

  viewStoreItem: {
    marginTop: 10,
    marginRight: 10,
    borderWidth: 1,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 10,
    alignItems: 'center',
    width: storeItemWidth,
    height: storeItemWidth,
    borderColor: '#F0F4F9',
    ...Platform.select({
      ios: {
        shadowColor: '#50429B',
        backgroundColor: '#FFFFFF',
        shadowOffset: {
          height: 3,
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

  textRecommendStore: {
    fontSize: 15,
    lineHeight: 20,
    color: '#50429B',
    fontWeight: '700',
    fontFamily: 'Nunito',
  },

  row: {
    flex: 1,
    flexWrap: 'wrap',
    marginBottom: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },

  rowSearch: {
    display: 'flex',
    flexDirection: 'row',
  },

  address: {
    fontSize: 20,
    marginLeft: 13,
    color: '#50429B',
    fontWeight: 'bold',
    width: 200,
  },

  viewInput: {
    width: '100%',
    height: 52,
    borderWidth: 2,
    borderRadius: 16,
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: '#F2F3F2',
    justifyContent: 'center',
    backgroundColor: '#F2F3F2',
  },

  iconSearch: {
    marginLeft: 15,
    marginRight: 15,
  },

  textSizeInput: {
    fontSize: 15,
    lineHeight: 20,
    color: '#000000',
    fontWeight: '400',
    fontFamily: 'Nunito',
  },

  textReview: {
    fontSize: 13,
    marginLeft: 5,
    color: '#9D9D9D',
  },

  viewMenuItem: {
    borderRadius: 5,
    width: categoryItem,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
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
        elevation: 5,
      },
    }),
  },

  viewImageMenuItem: {
    position: 'relative',
    left: -10,
  },

  textMenuItem: {
    fontSize: 13,
    lineHeight: 18,
    color: '#000000',
    fontWeight: '500',
    alignSelf: 'center',
    fontFamily: 'Nunito',
  },

  textStoreName: {
    fontSize: 15,
    color: '#000000',
  },

  viewAllStore: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: 'flex-end',
  },

  textViewAll: {
    fontSize: 13,
    lineHeight: 18,
    color: '#50429B',
    fontWeight: '400',
    fontFamily: 'Nunito',
  },

  item: {
    width: windowWidth * 0.5,
    alignSelf: 'center',
  },

  image: {
    height: 180,
    borderRadius: 8,
    backgroundColor: 'red',
  },
});

export default styles;
