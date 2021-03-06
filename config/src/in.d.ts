/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/service-worker/config/src/in" />
/**
 * @publicApi
 */
export declare type Glob = string;
/**
 * @publicApi
 */
export declare type Duration = string;
/**
 * A top-level Angular Service Worker configuration object.
 *
 * @publicApi
 */
export interface Config {
    appData?: {};
    index: string;
    push?: PushConfig;
    debug?: DebugConfig;
    assetGroups?: AssetGroup[];
    dataGroups?: DataGroup[];
    navigationUrls?: string[];
}
/**
 * Configuration for handling push subscription changes.
 *
 * @experimental
 */
export interface PushConfig {
    url: string;
}
/**
 * Configuration for handling debugger.
 *
 * @experimental
 */
export interface DebugConfig {
    endpoint: string;
}
/**
 * Configuration for a particular group of assets.
 *
 * @publicApi
 */
export interface AssetGroup {
    name: string;
    installMode?: 'prefetch' | 'lazy';
    updateMode?: 'prefetch' | 'lazy';
    resources: {
        files?: Glob[];
        urls?: Glob[];
    };
}
/**
 * Configuration for a particular group of dynamic URLs.
 *
 * @publicApi
 */
export interface DataGroup {
    name: string;
    urls: Glob[];
    version?: number;
    cacheConfig: {
        maxSize: number;
        maxAge: Duration;
        timeout?: Duration;
        strategy?: 'freshness' | 'performance';
    };
}
