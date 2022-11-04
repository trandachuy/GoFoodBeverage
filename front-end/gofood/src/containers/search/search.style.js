import {StyleSheet} from 'react-native';
import {windowWidth} from '../../utils/dimensions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  rowSearch: {
    width: '100%',
    height: 48,
    display: 'flex',
    flexDirection: 'row',
    marginTop: -10,
    marginRight: 16,
    flex: 40,
  },
  viewInput: {
    marginTop: 0,
    width: '100%',
    height: 52,
    borderWidth: 2,
    borderRadius: 16,
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: '#F2F3F2',
    justifyContent: 'flex-start',
    backgroundColor: '#F2F3F2',
    marginRight: 20,
  },
  inputSearchContainer: {
    backgroundColor: '#F2F3F2',
    borderRadius: 15,
    width: windowWidth - 70,
  },
  inputSearchStyle: {
    width: windowWidth - 70,
  },
  iconSearch: {
    marginLeft: 15,
    marginRight: 15,
  },

  textSizeInput: {
    fontSize: 15,
    lineHeight: 20,
    color: '#7C7C7C',
    fontWeight: '400',
    fontFamily: 'Nunito',
  },
  rightIconBox: {
    position: 'absolute',
    right: 16,
  },
  searchResult: {
    flex: 1,
  },
  noDataFound: {
    color: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  defaultSearchContainer: {
    height: '100%',
    flex: 1,
    paddingTop: 16,
  },
  historyContainer: {
    minHeight: 100,
    marginBottom: 20,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  noStoreFoundText: {
    color: '#888888',
    fontFamily: 'Nunito',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 20,
  },
  historyHeader_Title: {
    color: '#888888',
    fontFamily: 'Nunito',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 15,
    lineHeight: 20,
  },
  clearAllButton: {
    fontFamily: 'Nunito',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 15,
    lineHeight: 20,
    color: '#50429B',
  },
  historyBody: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  keySearchItem: {
    height: 36,

    marginRight: 16,
    marginVertical: 8,
    padding: 8,

    backgroundColor: '#EFF1FF',
    borderRadius: 8,

    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  keySearchItem_Text: {
    height: '100%',
    justifyContent: 'center',
    fontFamily: 'Nunito',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 15,
    lineHeight: 18,
  },
  keySearchItem_DeleteButton: {
    height: 36,
    width: 36,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'red',
    marginRight: -8,
  },
  recommendContainer: {
    minHeight: 100,
  },
  recommendHeader: {
    marginBottom: 16,
    color: '#888888',
    fontFamily: 'Nunito',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 15,
    lineHeight: 20,
  },
  recommendBody: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  loadingData: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 99,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
});

export default styles;
