import {StyleSheet} from 'react-native';
import {windowHeight, windowWidth} from '../../utils/dimensions';

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
    width: windowWidth,
    height: windowHeight,
  },
  containerStoreInformation: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  containStoreInformation: {
    backgroundColor: '#ffffff',
    width: windowWidth,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    minHeight: '75%',
    zIndex: 2,
    elevation: 2,
    flexDirection: 'column',
  },
  storeInformation: {
    width: '100%',
    zIndex: 4,
    flex: 0.696,
  },
  viewStoreInformation: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 32,
    marginTop: 20,
  },
  containerImageBackground: {
    width: '100%',
    zIndex: 5,
    flex: 0.304,
  },
  homeIndicatorIcon: {
    marginTop: 8,
    alignItems: 'center',
    height: 20,
  },
  dropdownlistBranchesControl: {
    backgroundColor: '#50429B',
    color: '#fff',
    fontWeight: 700,
    borderRadius: 12,
    borderColor: '#50429B',
    position: 'relative',
  },
  textDropdownBranches: {
    fontSize: 17,
    color: '#fff',
    paddingLeft: 16,
    paddingRight: 16,
    fontWeight: '700',
  },
  iconDropdownBranches: {
    marginRight: 16,
  },
  textContainStoreInformation: {
    width: '100%',
    paddingBottom: 24,
    backgroundColor: '#fff',
  },
  groupText: {
    width: '100%',
    paddingLeft: 12,
    paddingRight: 12,
  },
  textContain: {
    fontSize: 15,
    flex: 0.87,
    alignItems: 'flex-start',
  },
  groupTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000000',
  },
  groupContain: {
    paddingTop: 20,
    flexDirection: 'row',
  },
  iconText: {
    flex: 0.13,
  },
  itemRange: {
    flex: 0.2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemContainerStyleDropdownStore: {
    backgroundColor: '#fff',
  },
  listItemLabelStyleDropdownStore: {
    color: '#0B0B0B',
    fontSize: 15,
    fontWeight: '400',
  },
  selectedItemLabelDropdownStore: {
    color: '#50429B',
    fontSize: 15,
  },
  storeNameText: {
    color: '#50429B',
    fontSize: 17,
    textAlign: 'left',
    fontWeight: '700',
  },
  dropDownContainerStyle: {
    borderColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 12,
    marginTop: 1,
  },
  viewStoreNameText: {
    width: '100%',
    marginTop: 10,
  },
});

export default styles;
