import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import {GOOGLE_API} from '../constants/google.constant';

export const getCurrentLocationByGps = () =>
  new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      //It will give you the current location.
      position => {
        //get the current Longitude from the location JSON.
        const log = JSON.stringify(position.coords.longitude);
        //get the current Latitude from the location JSON.
        const lat = JSON.stringify(position.coords.latitude);

        Geolocation.getCurrentPosition(async () => {
          Geocoder.init(GOOGLE_API);
          await Geocoder.from(lat, log).then(json => {
            json.results[0].address_components.forEach((value, index) => {
              let location = json.results[0].geometry.location;
              let addressDetail = {
                isSuccess: true,
                address: json.results[0].formatted_address,
                lat: location?.lat,
                lng: location?.lng,
              };
              resolve(addressDetail);
            });
          });
        });
      },
      error => {
        console.log(error.message);
        resolve({isSuccess: false});
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
      },
    );
  });

export const getCurrentCountryByGps = () =>
  new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      //It will give you the current location.
      position => {
        //get the current Longitude from the location JSON.
        const log = JSON.stringify(position.coords.longitude);
        //get the current Latitude from the location JSON.
        const lat = JSON.stringify(position.coords.latitude);

        Geolocation.getCurrentPosition(async () => {
          Geocoder.init(GOOGLE_API);
          await Geocoder.from(lat, log).then(json => {
            let addressDetails = json.results[0].address_components;
            if (
              addressDetails?.length > 0 &&
              addressDetails[addressDetails.length - 1]
            ) {
              let address = addressDetails[addressDetails.length - 1];
              resolve({
                countryName: address.long_name,
                countryCode: address.short_name,
              });
            }
          });
        });
      },
      error => {
        console.log(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
      },
    );
  });

export const getLocationByAddress = async address => {
  Geocoder.init(GOOGLE_API);
  const json = await Geocoder.from(address);
  return json.results[0].geometry.location;
};

export const getDistanceBetweenPoints = async (origins, destinations) => {
  let distanceObj = {};
  var api = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${origins.lat},${origins.lng}&destinations=${destinations.lat},${destinations.lng}&key=${GOOGLE_API}`;
  await fetch(api)
    .then(res => res.json())
    .then(data => {
      distanceObj = data.rows[0].elements[0].distance;
    });
  return distanceObj;
};

export const getAddressDetailByLatLng = async (lat, lng) => {
  let addressDetail = {};
  Geocoder.init(GOOGLE_API);
  await Geocoder.from(lat, lng)
    .then(json => {
      addressDetail = {
        lat: json.results[0].geometry.location.lat,
        lng: json.results[0].geometry.location.lng,
        name: json.results[0].formatted_address,
      };
    })
    .catch(error => console.warn(error));
  return addressDetail;
};
