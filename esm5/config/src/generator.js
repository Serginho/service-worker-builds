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
var DEFAULT_NAVIGATION_URLS = [
    '/**',
    '!/**/*.*',
    '!/**/*__*',
    '!/**/*__*/**',
];
/**
 * Consumes service worker configuration files and processes them into control files.
 *
 * @publicApi
 */
var Generator = /** @class */ (function () {
    function Generator(fs, baseHref) {
        this.fs = fs;
        this.baseHref = baseHref;
    }
    Generator.prototype.process = function (config) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var unorderedHashTable, assetGroups;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        unorderedHashTable = {};
                        return [4 /*yield*/, this.processAssetGroups(config, unorderedHashTable)];
                    case 1:
                        assetGroups = _a.sent();
                        return [2 /*return*/, {
                                configVersion: 1,
                                appData: config.appData,
                                push: config.push,
                                index: joinUrls(this.baseHref, config.index), assetGroups: assetGroups,
                                dataGroups: this.processDataGroups(config),
                                hashTable: withOrderedKeys(unorderedHashTable),
                                navigationUrls: processNavigationUrls(this.baseHref, config.navigationUrls),
                            }];
                }
            });
        });
    };
    Generator.prototype.processAssetGroups = function (config, hashTable) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var seenMap;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                seenMap = new Set();
                return [2 /*return*/, Promise.all((config.assetGroups || []).map(function (group) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        var fileMatcher, versionedMatcher, allFiles, plainFiles, versionedFiles, matchedFiles;
                        var _this = this;
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (group.resources.versionedFiles) {
                                        console.warn("Asset-group '" + group.name + "' in 'ngsw-config.json' uses the 'versionedFiles' option.\n" +
                                            'As of v6 \'versionedFiles\' and \'files\' options have the same behavior. ' +
                                            'Use \'files\' instead.');
                                    }
                                    fileMatcher = globListToMatcher(group.resources.files || []);
                                    versionedMatcher = globListToMatcher(group.resources.versionedFiles || []);
                                    return [4 /*yield*/, this.fs.list('/')];
                                case 1:
                                    allFiles = _a.sent();
                                    plainFiles = allFiles.filter(fileMatcher).filter(function (file) { return !seenMap.has(file); });
                                    plainFiles.forEach(function (file) { return seenMap.add(file); });
                                    versionedFiles = allFiles.filter(versionedMatcher).filter(function (file) { return !seenMap.has(file); });
                                    versionedFiles.forEach(function (file) { return seenMap.add(file); });
                                    matchedFiles = tslib_1.__spread(plainFiles, versionedFiles).sort();
                                    return [4 /*yield*/, matchedFiles.reduce(function (previous, file) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                            var hash;
                                            return tslib_1.__generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, previous];
                                                    case 1:
                                                        _a.sent();
                                                        return [4 /*yield*/, this.fs.hash(file)];
                                                    case 2:
                                                        hash = _a.sent();
                                                        hashTable[joinUrls(this.baseHref, file)] = hash;
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); }, Promise.resolve())];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/, {
                                            name: group.name,
                                            installMode: group.installMode || 'prefetch',
                                            updateMode: group.updateMode || group.installMode || 'prefetch',
                                            urls: matchedFiles.map(function (url) { return joinUrls(_this.baseHref, url); }),
                                            patterns: (group.resources.urls || []).map(function (url) { return urlToRegex(url, _this.baseHref, true); }),
                                        }];
                            }
                        });
                    }); }))];
            });
        });
    };
    Generator.prototype.processDataGroups = function (config) {
        var _this = this;
        return (config.dataGroups || []).map(function (group) {
            return {
                name: group.name,
                patterns: group.urls.map(function (url) { return urlToRegex(url, _this.baseHref, true); }),
                strategy: group.cacheConfig.strategy || 'performance',
                maxSize: group.cacheConfig.maxSize,
                maxAge: parseDurationToMs(group.cacheConfig.maxAge),
                timeoutMs: group.cacheConfig.timeout && parseDurationToMs(group.cacheConfig.timeout),
                version: group.version !== undefined ? group.version : 1,
            };
        });
    };
    return Generator;
}());
export { Generator };
export function processNavigationUrls(baseHref, urls) {
    if (urls === void 0) { urls = DEFAULT_NAVIGATION_URLS; }
    return urls.map(function (url) {
        var positive = !url.startsWith('!');
        url = positive ? url : url.substr(1);
        return { positive: positive, regex: "^" + urlToRegex(url, baseHref) + "$" };
    });
}
function globListToMatcher(globs) {
    var patterns = globs.map(function (pattern) {
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
    return function (file) { return matches(file, patterns); };
}
function matches(file, patterns) {
    var res = patterns.reduce(function (isMatch, pattern) {
        if (pattern.positive) {
            return isMatch || pattern.regex.test(file);
        }
        else {
            return isMatch && !pattern.regex.test(file);
        }
    }, false);
    return res;
}
function urlToRegex(url, baseHref, literalQuestionMark) {
    if (!url.startsWith('/') && url.indexOf('://') === -1) {
        url = joinUrls(baseHref, url);
    }
    return globToRegex(url, literalQuestionMark);
}
function joinUrls(a, b) {
    if (a.endsWith('/') && b.startsWith('/')) {
        return a + b.substr(1);
    }
    else if (!a.endsWith('/') && !b.startsWith('/')) {
        return a + '/' + b;
    }
    return a + b;
}
function withOrderedKeys(unorderedObj) {
    var orderedObj = {};
    Object.keys(unorderedObj).sort().forEach(function (key) { return orderedObj[key] = unorderedObj[key]; });
    return orderedObj;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvY29uZmlnL3NyYy9nZW5lcmF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUU3QyxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBR25DLElBQU0sdUJBQXVCLEdBQUc7SUFDOUIsS0FBSztJQUNMLFVBQVU7SUFDVixXQUFXO0lBQ1gsY0FBYztDQUNmLENBQUM7QUFFRjs7OztHQUlHO0FBQ0g7SUFDRSxtQkFBcUIsRUFBYyxFQUFVLFFBQWdCO1FBQXhDLE9BQUUsR0FBRixFQUFFLENBQVk7UUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFRO0lBQUcsQ0FBQztJQUUzRCwyQkFBTyxHQUFiLFVBQWMsTUFBYzs7Ozs7O3dCQUNwQixrQkFBa0IsR0FBRyxFQUFFLENBQUM7d0JBQ1YscUJBQU0sSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxrQkFBa0IsQ0FBQyxFQUFBOzt3QkFBdkUsV0FBVyxHQUFHLFNBQXlEO3dCQUU3RSxzQkFBTztnQ0FDTCxhQUFhLEVBQUUsQ0FBQztnQ0FDaEIsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPO2dDQUN2QixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUk7Z0NBQ2pCLEtBQUssRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsV0FBVyxhQUFBO2dDQUN6RCxVQUFVLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQztnQ0FDMUMsU0FBUyxFQUFFLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQztnQ0FDOUMsY0FBYyxFQUFFLHFCQUFxQixDQUFDLElBQUksQ0FB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ZTtJQUNyRSxJQUFNLFVBQVUsR0FBRyxFQUFPLENBQUM7SUFDM0IsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsVUFBQSxHQUFHLElBQUksT0FBQSxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsWUFBWSxDQUFDLEdBQUcsQ0FBQyxFQUFuQyxDQUFtQyxDQUFDLENBQUM7SUFDckYsT0FBTyxVQUFVLENBQUM7QUFDcEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtwYXJzZUR1cmF0aW9uVG9Nc30gZnJvbSAnLi9kdXJhdGlvbic7XG5pbXBvcnQge0ZpbGVzeXN0ZW19IGZyb20gJy4vZmlsZXN5c3RlbSc7XG5pbXBvcnQge2dsb2JUb1JlZ2V4fSBmcm9tICcuL2dsb2InO1xuaW1wb3J0IHtDb25maWd9IGZyb20gJy4vaW4nO1xuXG5jb25zdCBERUZBVUxUX05BVklHQVRJT05fVVJMUyA9IFtcbiAgJy8qKicsICAgICAgICAgICAvLyBJbmNsdWRlIGFsbCBVUkxzLlxuICAnIS8qKi8qLionLCAgICAgIC8vIEV4Y2x1ZGUgVVJMcyB0byBmaWxlcyAoY29udGFpbmluZyBhIGZpbGUgZXh0ZW5zaW9uIGluIHRoZSBsYXN0IHNlZ21lbnQpLlxuICAnIS8qKi8qX18qJywgICAgIC8vIEV4Y2x1ZGUgVVJMcyBjb250YWluaW5nIGBfX2AgaW4gdGhlIGxhc3Qgc2VnbWVudC5cbiAgJyEvKiovKl9fKi8qKicsICAvLyBFeGNsdWRlIFVSTHMgY29udGFpbmluZyBgX19gIGluIGFueSBvdGhlciBzZWdtZW50LlxuXTtcblxuLyoqXG4gKiBDb25zdW1lcyBzZXJ2aWNlIHdvcmtlciBjb25maWd1cmF0aW9uIGZpbGVzIGFuZCBwcm9jZXNzZXMgdGhlbSBpbnRvIGNvbnRyb2wgZmlsZXMuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgY2xhc3MgR2VuZXJhdG9yIHtcbiAgY29uc3RydWN0b3IocmVhZG9ubHkgZnM6IEZpbGVzeXN0ZW0sIHByaXZhdGUgYmFzZUhyZWY6IHN0cmluZykge31cblxuICBhc3luYyBwcm9jZXNzKGNvbmZpZzogQ29uZmlnKTogUHJvbWlzZTxPYmplY3Q+IHtcbiAgICBjb25zdCB1bm9yZGVyZWRIYXNoVGFibGUgPSB7fTtcbiAgICBjb25zdCBhc3NldEdyb3VwcyA9IGF3YWl0IHRoaXMucHJvY2Vzc0Fzc2V0R3JvdXBzKGNvbmZpZywgdW5vcmRlcmVkSGFzaFRhYmxlKTtcblxuICAgIHJldHVybiB7XG4gICAgICBjb25maWdWZXJzaW9uOiAxLFxuICAgICAgYXBwRGF0YTogY29uZmlnLmFwcERhdGEsXG4gICAgICBwdXNoOiBjb25maWcucHVzaCxcbiAgICAgIGluZGV4OiBqb2luVXJscyh0aGlzLmJhc2VIcmVmLCBjb25maWcuaW5kZXgpLCBhc3NldEdyb3VwcyxcbiAgICAgIGRhdGFHcm91cHM6IHRoaXMucHJvY2Vzc0RhdGFHcm91cHMoY29uZmlnKSxcbiAgICAgIGhhc2hUYWJsZTogd2l0aE9yZGVyZWRLZXlzKHVub3JkZXJlZEhhc2hUYWJsZSksXG4gICAgICBuYXZpZ2F0aW9uVXJsczogcHJvY2Vzc05hdmlnYXRpb25VcmxzKHRoaXMuYmFzZUhyZWYsIGNvbmZpZy5uYXZpZ2F0aW9uVXJscyksXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgcHJvY2Vzc0Fzc2V0R3JvdXBzKGNvbmZpZzogQ29uZmlnLCBoYXNoVGFibGU6IHtbZmlsZTogc3RyaW5nXTogc3RyaW5nIHwgdW5kZWZpbmVkfSk6XG4gICAgICBQcm9taXNlPE9iamVjdFtdPiB7XG4gICAgY29uc3Qgc2Vlbk1hcCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIHJldHVybiBQcm9taXNlLmFsbCgoY29uZmlnLmFzc2V0R3JvdXBzIHx8IFtdKS5tYXAoYXN5bmMoZ3JvdXApID0+IHtcbiAgICAgIGlmIChncm91cC5yZXNvdXJjZXMudmVyc2lvbmVkRmlsZXMpIHtcbiAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICAgYEFzc2V0LWdyb3VwICcke2dyb3VwLm5hbWV9JyBpbiAnbmdzdy1jb25maWcuanNvbicgdXNlcyB0aGUgJ3ZlcnNpb25lZEZpbGVzJyBvcHRpb24uXFxuYCArXG4gICAgICAgICAgICAnQXMgb2YgdjYgXFwndmVyc2lvbmVkRmlsZXNcXCcgYW5kIFxcJ2ZpbGVzXFwnIG9wdGlvbnMgaGF2ZSB0aGUgc2FtZSBiZWhhdmlvci4gJyArXG4gICAgICAgICAgICAnVXNlIFxcJ2ZpbGVzXFwnIGluc3RlYWQuJyk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGZpbGVNYXRjaGVyID0gZ2xvYkxpc3RUb01hdGNoZXIoZ3JvdXAucmVzb3VyY2VzLmZpbGVzIHx8IFtdKTtcbiAgICAgIGNvbnN0IHZlcnNpb25lZE1hdGNoZXIgPSBnbG9iTGlzdFRvTWF0Y2hlcihncm91cC5yZXNvdXJjZXMudmVyc2lvbmVkRmlsZXMgfHwgW10pO1xuXG4gICAgICBjb25zdCBhbGxGaWxlcyA9IGF3YWl0IHRoaXMuZnMubGlzdCgnLycpO1xuXG4gICAgICBjb25zdCBwbGFpbkZpbGVzID0gYWxsRmlsZXMuZmlsdGVyKGZpbGVNYXRjaGVyKS5maWx0ZXIoZmlsZSA9PiAhc2Vlbk1hcC5oYXMoZmlsZSkpO1xuICAgICAgcGxhaW5GaWxlcy5mb3JFYWNoKGZpbGUgPT4gc2Vlbk1hcC5hZGQoZmlsZSkpO1xuXG4gICAgICBjb25zdCB2ZXJzaW9uZWRGaWxlcyA9IGFsbEZpbGVzLmZpbHRlcih2ZXJzaW9uZWRNYXRjaGVyKS5maWx0ZXIoZmlsZSA9PiAhc2Vlbk1hcC5oYXMoZmlsZSkpO1xuICAgICAgdmVyc2lvbmVkRmlsZXMuZm9yRWFjaChmaWxlID0+IHNlZW5NYXAuYWRkKGZpbGUpKTtcblxuICAgICAgLy8gQWRkIHRoZSBoYXNoZXMuXG4gICAgICBjb25zdCBtYXRjaGVkRmlsZXMgPSBbLi4ucGxhaW5GaWxlcywgLi4udmVyc2lvbmVkRmlsZXNdLnNvcnQoKTtcbiAgICAgIGF3YWl0IG1hdGNoZWRGaWxlcy5yZWR1Y2UoYXN5bmMocHJldmlvdXMsIGZpbGUpID0+IHtcbiAgICAgICAgYXdhaXQgcHJldmlvdXM7XG4gICAgICAgIGNvbnN0IGhhc2ggPSBhd2FpdCB0aGlzLmZzLmhhc2goZmlsZSk7XG4gICAgICAgIGhhc2hUYWJsZVtqb2luVXJscyh0aGlzLmJhc2VIcmVmLCBmaWxlKV0gPSBoYXNoO1xuICAgICAgfSwgUHJvbWlzZS5yZXNvbHZlKCkpO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiBncm91cC5uYW1lLFxuICAgICAgICBpbnN0YWxsTW9kZTogZ3JvdXAuaW5zdGFsbE1vZGUgfHwgJ3ByZWZldGNoJyxcbiAgICAgICAgdXBkYXRlTW9kZTogZ3JvdXAudXBkYXRlTW9kZSB8fCBncm91cC5pbnN0YWxsTW9kZSB8fCAncHJlZmV0Y2gnLFxuICAgICAgICB1cmxzOiBtYXRjaGVkRmlsZXMubWFwKHVybCA9PiBqb2luVXJscyh0aGlzLmJhc2VIcmVmLCB1cmwpKSxcbiAgICAgICAgcGF0dGVybnM6IChncm91cC5yZXNvdXJjZXMudXJscyB8fCBbXSkubWFwKHVybCA9PiB1cmxUb1JlZ2V4KHVybCwgdGhpcy5iYXNlSHJlZiwgdHJ1ZSkpLFxuICAgICAgfTtcbiAgICB9KSk7XG4gIH1cblxuICBwcml2YXRlIHByb2Nlc3NEYXRhR3JvdXBzKGNvbmZpZzogQ29uZmlnKTogT2JqZWN0W10ge1xuICAgIHJldHVybiAoY29uZmlnLmRhdGFHcm91cHMgfHwgW10pLm1hcChncm91cCA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiBncm91cC5uYW1lLFxuICAgICAgICBwYXR0ZXJuczogZ3JvdXAudXJscy5tYXAodXJsID0+IHVybFRvUmVnZXgodXJsLCB0aGlzLmJhc2VIcmVmLCB0cnVlKSksXG4gICAgICAgIHN0cmF0ZWd5OiBncm91cC5jYWNoZUNvbmZpZy5zdHJhdGVneSB8fCAncGVyZm9ybWFuY2UnLFxuICAgICAgICBtYXhTaXplOiBncm91cC5jYWNoZUNvbmZpZy5tYXhTaXplLFxuICAgICAgICBtYXhBZ2U6IHBhcnNlRHVyYXRpb25Ub01zKGdyb3VwLmNhY2hlQ29uZmlnLm1heEFnZSksXG4gICAgICAgIHRpbWVvdXRNczogZ3JvdXAuY2FjaGVDb25maWcudGltZW91dCAmJiBwYXJzZUR1cmF0aW9uVG9Ncyhncm91cC5jYWNoZUNvbmZpZy50aW1lb3V0KSxcbiAgICAgICAgdmVyc2lvbjogZ3JvdXAudmVyc2lvbiAhPT0gdW5kZWZpbmVkID8gZ3JvdXAudmVyc2lvbiA6IDEsXG4gICAgICB9O1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm9jZXNzTmF2aWdhdGlvblVybHMoXG4gICAgYmFzZUhyZWY6IHN0cmluZywgdXJscyA9IERFRkFVTFRfTkFWSUdBVElPTl9VUkxTKToge3Bvc2l0aXZlOiBib29sZWFuLCByZWdleDogc3RyaW5nfVtdIHtcbiAgcmV0dXJuIHVybHMubWFwKHVybCA9PiB7XG4gICAgY29uc3QgcG9zaXRpdmUgPSAhdXJsLnN0YXJ0c1dpdGgoJyEnKTtcbiAgICB1cmwgPSBwb3NpdGl2ZSA/IHVybCA6IHVybC5zdWJzdHIoMSk7XG4gICAgcmV0dXJuIHtwb3NpdGl2ZSwgcmVnZXg6IGBeJHt1cmxUb1JlZ2V4KHVybCwgYmFzZUhyZWYpfSRgfTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGdsb2JMaXN0VG9NYXRjaGVyKGdsb2JzOiBzdHJpbmdbXSk6IChmaWxlOiBzdHJpbmcpID0+IGJvb2xlYW4ge1xuICBjb25zdCBwYXR0ZXJucyA9IGdsb2JzLm1hcChwYXR0ZXJuID0+IHtcbiAgICBpZiAocGF0dGVybi5zdGFydHNXaXRoKCchJykpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHBvc2l0aXZlOiBmYWxzZSxcbiAgICAgICAgcmVnZXg6IG5ldyBSZWdFeHAoJ14nICsgZ2xvYlRvUmVnZXgocGF0dGVybi5zdWJzdHIoMSkpICsgJyQnKSxcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHBvc2l0aXZlOiB0cnVlLFxuICAgICAgICByZWdleDogbmV3IFJlZ0V4cCgnXicgKyBnbG9iVG9SZWdleChwYXR0ZXJuKSArICckJyksXG4gICAgICB9O1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiAoZmlsZTogc3RyaW5nKSA9PiBtYXRjaGVzKGZpbGUsIHBhdHRlcm5zKTtcbn1cblxuZnVuY3Rpb24gbWF0Y2hlcyhmaWxlOiBzdHJpbmcsIHBhdHRlcm5zOiB7cG9zaXRpdmU6IGJvb2xlYW4sIHJlZ2V4OiBSZWdFeHB9W10pOiBib29sZWFuIHtcbiAgY29uc3QgcmVzID0gcGF0dGVybnMucmVkdWNlKChpc01hdGNoLCBwYXR0ZXJuKSA9PiB7XG4gICAgaWYgKHBhdHRlcm4ucG9zaXRpdmUpIHtcbiAgICAgIHJldHVybiBpc01hdGNoIHx8IHBhdHRlcm4ucmVnZXgudGVzdChmaWxlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGlzTWF0Y2ggJiYgIXBhdHRlcm4ucmVnZXgudGVzdChmaWxlKTtcbiAgICB9XG4gIH0sIGZhbHNlKTtcbiAgcmV0dXJuIHJlcztcbn1cblxuZnVuY3Rpb24gdXJsVG9SZWdleCh1cmw6IHN0cmluZywgYmFzZUhyZWY6IHN0cmluZywgbGl0ZXJhbFF1ZXN0aW9uTWFyaz86IGJvb2xlYW4pOiBzdHJpbmcge1xuICBpZiAoIXVybC5zdGFydHNXaXRoKCcvJykgJiYgdXJsLmluZGV4T2YoJzovLycpID09PSAtMSkge1xuICAgIHVybCA9IGpvaW5VcmxzKGJhc2VIcmVmLCB1cmwpO1xuICB9XG5cbiAgcmV0dXJuIGdsb2JUb1JlZ2V4KHVybCwgbGl0ZXJhbFF1ZXN0aW9uTWFyayk7XG59XG5cbmZ1bmN0aW9uIGpvaW5VcmxzKGE6IHN0cmluZywgYjogc3RyaW5nKTogc3RyaW5nIHtcbiAgaWYgKGEuZW5kc1dpdGgoJy8nKSAmJiBiLnN0YXJ0c1dpdGgoJy8nKSkge1xuICAgIHJldHVybiBhICsgYi5zdWJzdHIoMSk7XG4gIH0gZWxzZSBpZiAoIWEuZW5kc1dpdGgoJy8nKSAmJiAhYi5zdGFydHNXaXRoKCcvJykpIHtcbiAgICByZXR1cm4gYSArICcvJyArIGI7XG4gIH1cbiAgcmV0dXJuIGEgKyBiO1xufVxuXG5mdW5jdGlvbiB3aXRoT3JkZXJlZEtleXM8VCBleHRlbmRze1trZXk6IHN0cmluZ106IGFueX0+KHVub3JkZXJlZE9iajogVCk6IFQge1xuICBjb25zdCBvcmRlcmVkT2JqID0ge30gYXMgVDtcbiAgT2JqZWN0LmtleXModW5vcmRlcmVkT2JqKS5zb3J0KCkuZm9yRWFjaChrZXkgPT4gb3JkZXJlZE9ialtrZXldID0gdW5vcmRlcmVkT2JqW2tleV0pO1xuICByZXR1cm4gb3JkZXJlZE9iajtcbn1cbiJdfQ==