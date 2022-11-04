import {Dimensions, StyleSheet} from 'react-native';
import {windowHeight, windowWidth} from '../../utils/dimensions';

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  filterIconBox: {
    marginRight: 24,
  },
  searchBox: {
    marginTop: 20,
    paddingLeft: 16,
    paddingRight: 16,
  },
  searchInput: {
    backgroundColor: '#F2F3F2',
  },
  orderItemBox: {
    margin: 16,
    paddingTop: 16,
    paddingLeft: 16,
    minHeight: 100,
    marginBottom: 0,
    borderRadius: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
  },
  storeImg: {
    width: 50,
    height: 41,
    marginRight: 24,
  },
  rowInOrderBox: {
    marginLeft: 24,
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastRowInOrderBox: {
    marginTop: 4,
    marginBottom: 0,
  },
  defaultText: {
    fontSize: 13,
    fontWeight: '400',
    fontStyle: 'normal',
    fontFamily: 'Nunito',
  },
  orderStatusText: {
    marginRight: 5,
    color: '#50429B',
    fontWeight: '700',
  },
  orderStatusTextConfirm: {
    marginRight: 5,
    color: '#FF8C21',
    fontWeight: '700',
  },
  orderStatusTextProcessing: {
    marginRight: 5,
    color: '#FC0D1B',
    fontWeight: '700',
  },
  orderStatusTextDelivering: {
    marginRight: 5,
    color: '#376AED',
    fontWeight: '700',
  },
  orderStatusTextCompleted: {
    marginRight: 5,
    color: '#50429B',
    fontWeight: '700',
  },
  orderStatusTextDraft: {
    marginRight: 5,
    color: '#A5ABDE',
    fontWeight: '700',
  },
  orderStatusTextCancel: {
    marginRight: 5,
    color: '#C7C7C7',
    fontWeight: '700',
  },
  orderDateText: {
    marginLeft: 5,
    color: '#979797',
  },
  storeName: {
    fontSize: 15,
    color: '#000000',
    fontWeight: '700',
  },
  priceText: {
    marginRight: 5,
  },
  transparentBox: {
    zIndex: 0,
    width: windowWidth,
    height: windowHeight,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  filterBox: {
    top: 52,
    right: -windowWidth,
    paddingTop: 38,
    paddingLeft: 24,
    paddingRight: 12,
    borderRadius: 30,
    paddingBottom: 16,
    position: 'absolute',
    width: windowWidth - 76,
    height: windowHeight - 76,
    backgroundColor: '#F2F2F2',
  },
  rowOfFilterItem: {
    marginBottom: 50,
  },
  groupNameOfFilterItem: {
    fontSize: 17,
    lineHeight: 18,
    fontWeight: '700',
    color: '#000000',
  },
  controlGroupInFilterItem: {
    minHeight: 40,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  controlItemInGroup: {
    minWidth: 50,
    marginTop: 16,
    marginRight: 8,
    borderRadius: 10,
    paddingTop: 10,
    paddingLeft: 8,
    paddingRight: 8,
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  activeControlItemInGroup: {
    backgroundColor: '#50429B',
  },
  textInControlItemInGroup: {
    fontSize: 15,
    color: '#000000',
  },
  activeTextInControlItemInGroup: {
    color: '#ffffff',
  },
  buttonBoxInFilterBox: {
    left: 16,
    bottom: 16,
    position: 'absolute',
  },
  buttonInFilterBox: {
    borderRadius: 12,
    width: windowWidth - 108,
    backgroundColor: '#50429B',
  },
  textInButtonInFilterBox: {
    fontSize: 17,
    color: '#ffffff',
    fontWeight: '700',
  },
  badgeBox: {
    top: -4,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 50,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3001D',
  },
  textInBadgeBox: {
    fontSize: 11,
    color: '#ffffff',
    fontWeight: '700',
    textAlign: 'center',
  },
  questionImage: {
    width: 67,
    height: 67,
  },
  astronautImage: {
    width: 151,
    height: 273,
    position: 'absolute',
    bottom: 189,
    zIndex: 1,
    left: (windowWidth - 151) / 2,
  },
  moonImage: {
    maxWidth: windowWidth,
    height: 302,
    resizeMode: 'stretch',
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 0,
  },
  dateControlBox: {
    height: 40,
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 10,
    paddingRight: 8,
    paddingLeft: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: windowWidth - 124,
    backgroundColor: '#ffffff',
  },
  leftTextInDateControlBox: {
    fontSize: 16,
    color: '#9F9F9F',
  },
  rightTextBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  textInRightTextBox: {
    fontSize: 17,
    marginRight: 16,
    color: '#50429B',
    fontWeight: '700',
    textAlign: 'right',
  },
  lastDateControlBox: {
    marginTop: 0,
    marginBottom: 0,
  },
  calendarPickerBox: {
    marginBottom: 50,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  spaceWhenCalendarHasBeenOpened: {
    marginBottom: 8,
  },
  hide: {
    display: 'none',
  },
});

export default styles;
