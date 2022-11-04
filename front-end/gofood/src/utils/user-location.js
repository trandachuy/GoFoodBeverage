import {DEFAULT_LOCATION} from '../constants/google.constant';

// Get User's location (Lat-Lng) when user don't open GoogleMap:
// 1 - currentCustomerAddress(LocalStorage)
// 2 - Default location
const getUserLocation = currentCustomerAddress => {
  let lat = currentCustomerAddress?.lat ?? DEFAULT_LOCATION.StepMedia.Lat;
  let lng = currentCustomerAddress?.lng ?? DEFAULT_LOCATION.StepMedia.Lng;

  return {
    lat,
    lng,
  };
};

const UserLocation = {
  getUserLocation,
};

export default UserLocation;
