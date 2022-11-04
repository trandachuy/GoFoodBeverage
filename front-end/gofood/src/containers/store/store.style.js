import {StyleSheet} from 'react-native';
import {ifIphoneX} from 'react-native-iphone-x-helper';
import {windowHeight, windowWidth} from '../../utils/dimensions';

const styles = StyleSheet.create({
  searchBox: {
    paddingLeft: 16,
    paddingRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  sortWrapper: {
    width: 120,
    marginRight: 16,
  },
  filterWrapper: {
    width: windowWidth - 168,
  },
  cardWrapper: {
    alignItems: 'center',
    ...ifIphoneX(
      {
        maxHeight: windowHeight - 158,
      },
      {
        maxHeight: windowHeight - 118,
      },
    ),
  },
  buttonWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
