import { Model } from "@luminix/core";
import { LuminixProviderProps } from "@luminix/react/dist/components/LuminixProvider";


export type AppProps = Partial<LuminixProviderProps>;

export type ModelComponentProps = {
    Model: typeof Model,
};

