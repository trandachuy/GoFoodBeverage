import {Dimensions, StyleSheet} from 'react-native';

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: width - 32,
    height: 96,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginLeft: 16,
    marginRight: 16,
  },
  imgBox: {
    width: 96,
    height: 96,
    marginRight: 16,
    shadowColor: '#F7FBFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 3.84,
    borderRadius: 10,
  },
  imgBox_Img: {
    width: 96,
    height: 96,
    resizeMode: 'contain',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  contentBox: {
    backgroundColor: '#FFFFFF',
    width: width - 144,
    height: 96,
    paddingLeft: 16,
    paddingTop: 8,
    paddingRight: 16,
    paddingBottom: 8,
    justifyContent: 'space-between',
    shadowColor: '#F7FBFF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#f7f7f7',
  },
  storeName: {
    fontFamily: 'Nunito',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 15,
    lineHeight: 20,
    color: '#000000',
  },
  locationInfo: {
    minHeight: 30,
    flexDirection: 'row',
  },
  ratingBox: {
    flexDirection: 'row',
    width: 40,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 13,
  },
  locationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBox: {
    width: 24,
    height: 24,
  },
  textInfo: {
    fontFamily: 'Nunito',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    color: '#9D9D9D',
  },
  promotionBox: {
    backgroundColor: '#FF8C21',
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
    position: 'absolute',
    right: 0,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  promotionText: {
    fontFamily: 'Nunito',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 12,
    lineHeight: 16,
    color: '#FFFFFF',
  },
});

export default styles;
