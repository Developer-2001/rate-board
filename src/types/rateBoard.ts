export type RawRateItem = {
  Metal_name: string;
  Caret: number;
  Srate: number;
  Prate: number;
  Name: string;
};

export type RateBoardResponse = {
  dt: string;
  client_id: string;
  firm_name: string;
  firm_address: string;
  firm_no: string;
  data: RawRateItem[];
};

export type DisplayRateItem = {
  id: string;
  metal: "Gold" | "Silver";
  label: string;
  saleRate: number;
  purchaseRate: number;
  caret: number;
};
