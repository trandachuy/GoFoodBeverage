import Environment from '../constants/environment-constants';

let environment = Environment.dev;

let EnvironmentConfig = {
  current: environment,
  isLocal: environment == Environment.local,
};

export default EnvironmentConfig;
