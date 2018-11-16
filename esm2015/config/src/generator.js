/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as tslib_1 from "tslib";
import { parseDurationToMs } from './duration';
import { globToRegex } from './glob';
/** @type {?} */
const DEFAULT_NAVIGATION_URLS = [
    '/**',
    '!/**/*.*',
    '!/**/*__*',
    '!/**/*__*/**',
];
/**
 * Consumes service worker configuration files and processes them into control files.
 *
 * \@publicApi
 */
export class Generator {
    /**
     * @param {?} fs
     * @param {?} baseHref
     */
    constructor(fs, baseHref) {
        this.fs = fs;
        this.baseHref = baseHref;
    }
    /**
     * @param {?} config
     * @return {?}
     */
    process(config) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            /** @type {?} */
            const unorderedHashTable = {};
            /** @type {?} */
            const assetGroups = yield this.processAssetGroups(config, unorderedHashTable);
            return {
                configVersion: 1,
                appData: config.appData,
                push: config.push,
                index: joinUrls(this.baseHref, config.index), assetGroups,
                dataGroups: this.processDataGroups(config),
                hashTable: withOrderedKeys(unorderedHashTable),
                navigationUrls: processNavigationUrls(this.baseHref, config.navigationUrls),
            };
        });
    }
    /**
     * @param {?} config
     * @param {?} hashTable
     * @return {?}
     */
    processAssetGroups(config, hashTable) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            /** @type {?} */
            const seenMap = new Set();
            return Promise.all((config.assetGroups || []).map((group) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (group.resources.versionedFiles) {
                    console.warn(`Asset-group '${group.name}' in 'ngsw-config.json' uses the 'versionedFiles' option.\n` +
                        'As of v6 \'versionedFiles\' and \'files\' options have the same behavior. ' +
                        'Use \'files\' instead.');
                }
                /** @type {?} */
                const fileMatcher = globListToMatcher(group.resources.files || []);
                /** @type {?} */
                const versionedMatcher = globListToMatcher(group.resources.versionedFiles || []);
                /** @type {?} */
                const allFiles = yield this.fs.list('/');
                /** @type {?} */
                const plainFiles = allFiles.filter(fileMatcher).filter(file => !seenMap.has(file));
                plainFiles.forEach(file => seenMap.add(file));
                /** @type {?} */
                const versionedFiles = allFiles.filter(versionedMatcher).filter(file => !seenMap.has(file));
                versionedFiles.forEach(file => seenMap.add(file));
                /** @type {?} */
                const matchedFiles = [...plainFiles, ...versionedFiles].sort();
                yield matchedFiles.reduce((previous, file) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    yield previous;
                    /** @type {?} */
                    const hash = yield this.fs.hash(file);
                    hashTable[joinUrls(this.baseHref, file)] = hash;
                }), Promise.resolve());
                return {
                    name: group.name,
                    installMode: group.installMode || 'prefetch',
                    updateMode: group.updateMode || group.installMode || 'prefetch',
                    urls: matchedFiles.map(url => joinUrls(this.baseHref, url)),
                    patterns: (group.resources.urls || []).map(url => urlToRegex(url, this.baseHref, true)),
                };
            })));
        });
    }
    /**
     * @param {?} config
     * @return {?}
     */
    processDataGroups(config) {
        return (config.dataGroups || []).map(group => {
            return {
                name: group.name,
                patterns: group.urls.map(url => urlToRegex(url, this.baseHref, true)),
                strategy: group.cacheConfig.strategy || 'performance',
                maxSize: group.cacheConfig.maxSize,
                maxAge: parseDurationToMs(group.cacheConfig.maxAge),
                timeoutMs: group.cacheConfig.timeout && parseDurationToMs(group.cacheConfig.timeout),
                version: group.version !== undefined ? group.version : 1,
            };
        });
    }
}
if (false) {
    /** @type {?} */
    Generator.prototype.fs;
    /** @type {?} */
    Generator.prototype.baseHref;
}
/**
 * @param {?} baseHref
 * @param {?=} urls
 * @return {?}
 */
export function processNavigationUrls(baseHref, urls = DEFAULT_NAVIGATION_URLS) {
    return urls.map(url => {
        /** @type {?} */
        const positive = !url.startsWith('!');
        url = positive ? url : url.substr(1);
        return { positive, regex: `^${urlToRegex(url, baseHref)}$` };
    });
}
/**
 * @param {?} globs
 * @return {?}
 */
function globListToMatcher(globs) {
    /** @type {?} */
    const patterns = globs.map(pattern => {
        if (pattern.startsWith('!')) {
            return {
                positive: false,
                regex: new RegExp('^' + globToRegex(pattern.substr(1)) + '$'),
            };
        }
        else {
            return {
                positive: true,
                regex: new RegExp('^' + globToRegex(pattern) + '$'),
            };
        }
    });
    return (file) => matches(file, patterns);
}
/**
 * @param {?} file
 * @param {?} patterns
 * @return {?}
 */
function matches(file, patterns) {
    /** @type {?} */
    const res = patterns.reduce((isMatch, pattern) => {
        if (pattern.positive) {
            return isMatch || pattern.regex.test(file);
        }
        else {
            return isMatch && !pattern.regex.test(file);
        }
    }, false);
    return res;
}
/**
 * @param {?} url
 * @param {?} baseHref
 * @param {?=} literalQuestionMark
 * @return {?}
 */
function urlToRegex(url, baseHref, literalQuestionMark) {
    if (!url.startsWith('/') && url.indexOf('://') === -1) {
        url = joinUrls(baseHref, url);
    }
    return globToRegex(url, literalQuestionMark);
}
/**
 * @param {?} a
 * @param {?} b
 * @return {?}
 */
function joinUrls(a, b) {
    if (a.endsWith('/') && b.startsWith('/')) {
        return a + b.substr(1);
    }
    else if (!a.endsWith('/') && !b.startsWith('/')) {
        return a + '/' + b;
    }
    return a + b;
}
/**
 * @template T
 * @param {?} unorderedObj
 * @return {?}
 */
function withOrderedKeys(unorderedObj) {
    /** @type {?} */
    const orderedObj = /** @type {?} */ ({});
    Object.keys(unorderedObj).sort().forEach(key => orderedObj[key] = unorderedObj[key]);
    return orderedObj;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvY29uZmlnL3NyYy9nZW5lcmF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sWUFBWSxDQUFDO0FBRTdDLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxRQUFRLENBQUM7O0FBR25DLE1BQU0sdUJBQXVCLEdBQUc7SUFDOUIsS0FBSztJQUNMLFVBQVU7SUFDVixXQUFXO0lBQ1gsY0FBYztDQUNmLENBQUM7Ozs7OztBQU9GLE1BQU0sT0FBTyxTQUFTOzs7OztJQUNwQixZQUFxQixFQUFjLEVBQVUsUUFBZ0I7UUFBeEMsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUFVLGFBQVEsR0FBUixRQUFRLENBQVE7S0FBSTs7Ozs7SUFFM0QsT0FBTyxDQUFDLE1BQWM7OztZQUMxQixNQUFNLGtCQUFrQixHQUFHLEVBQUUsQ0FBQzs7WUFDOUIsTUFBTSxXQUFXLEdBQUcsTUFBTSxJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxFQUFFLGtCQUFrQixDQUFDLENBQUM7WUFFOUUsT0FBTztnQkFDTCxhQUFhLEVBQUUsQ0FBQztnQkFDaEIsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPO2dCQUN2QixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUk7Z0JBQ2pCLEtBQUssRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsV0FBVztnQkFDekQsVUFBVSxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUM7Z0JBQzFDLFNBQVMsRUFBRSxlQUFlLENBQUMsa0JBQWtCLENBQUM7Z0JBQzlDLGNBQWMsRUFBRSxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxjQUFj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TyxVQUFVLENBQUM7Q0FDbkIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7cGFyc2VEdXJhdGlvblRvTXN9IGZyb20gJy4vZHVyYXRpb24nO1xuaW1wb3J0IHtGaWxlc3lzdGVtfSBmcm9tICcuL2ZpbGVzeXN0ZW0nO1xuaW1wb3J0IHtnbG9iVG9SZWdleH0gZnJvbSAnLi9nbG9iJztcbmltcG9ydCB7Q29uZmlnfSBmcm9tICcuL2luJztcblxuY29uc3QgREVGQVVMVF9OQVZJR0FUSU9OX1VSTFMgPSBbXG4gICcvKionLCAgICAgICAgICAgLy8gSW5jbHVkZSBhbGwgVVJMcy5cbiAgJyEvKiovKi4qJywgICAgICAvLyBFeGNsdWRlIFVSTHMgdG8gZmlsZXMgKGNvbnRhaW5pbmcgYSBmaWxlIGV4dGVuc2lvbiBpbiB0aGUgbGFzdCBzZWdtZW50KS5cbiAgJyEvKiovKl9fKicsICAgICAvLyBFeGNsdWRlIFVSTHMgY29udGFpbmluZyBgX19gIGluIHRoZSBsYXN0IHNlZ21lbnQuXG4gICchLyoqLypfXyovKionLCAgLy8gRXhjbHVkZSBVUkxzIGNvbnRhaW5pbmcgYF9fYCBpbiBhbnkgb3RoZXIgc2VnbWVudC5cbl07XG5cbi8qKlxuICogQ29uc3VtZXMgc2VydmljZSB3b3JrZXIgY29uZmlndXJhdGlvbiBmaWxlcyBhbmQgcHJvY2Vzc2VzIHRoZW0gaW50byBjb250cm9sIGZpbGVzLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGNsYXNzIEdlbmVyYXRvciB7XG4gIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGZzOiBGaWxlc3lzdGVtLCBwcml2YXRlIGJhc2VIcmVmOiBzdHJpbmcpIHt9XG5cbiAgYXN5bmMgcHJvY2Vzcyhjb25maWc6IENvbmZpZyk6IFByb21pc2U8T2JqZWN0PiB7XG4gICAgY29uc3QgdW5vcmRlcmVkSGFzaFRhYmxlID0ge307XG4gICAgY29uc3QgYXNzZXRHcm91cHMgPSBhd2FpdCB0aGlzLnByb2Nlc3NBc3NldEdyb3Vwcyhjb25maWcsIHVub3JkZXJlZEhhc2hUYWJsZSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgY29uZmlnVmVyc2lvbjogMSxcbiAgICAgIGFwcERhdGE6IGNvbmZpZy5hcHBEYXRhLFxuICAgICAgcHVzaDogY29uZmlnLnB1c2gsXG4gICAgICBpbmRleDogam9pblVybHModGhpcy5iYXNlSHJlZiwgY29uZmlnLmluZGV4KSwgYXNzZXRHcm91cHMsXG4gICAgICBkYXRhR3JvdXBzOiB0aGlzLnByb2Nlc3NEYXRhR3JvdXBzKGNvbmZpZyksXG4gICAgICBoYXNoVGFibGU6IHdpdGhPcmRlcmVkS2V5cyh1bm9yZGVyZWRIYXNoVGFibGUpLFxuICAgICAgbmF2aWdhdGlvblVybHM6IHByb2Nlc3NOYXZpZ2F0aW9uVXJscyh0aGlzLmJhc2VIcmVmLCBjb25maWcubmF2aWdhdGlvblVybHMpLFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHByb2Nlc3NBc3NldEdyb3Vwcyhjb25maWc6IENvbmZpZywgaGFzaFRhYmxlOiB7W2ZpbGU6IHN0cmluZ106IHN0cmluZyB8IHVuZGVmaW5lZH0pOlxuICAgICAgUHJvbWlzZTxPYmplY3RbXT4ge1xuICAgIGNvbnN0IHNlZW5NYXAgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoKGNvbmZpZy5hc3NldEdyb3VwcyB8fCBbXSkubWFwKGFzeW5jKGdyb3VwKSA9PiB7XG4gICAgICBpZiAoZ3JvdXAucmVzb3VyY2VzLnZlcnNpb25lZEZpbGVzKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICAgIGBBc3NldC1ncm91cCAnJHtncm91cC5uYW1lfScgaW4gJ25nc3ctY29uZmlnLmpzb24nIHVzZXMgdGhlICd2ZXJzaW9uZWRGaWxlcycgb3B0aW9uLlxcbmAgK1xuICAgICAgICAgICAgJ0FzIG9mIHY2IFxcJ3ZlcnNpb25lZEZpbGVzXFwnIGFuZCBcXCdmaWxlc1xcJyBvcHRpb25zIGhhdmUgdGhlIHNhbWUgYmVoYXZpb3IuICcgK1xuICAgICAgICAgICAgJ1VzZSBcXCdmaWxlc1xcJyBpbnN0ZWFkLicpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBmaWxlTWF0Y2hlciA9IGdsb2JMaXN0VG9NYXRjaGVyKGdyb3VwLnJlc291cmNlcy5maWxlcyB8fCBbXSk7XG4gICAgICBjb25zdCB2ZXJzaW9uZWRNYXRjaGVyID0gZ2xvYkxpc3RUb01hdGNoZXIoZ3JvdXAucmVzb3VyY2VzLnZlcnNpb25lZEZpbGVzIHx8IFtdKTtcblxuICAgICAgY29uc3QgYWxsRmlsZXMgPSBhd2FpdCB0aGlzLmZzLmxpc3QoJy8nKTtcblxuICAgICAgY29uc3QgcGxhaW5GaWxlcyA9IGFsbEZpbGVzLmZpbHRlcihmaWxlTWF0Y2hlcikuZmlsdGVyKGZpbGUgPT4gIXNlZW5NYXAuaGFzKGZpbGUpKTtcbiAgICAgIHBsYWluRmlsZXMuZm9yRWFjaChmaWxlID0+IHNlZW5NYXAuYWRkKGZpbGUpKTtcblxuICAgICAgY29uc3QgdmVyc2lvbmVkRmlsZXMgPSBhbGxGaWxlcy5maWx0ZXIodmVyc2lvbmVkTWF0Y2hlcikuZmlsdGVyKGZpbGUgPT4gIXNlZW5NYXAuaGFzKGZpbGUpKTtcbiAgICAgIHZlcnNpb25lZEZpbGVzLmZvckVhY2goZmlsZSA9PiBzZWVuTWFwLmFkZChmaWxlKSk7XG5cbiAgICAgIC8vIEFkZCB0aGUgaGFzaGVzLlxuICAgICAgY29uc3QgbWF0Y2hlZEZpbGVzID0gWy4uLnBsYWluRmlsZXMsIC4uLnZlcnNpb25lZEZpbGVzXS5zb3J0KCk7XG4gICAgICBhd2FpdCBtYXRjaGVkRmlsZXMucmVkdWNlKGFzeW5jKHByZXZpb3VzLCBmaWxlKSA9PiB7XG4gICAgICAgIGF3YWl0IHByZXZpb3VzO1xuICAgICAgICBjb25zdCBoYXNoID0gYXdhaXQgdGhpcy5mcy5oYXNoKGZpbGUpO1xuICAgICAgICBoYXNoVGFibGVbam9pblVybHModGhpcy5iYXNlSHJlZiwgZmlsZSldID0gaGFzaDtcbiAgICAgIH0sIFByb21pc2UucmVzb2x2ZSgpKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogZ3JvdXAubmFtZSxcbiAgICAgICAgaW5zdGFsbE1vZGU6IGdyb3VwLmluc3RhbGxNb2RlIHx8ICdwcmVmZXRjaCcsXG4gICAgICAgIHVwZGF0ZU1vZGU6IGdyb3VwLnVwZGF0ZU1vZGUgfHwgZ3JvdXAuaW5zdGFsbE1vZGUgfHwgJ3ByZWZldGNoJyxcbiAgICAgICAgdXJsczogbWF0Y2hlZEZpbGVzLm1hcCh1cmwgPT4gam9pblVybHModGhpcy5iYXNlSHJlZiwgdXJsKSksXG4gICAgICAgIHBhdHRlcm5zOiAoZ3JvdXAucmVzb3VyY2VzLnVybHMgfHwgW10pLm1hcCh1cmwgPT4gdXJsVG9SZWdleCh1cmwsIHRoaXMuYmFzZUhyZWYsIHRydWUpKSxcbiAgICAgIH07XG4gICAgfSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBwcm9jZXNzRGF0YUdyb3Vwcyhjb25maWc6IENvbmZpZyk6IE9iamVjdFtdIHtcbiAgICByZXR1cm4gKGNvbmZpZy5kYXRhR3JvdXBzIHx8IFtdKS5tYXAoZ3JvdXAgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogZ3JvdXAubmFtZSxcbiAgICAgICAgcGF0dGVybnM6IGdyb3VwLnVybHMubWFwKHVybCA9PiB1cmxUb1JlZ2V4KHVybCwgdGhpcy5iYXNlSHJlZiwgdHJ1ZSkpLFxuICAgICAgICBzdHJhdGVneTogZ3JvdXAuY2FjaGVDb25maWcuc3RyYXRlZ3kgfHwgJ3BlcmZvcm1hbmNlJyxcbiAgICAgICAgbWF4U2l6ZTogZ3JvdXAuY2FjaGVDb25maWcubWF4U2l6ZSxcbiAgICAgICAgbWF4QWdlOiBwYXJzZUR1cmF0aW9uVG9Ncyhncm91cC5jYWNoZUNvbmZpZy5tYXhBZ2UpLFxuICAgICAgICB0aW1lb3V0TXM6IGdyb3VwLmNhY2hlQ29uZmlnLnRpbWVvdXQgJiYgcGFyc2VEdXJhdGlvblRvTXMoZ3JvdXAuY2FjaGVDb25maWcudGltZW91dCksXG4gICAgICAgIHZlcnNpb246IGdyb3VwLnZlcnNpb24gIT09IHVuZGVmaW5lZCA/IGdyb3VwLnZlcnNpb24gOiAxLFxuICAgICAgfTtcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJvY2Vzc05hdmlnYXRpb25VcmxzKFxuICAgIGJhc2VIcmVmOiBzdHJpbmcsIHVybHMgPSBERUZBVUxUX05BVklHQVRJT05fVVJMUyk6IHtwb3NpdGl2ZTogYm9vbGVhbiwgcmVnZXg6IHN0cmluZ31bXSB7XG4gIHJldHVybiB1cmxzLm1hcCh1cmwgPT4ge1xuICAgIGNvbnN0IHBvc2l0aXZlID0gIXVybC5zdGFydHNXaXRoKCchJyk7XG4gICAgdXJsID0gcG9zaXRpdmUgPyB1cmwgOiB1cmwuc3Vic3RyKDEpO1xuICAgIHJldHVybiB7cG9zaXRpdmUsIHJlZ2V4OiBgXiR7dXJsVG9SZWdleCh1cmwsIGJhc2VIcmVmKX0kYH07XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBnbG9iTGlzdFRvTWF0Y2hlcihnbG9iczogc3RyaW5nW10pOiAoZmlsZTogc3RyaW5nKSA9PiBib29sZWFuIHtcbiAgY29uc3QgcGF0dGVybnMgPSBnbG9icy5tYXAocGF0dGVybiA9PiB7XG4gICAgaWYgKHBhdHRlcm4uc3RhcnRzV2l0aCgnIScpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwb3NpdGl2ZTogZmFsc2UsXG4gICAgICAgIHJlZ2V4OiBuZXcgUmVnRXhwKCdeJyArIGdsb2JUb1JlZ2V4KHBhdHRlcm4uc3Vic3RyKDEpKSArICckJyksXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwb3NpdGl2ZTogdHJ1ZSxcbiAgICAgICAgcmVnZXg6IG5ldyBSZWdFeHAoJ14nICsgZ2xvYlRvUmVnZXgocGF0dGVybikgKyAnJCcpLFxuICAgICAgfTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gKGZpbGU6IHN0cmluZykgPT4gbWF0Y2hlcyhmaWxlLCBwYXR0ZXJucyk7XG59XG5cbmZ1bmN0aW9uIG1hdGNoZXMoZmlsZTogc3RyaW5nLCBwYXR0ZXJuczoge3Bvc2l0aXZlOiBib29sZWFuLCByZWdleDogUmVnRXhwfVtdKTogYm9vbGVhbiB7XG4gIGNvbnN0IHJlcyA9IHBhdHRlcm5zLnJlZHVjZSgoaXNNYXRjaCwgcGF0dGVybikgPT4ge1xuICAgIGlmIChwYXR0ZXJuLnBvc2l0aXZlKSB7XG4gICAgICByZXR1cm4gaXNNYXRjaCB8fCBwYXR0ZXJuLnJlZ2V4LnRlc3QoZmlsZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBpc01hdGNoICYmICFwYXR0ZXJuLnJlZ2V4LnRlc3QoZmlsZSk7XG4gICAgfVxuICB9LCBmYWxzZSk7XG4gIHJldHVybiByZXM7XG59XG5cbmZ1bmN0aW9uIHVybFRvUmVnZXgodXJsOiBzdHJpbmcsIGJhc2VIcmVmOiBzdHJpbmcsIGxpdGVyYWxRdWVzdGlvbk1hcms/OiBib29sZWFuKTogc3RyaW5nIHtcbiAgaWYgKCF1cmwuc3RhcnRzV2l0aCgnLycpICYmIHVybC5pbmRleE9mKCc6Ly8nKSA9PT0gLTEpIHtcbiAgICB1cmwgPSBqb2luVXJscyhiYXNlSHJlZiwgdXJsKTtcbiAgfVxuXG4gIHJldHVybiBnbG9iVG9SZWdleCh1cmwsIGxpdGVyYWxRdWVzdGlvbk1hcmspO1xufVxuXG5mdW5jdGlvbiBqb2luVXJscyhhOiBzdHJpbmcsIGI6IHN0cmluZyk6IHN0cmluZyB7XG4gIGlmIChhLmVuZHNXaXRoKCcvJykgJiYgYi5zdGFydHNXaXRoKCcvJykpIHtcbiAgICByZXR1cm4gYSArIGIuc3Vic3RyKDEpO1xuICB9IGVsc2UgaWYgKCFhLmVuZHNXaXRoKCcvJykgJiYgIWIuc3RhcnRzV2l0aCgnLycpKSB7XG4gICAgcmV0dXJuIGEgKyAnLycgKyBiO1xuICB9XG4gIHJldHVybiBhICsgYjtcbn1cblxuZnVuY3Rpb24gd2l0aE9yZGVyZWRLZXlzPFQgZXh0ZW5kc3tba2V5OiBzdHJpbmddOiBhbnl9Pih1bm9yZGVyZWRPYmo6IFQpOiBUIHtcbiAgY29uc3Qgb3JkZXJlZE9iaiA9IHt9IGFzIFQ7XG4gIE9iamVjdC5rZXlzKHVub3JkZXJlZE9iaikuc29ydCgpLmZvckVhY2goa2V5ID0+IG9yZGVyZWRPYmpba2V5XSA9IHVub3JkZXJlZE9ialtrZXldKTtcbiAgcmV0dXJuIG9yZGVyZWRPYmo7XG59XG4iXX0=