import {SeverityLevel} from '@microsoft/applicationinsights-web';
import applicationInsights from '../configs/azure-app-insights-config';

const appInsights = {
  trackException: function (err) {
    applicationInsights.appInsights.trackException({
      error: err,
      severityLevel: SeverityLevel.Error,
    });
  },
  trackTrace: function (msg) {
    applicationInsights.appInsights.trackTrace({
      message: msg,
      severityLevel: SeverityLevel.Information,
    });
  },
};

export default appInsights;
