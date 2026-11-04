/**
 * Centralized corporate credentials, federal socioeconomic designations,
 * and acquisition identifiers for The Inferno Group LLC.
 *
 * NOTE FOR COMPLIANCE AUDITING:
 * - Only active/verified designations (HUBZone Certified, Veteran-Owned Small Business)
 *   are claimed in corporate statements.
 * - SBA 8(a) and WOSB are prospective / partner teaming criteria only.
 *
 * TODO(OWNER): Verify HUBZone status in SBA DSBS and add the official certification
 * issue and expiration / recertification dates once supplied.
 */

export interface CorporateCredentials {
  uei: string;
  cageCode: string;
  certifications: {
    hubzone: {
      status: "Certified";
      agency: "U.S. Small Business Administration (SBA)";
      verified: true;
      // TODO(OWNER): Supply exact SBA DSBS certification verification date / recertification renewal date
      recertificationDate?: string;
    };
    vosb: {
      status: "Veteran-Owned Small Business";
      agency: "U.S. Department of Veterans Affairs / SBA";
      verified: true;
    };
  };
  primaryNaics: string;
  naicsList: Array<{ code: string; title: string }>;
  bondingCapacity: {
    singleProject: string;
    aggregate: string;
    performancePayment: string;
  };
  corporateOffice: {
    address: string;
    suite: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    email: string;
  };
}

export const CREDENTIALS: CorporateCredentials = {
  uei: "QW6RHJACHA56",
  cageCode: "22VP2",
  certifications: {
    hubzone: {
      status: "Certified",
      agency: "U.S. Small Business Administration (SBA)",
      verified: true,
      // TODO(OWNER): Provide official SBA HUBZone anniversary verification date
      recertificationDate: undefined,
    },
    vosb: {
      status: "Veteran-Owned Small Business",
      agency: "U.S. Department of Veterans Affairs / SBA",
      verified: true,
    },
  },
  primaryNaics: "541611",
  naicsList: [
    { code: "541611", title: "Administrative & General Management Consulting Services" },
    { code: "541618", title: "Other Management Consulting Services" },
    { code: "541690", title: "Other Scientific & Technical Consulting Services" },
    { code: "624230", title: "Emergency & Other Relief Services" },
    { code: "561210", title: "Facilities Support Services" },
    { code: "562910", title: "Remediation Services" },
    { code: "238320", title: "Painting & Wall Covering Contractors" },
    { code: "561720", title: "Janitorial Services" },
    { code: "561790", title: "Other Services to Buildings & Dwellings" },
    { code: "238990", title: "All Other Specialty Trade Contractors" },
    { code: "423990", title: "Other Miscellaneous Durable Goods Merchant Wholesalers" },
    { code: "488510", title: "Freight Transportation Arrangement" },
    { code: "561422", title: "Telemarketing Bureaus & Other Contact Centers" },
  ],
  bondingCapacity: {
    singleProject: "Up to 100% Performance & Payment",
    aggregate: "Evaluation per mission scope",
    performancePayment: "Up to 100% of contract award value",
  },
  corporateOffice: {
    address: "200 E. Robinson Street",
    suite: "Suite 1120",
    city: "Orlando",
    state: "FL",
    zip: "32801",
    phone: "407-499-1443",
    email: "InfernoCares@theinfernogroup.com",
  },
};

