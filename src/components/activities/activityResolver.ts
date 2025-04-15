import { ActivityConfig } from "./models/acitityConfig";
import { ActivityFunction } from "./models/acitivity";
export interface ActivityResolver {
    getActivity<P extends any[] = any[], R = any>(name: string, defaultConfig?: ActivityConfig): ActivityFunction<P, R>;
}