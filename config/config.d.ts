/**
 * @license Angular v8.2.14+3.sha-d2f7315
 * (c) 2010-2019 Google LLC. https://angular.io/
 * License: MIT
 */


/**
 * Configuration for a particular group of assets.
 *
 * @publicApi
 */
export declare interface AssetGroup {
    name: string;
    installMode?: 'prefetch' | 'lazy';
    updateMode?: 'prefetch' | 'lazy';
    resources: {
        files?: Glob[];
        /** @deprecated As of v6 `versionedFiles` and `files` options have the same behavior. Use
           `files` instead. */
        versionedFiles?: Glob[];
        urls?: Glob[];
    };
}

/**
 * A top-level Angular Service Worker configuration object.
 *
 * @publicApi
 */
export declare interface Config {
    appData?: {};
    index: string;
    push?: PushConfig;
    debug?: DebugConfig;
    assetGroups?: AssetGroup[];
    dataGroups?: DataGroup[];
    navigationUrls?: string[];
}

/**
 * Configuration for a particular group of dynamic URLs.
 *
 * @publicApi
 */
export declare interface DataGroup {
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

/**
 * Configuration for handling debugger.
 *
 * @experimental
 */
declare interface DebugConfig {
    endpoint: string;
}

/**
 * @publicApi
 */
export declare type Duration = string;


/**
 * An abstraction over a virtual file system used to enable testing and operation
 * of the config generator in different environments.
 *
 * @publicApi
 */
export declare interface Filesystem {
    list(dir: string): Promise<string[]>;
    read(file: string): Promise<string>;
    hash(file: string): Promise<string>;
    write(file: string, contents: string): Promise<void>;
}

/**
 * Consumes service worker configuration files and processes them into control files.
 *
 * @publicApi
 */
export declare class Generator {
    readonly fs: Filesystem;
    private baseHref;
    constructor(fs: Filesystem, baseHref: string);
    process(config: Config): Promise<Object>;
    private processAssetGroups;
    private processDataGroups;
}


/**
 * @publicApi
 */
export declare type Glob = string;

/**
 * Configuration for handling push subscription changes.
 *
 * @experimental
 */
declare interface PushConfig {
    url: string;
}

export { }
