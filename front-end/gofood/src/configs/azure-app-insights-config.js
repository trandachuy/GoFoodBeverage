import {ReactNativePlugin} from '@microsoft/applicationinsights-react-native';
import {ApplicationInsights} from '@microsoft/applicationinsights-web';
import {AzureKeys} from '../constants/azure.constants';
import EnvironmentConfig from './environment-config';

const RNPlugin = new ReactNativePlugin();
const applicationInsights = new ApplicationInsights({
  config: {
    instrumentationKey: EnvironmentConfig.isLocal
      ? AzureKeys.instrumentationDev
      : AzureKeys.instrumentationGoLive,
    extensions: [RNPlugin],
  },
});

applicationInsights.loadAppInsights();

applicationInsights.appInsights.addTelemetryInitializer(envelope => {
  envelope.tags['ai.cloud.role'] = 'GoFood';
  envelope.tags['ai.cloud.roleInstance'] = 'Mobile App';
  envelope.data.timeNow = Date(Date.now()).toString();
});

export default applicationInsights;
