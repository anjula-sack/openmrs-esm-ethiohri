import {
  getAsyncLifecycle,
  defineConfigSchema,
  provide,
  getSyncLifecycle,
} from "@openmrs/esm-framework";
import { configSchema } from "./config-schema";
import ethiohriConfigOverrides from "./ethiohri-configuration-overrides.json";
import ethiohriConfig from "./ethiohri-config";
import {
  addToBaseFormsRegistry,
  registerControl,
} from "@ohri/openmrs-ohri-form-engine-lib";
import formsRegistry from "./forms/forms-registry";
import {
  createDashboardGroup,
  createDashboardLink,
} from "@openmrs/esm-patient-common-lib";
import {
  CHILD_HEALTH_SUMMARY,
  MATERNAL_HEALTH_SUMMARY,
  PMTCT_META,
} from "./ethiohri-dashboard.meta";

const importTranslation = require.context(
  "../translations",
  false,
  /.json$/,
  "lazy"
);

export const moduleName = "@icap-ethiopia/esm-ethiohri-app";

const backendDependencies = {
  fhir2: "^1.2.0",
  "webservices.rest": "^2.2.0",
};

function setupOpenMRS() {
  const options = { featureName: "ethiohri", moduleName };

  defineConfigSchema(moduleName, configSchema);
  provide(ethiohriConfigOverrides);
  provide(ethiohriConfig);

  addToBaseFormsRegistry(formsRegistry);

  registerControl({
    id: "eth-date",
    loadControl: () => import("./controls/date/ethiohri-date.component"),
    type: "eth-date",
  });

  return {
    pages: [],
    extensions: [
      {
        id: "ethiohri-program-summary-ext",
        slot: "program-management-summary-slot",
        load: getAsyncLifecycle(
          () =>
            import(
              "./pages/program-management/program-managment-summary.component"
            ),
          {
            featureName: "program-summary-extension",
            moduleName,
          }
        ),
      },
      {
        id: "hts-service-summary-list-ext",
        slot: "hts-service-summary-slot",
        load: getAsyncLifecycle(
          () => import("./pages/hiv-summary/hiv-patient-summary.component"),
          {
            featureName: "service-summary-extension",
            moduleName,
          }
        ),
      },
      {
        id: "ethiohri-visits-summary-ext",
        slot: "visits-summary-slot",
        load: getAsyncLifecycle(
          () => import("./pages/visits/visits-summary.component"),
          {
            featureName: "visit-summary-extension",
            moduleName,
          }
        ),
      },
      {
        id: "ethiohri-adherence-counselling-summary-ext",
        slot: "adherence-counselling-summary-slot",
        load: getAsyncLifecycle(
          () =>
            import(
              "./pages/adherence-counselling/adherence-counselling-summary.component"
            ),
          {
            featureName: "adherence-summary-extension",
            moduleName,
          }
        ),
      },
      {
        id: "test-patient-details-button",
        slot: "patient-actions-slot",
        load: getAsyncLifecycle(
          () =>
            import("./actions-buttons/test-patient-details-button.component"),
          options
        ),
        online: true,
        offline: true,
      },
      {
        id: "test-attribute-tags",
        slot: "patient-banner-tags-slot",
        load: getAsyncLifecycle(
          () => import("./patient-banner-tags/test-attribute-tags.component"),
          {
            featureName: "test-attribute-tags",
            moduleName,
          }
        ),
      },
      {
        id: "hiv-baseline-ext-et",
        slot: "patient-chart-summary-dashboard-slot",
        load: getAsyncLifecycle(
          () => import("./views/hiv-baseline/hiv-baseline-summary.component"),
          {
            featureName: "hiv-baseline-summary",
            moduleName,
          }
        ),
        meta: {
          columnSpan: 4,
        },
      },
      {
        name: "active-medications-widget-et",
        slot: "patient-chart-summary-dashboard-slot",
        load: getAsyncLifecycle(
          () => import("./views/medications/active-medications.component"),
          options
        ),
        meta: {
          columnSpan: 4,
        },
        online: { showAddMedications: true },
        offline: { showAddMedications: false },
      },
      {
        name: "vitals-overview-widget-et",
        slot: "patient-chart-summary-dashboard-slot",
        load: getAsyncLifecycle(
          () => import("./views/vitals/vitals-summary.component"),
          options
        ),
        meta: {
          columnSpan: 4,
        },
        online: { showAddVitals: true },
        offline: { showAddVitals: false },
      },
      {
        id: "pmtct-ext",
        slot: "patient-chart-dashboard-slot",
        load: getSyncLifecycle(createDashboardGroup(PMTCT_META), options),
        meta: PMTCT_META,
      },
      {
        id: "maternal-health-ext",
        slot: "ethio-pmtct-slot",
        load: getSyncLifecycle(
          createDashboardLink(MATERNAL_HEALTH_SUMMARY),
          options
        ),
        meta: MATERNAL_HEALTH_SUMMARY,
      },
      {
        id: "child-health-ext",
        slot: "ethio-pmtct-slot",
        load: getSyncLifecycle(
          createDashboardLink(CHILD_HEALTH_SUMMARY),
          options
        ),
        meta: CHILD_HEALTH_SUMMARY,
      },
      {
        id: "maternal-health-chart-ext",
        slot: "maternal-health-slot",
        load: getAsyncLifecycle(
          () => import("./pages/pmtct/maternal-health.component"),
          options
        ),
        meta: {
          columnSpan: 4,
        },
      },
      {
        id: "child-health-chart-ext",
        slot: "child-health-slot",
        load: getAsyncLifecycle(
          () => import("./pages/child-care/child-care.component"),
          options
        ),
        meta: {
          columnSpan: 4,
        },
      },
    ],
  };
}

export { backendDependencies, importTranslation, setupOpenMRS };
