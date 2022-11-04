import {Dimensions, Platform, StyleSheet} from 'react-native';

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  viewFilterData: {
    padding: 16,
    flexDirection: 'row',
  },

  viewSort: {
    height: 32,
    marginRight: 16,
    width: width * 0.3,
  },

  viewFilter: {
    paddingRight: 16,
    width: width * 0.7 - 32,
  },

  viewFavoriteStore: {
    marginBottom: 24,
    flexDirection: 'row',
    marginLeft: 16,
  },

  viewLogo: {
    borderRadius: 10,
    alignItems: 'flex-end',
    width: width * 0.3 - 24,
    height: width * 0.3 - 24,
    backgroundColor: '#FFFFFF',
  },

  viewPromo: {
    width: 55,
    height: 26,
    alignItems: 'center',
    borderTopRightRadius: 8,
    justifyContent: 'center',
    borderBottomLeftRadius: 8,
    backgroundColor: '#FF8C21',
  },

  txtPromo: {
    fontSize: 12,
    lineHeight: 16,
    color: '#FFFFFF',
    fontWeight: '700',
    fontFamily: 'Nunito',
  },

  viewInfoStore: {
    width: width * 0.7 - 24,
    marginLeft: 16,
    marginRight: 16,
    borderRadius: 10,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#FFFFFF',
        backgroundColor: '#F7FBFF',
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
        elevation: 3,
      },
    }),
  },

  storeName: {
    fontSize: 15,
    lineHeight: 20,
    color: '#000000',
    fontWeight: '700',
    fontFamily: 'Nunito',
  },

  viewReview: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  review: {
    marginRight: 20,
  },
});

export default styles;
