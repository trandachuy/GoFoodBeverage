const isEmailOrPhoneNumber = value => {
  let pattern =
    /((^[0]{1}[1-9]{1}[0-9]{8,9}$)|(^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$))|((^(\+[0-9]{1,3})|(^([0-9]?)))(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7,10}$)/;
  return pattern.test(value);
};

const isEmailAddress = value => {
  let pattern =
    /((^[0]{1}[1-9]{1}[0-9]{8,9}$)|(^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$))/g;
  return pattern.test(value);
};

const withoutSpecialCharacters = value => {
  let pattern = /[~!@#$%^&*()_+\=\-\`]/g;
  return !pattern.test(value);
};

const passwordRequirement = value => {
  let pattern =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/g;
  return pattern.test(value);
};

const Valid = {
  isEmailOrPhoneNumber,
  isEmailAddress,
  withoutSpecialCharacters,
  passwordRequirement,
};

export default Valid;
