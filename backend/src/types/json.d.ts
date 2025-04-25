declare module '*.json' {
  interface ShippingRates {
    yamato: {
      baseWeight: number;
      baseCost: number;
      additionalWeight: number;
      additionalCost: number;
    };
    sagawa: {
      baseWeight: number;
      baseCost: number;
      additionalWeight: number;
      additionalCost: number;
    };
    ems: {
      baseWeight: number;
      baseCost: number;
      additionalWeight: number;
      additionalCost: number;
    };
    ocs: {
      baseWeight: number;
      baseCost: number;
      additionalWeight: number;
      additionalCost: number;
    };
  }

  const value: ShippingRates;
  export default value;
}