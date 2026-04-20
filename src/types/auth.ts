export type ClientData = {
  ClientId: string;
  DbName: string;
  DbServerName: string;
  LicenseExtraDays: string;
  LicenseMobileUser: string;
  LicenseRateUser: string;
  LicenseSupportDate: string;
  LicenseUser: string;
  ServerIp: string;
  SysName: string;
};

export type AuthSnapshot = {
  corporateId: string | null;
  clientId: string | null;
  clientData: ClientData | null;
  isVerified: boolean;
  fingerId: string | null;
};
