import {Dimensions, StyleSheet} from 'react-native';

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
    width: '80%',
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftRowBox: {
    width: 24,
    height: 29,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    marginLeft: 16,
    marginRight: 16,
  },
  textContentBox: {
    height: 29,
    marginRight: 16,
  },
  textInfo: {
    fontFamily: 'Baloo Chettan 2',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 20,
    color: '#000000',
  },
});

export default styles;
