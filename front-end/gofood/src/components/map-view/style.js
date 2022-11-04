import {Dimensions, StyleSheet} from 'react-native';
const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  iconChooseLocation: {
    top: '50%',
    left: '50%',
    marginTop: -102,
    marginLeft: -12,
    position: 'absolute',
  },

  viewFooter: {
    height: 142,
    marginLeft: 16,
    marginRight: 16,
    justifyContent: 'center',
  },

  viewSelectedLocation: {
    height: 60,
    paddingLeft: 16,
    paddingRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F3F2',
  },

  viewConfirm: {
    height: 50,
    marginTop: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#50429B',
  },

  textConfirm: {
    fontSize: 17,
    lineHeight: 23,
    color: '#FFFFFF',
    fontWeight: '700',
  },

  textAddress: {
    marginLeft: 16,
  },
});

export default styles;
