import {StyleSheet} from 'react-native';
import {windowWidth} from '../../utils/dimensions';
const storeItemWidth = windowWidth / 2 - 22;
const categoryItem = (windowWidth - 70) / 3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: '50%',
    alignItems: 'center',
  },

  label: {
    fontSize: 17,
    lineHeight: 23,
    color: '#000000',
    fontWeight: '700',
    fontFamily: 'Nunito',
  },
  button: {
    width: 287,
    height: 48,
    marginTop: 35,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#50429B',
  },
  text: {
    fontSize: 17,
    lineHeight: 23,
    color: '#FFFFFF',
    fontWeight: '700',
    fontFamily: 'Nunito',
  },
  loading: {
    marginTop: 50,
    justifyContent: 'flex-start',
  },
});

export default styles;
