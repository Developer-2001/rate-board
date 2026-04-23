export {};

declare global {
  interface Window {
    desktopApi?: {
      auth: {
        fetchBearerToken: () => Promise<void>;
        fetchCorporateClientData: (
          corporateId: string
        ) => Promise<{
          data: import("@/types/auth").ClientData;
          message: string;
          warningMessage: string | null;
        }>;
        verifyDevice: (params: {
          clientId: string;
          SysName: string;
          fingerPrintId: string;
        }) => Promise<{
          data?: {
            Device?: string;
          };
          message: string;
        }>;
        registerDevice: (
          payload: Record<string, unknown>
        ) => Promise<{ success: boolean; message: string }>;
        logout: () => Promise<void>;
      };
      rateBoard: {
        fetch: (clientId: string) => Promise<{ data: unknown }>;
      };
    };
  }
}
