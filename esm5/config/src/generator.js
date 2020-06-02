/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter, __generator } from "tslib";
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
        return __awaiter(this, void 0, void 0, function () {
            var unorderedHashTable, assetGroups;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        unorderedHashTable = {};
                        return [4 /*yield*/, this.processAssetGroups(config, unorderedHashTable)];
                    case 1:
                        assetGroups = _a.sent();
                        return [2 /*return*/, {
                                configVersion: 1,
                                timestamp: Date.now(),
                                appData: config.appData,
                                push: config.push,
                                debug: config.debug,
                                index: joinUrls(this.baseHref, config.index),
                                assetGroups: assetGroups,
                                dataGroups: this.processDataGroups(config),
                                hashTable: withOrderedKeys(unorderedHashTable),
                                navigationUrls: processNavigationUrls(this.baseHref, config.navigationUrls),
                            }];
                }
            });
        });
    };
    Generator.prototype.processAssetGroups = function (config, hashTable) {
        return __awaiter(this, void 0, void 0, function () {
            var seenMap;
            var _this = this;
            return __generator(this, function (_a) {
                seenMap = new Set();
                return [2 /*return*/, Promise.all((config.assetGroups || []).map(function (group) { return __awaiter(_this, void 0, void 0, function () {
                        var fileMatcher, allFiles, matchedFiles;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (group.resources.versionedFiles) {
                                        throw new Error("Asset-group '" + group.name + "' in 'ngsw-config.json' uses the 'versionedFiles' option, " +
                                            'which is no longer supported. Use \'files\' instead.');
                                    }
                                    fileMatcher = globListToMatcher(group.resources.files || []);
                                    return [4 /*yield*/, this.fs.list('/')];
                                case 1:
                                    allFiles = _a.sent();
                                    matchedFiles = allFiles.filter(fileMatcher).filter(function (file) { return !seenMap.has(file); }).sort();
                                    matchedFiles.forEach(function (file) { return seenMap.add(file); });
                                    // Add the hashes.
                                    return [4 /*yield*/, matchedFiles.reduce(function (previous, file) { return __awaiter(_this, void 0, void 0, function () {
                                            var hash;
                                            return __generator(this, function (_a) {
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
                                    // Add the hashes.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvY29uZmlnL3NyYy9nZW5lcmF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUU3QyxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBR25DLElBQU0sdUJBQXVCLEdBQUc7SUFDOUIsS0FBSztJQUNMLFVBQVU7SUFDVixXQUFXO0lBQ1gsY0FBYztDQUNmLENBQUM7QUFFRjs7OztHQUlHO0FBQ0g7SUFDRSxtQkFBcUIsRUFBYyxFQUFVLFFBQWdCO1FBQXhDLE9BQUUsR0FBRixFQUFFLENBQVk7UUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFRO0lBQUcsQ0FBQztJQUUzRCwyQkFBTyxHQUFiLFVBQWMsTUFBYzs7Ozs7O3dCQUNwQixrQkFBa0IsR0FBRyxFQUFFLENBQUM7d0JBQ1YscUJBQU0sSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxrQkFBa0IsQ0FBQyxFQUFBOzt3QkFBdkUsV0FBVyxHQUFHLFNBQXlEO3dCQUU3RSxzQkFBTztnQ0FDTCxhQUFhLEVBQUUsQ0FBQztnQ0FDaEIsU0FBUyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUU7Z0NBQ3JCLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTztnQ0FDdkIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJO2dDQUNqQixLQUFLLEVBQUUsTUFBTSxDQUFDLEtBQUs7Z0NBQ25CLEtBQUssRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDO2dDQUM1QyxXQUFXLGFBQUE7Z0NBQ1gsVUFBVSxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUM7Z0NBQzFD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bGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtwYXJzZUR1cmF0aW9uVG9Nc30gZnJvbSAnLi9kdXJhdGlvbic7XG5pbXBvcnQge0ZpbGVzeXN0ZW19IGZyb20gJy4vZmlsZXN5c3RlbSc7XG5pbXBvcnQge2dsb2JUb1JlZ2V4fSBmcm9tICcuL2dsb2InO1xuaW1wb3J0IHtDb25maWd9IGZyb20gJy4vaW4nO1xuXG5jb25zdCBERUZBVUxUX05BVklHQVRJT05fVVJMUyA9IFtcbiAgJy8qKicsICAgICAgICAgICAvLyBJbmNsdWRlIGFsbCBVUkxzLlxuICAnIS8qKi8qLionLCAgICAgIC8vIEV4Y2x1ZGUgVVJMcyB0byBmaWxlcyAoY29udGFpbmluZyBhIGZpbGUgZXh0ZW5zaW9uIGluIHRoZSBsYXN0IHNlZ21lbnQpLlxuICAnIS8qKi8qX18qJywgICAgIC8vIEV4Y2x1ZGUgVVJMcyBjb250YWluaW5nIGBfX2AgaW4gdGhlIGxhc3Qgc2VnbWVudC5cbiAgJyEvKiovKl9fKi8qKicsICAvLyBFeGNsdWRlIFVSTHMgY29udGFpbmluZyBgX19gIGluIGFueSBvdGhlciBzZWdtZW50LlxuXTtcblxuLyoqXG4gKiBDb25zdW1lcyBzZXJ2aWNlIHdvcmtlciBjb25maWd1cmF0aW9uIGZpbGVzIGFuZCBwcm9jZXNzZXMgdGhlbSBpbnRvIGNvbnRyb2wgZmlsZXMuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgY2xhc3MgR2VuZXJhdG9yIHtcbiAgY29uc3RydWN0b3IocmVhZG9ubHkgZnM6IEZpbGVzeXN0ZW0sIHByaXZhdGUgYmFzZUhyZWY6IHN0cmluZykge31cblxuICBhc3luYyBwcm9jZXNzKGNvbmZpZzogQ29uZmlnKTogUHJvbWlzZTxPYmplY3Q+IHtcbiAgICBjb25zdCB1bm9yZGVyZWRIYXNoVGFibGUgPSB7fTtcbiAgICBjb25zdCBhc3NldEdyb3VwcyA9IGF3YWl0IHRoaXMucHJvY2Vzc0Fzc2V0R3JvdXBzKGNvbmZpZywgdW5vcmRlcmVkSGFzaFRhYmxlKTtcblxuICAgIHJldHVybiB7XG4gICAgICBjb25maWdWZXJzaW9uOiAxLFxuICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpLFxuICAgICAgYXBwRGF0YTogY29uZmlnLmFwcERhdGEsXG4gICAgICBwdXNoOiBjb25maWcucHVzaCxcbiAgICAgIGRlYnVnOiBjb25maWcuZGVidWcsXG4gICAgICBpbmRleDogam9pblVybHModGhpcy5iYXNlSHJlZiwgY29uZmlnLmluZGV4KSxcbiAgICAgIGFzc2V0R3JvdXBzLFxuICAgICAgZGF0YUdyb3VwczogdGhpcy5wcm9jZXNzRGF0YUdyb3Vwcyhjb25maWcpLFxuICAgICAgaGFzaFRhYmxlOiB3aXRoT3JkZXJlZEtleXModW5vcmRlcmVkSGFzaFRhYmxlKSxcbiAgICAgIG5hdmlnYXRpb25VcmxzOiBwcm9jZXNzTmF2aWdhdGlvblVybHModGhpcy5iYXNlSHJlZiwgY29uZmlnLm5hdmlnYXRpb25VcmxzKSxcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBwcm9jZXNzQXNzZXRHcm91cHMoY29uZmlnOiBDb25maWcsIGhhc2hUYWJsZToge1tmaWxlOiBzdHJpbmddOiBzdHJpbmd8dW5kZWZpbmVkfSk6XG4gICAgICBQcm9taXNlPE9iamVjdFtdPiB7XG4gICAgY29uc3Qgc2Vlbk1hcCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIHJldHVybiBQcm9taXNlLmFsbCgoY29uZmlnLmFzc2V0R3JvdXBzIHx8IFtdKS5tYXAoYXN5bmMgKGdyb3VwKSA9PiB7XG4gICAgICBpZiAoKGdyb3VwLnJlc291cmNlcyBhcyBhbnkpLnZlcnNpb25lZEZpbGVzKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgIGBBc3NldC1ncm91cCAnJHtncm91cC5uYW1lfScgaW4gJ25nc3ctY29uZmlnLmpzb24nIHVzZXMgdGhlICd2ZXJzaW9uZWRGaWxlcycgb3B0aW9uLCBgICtcbiAgICAgICAgICAgICd3aGljaCBpcyBubyBsb25nZXIgc3VwcG9ydGVkLiBVc2UgXFwnZmlsZXNcXCcgaW5zdGVhZC4nKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZmlsZU1hdGNoZXIgPSBnbG9iTGlzdFRvTWF0Y2hlcihncm91cC5yZXNvdXJjZXMuZmlsZXMgfHwgW10pO1xuICAgICAgY29uc3QgYWxsRmlsZXMgPSBhd2FpdCB0aGlzLmZzLmxpc3QoJy8nKTtcblxuICAgICAgY29uc3QgbWF0Y2hlZEZpbGVzID0gYWxsRmlsZXMuZmlsdGVyKGZpbGVNYXRjaGVyKS5maWx0ZXIoZmlsZSA9PiAhc2Vlbk1hcC5oYXMoZmlsZSkpLnNvcnQoKTtcbiAgICAgIG1hdGNoZWRGaWxlcy5mb3JFYWNoKGZpbGUgPT4gc2Vlbk1hcC5hZGQoZmlsZSkpO1xuXG4gICAgICAvLyBBZGQgdGhlIGhhc2hlcy5cbiAgICAgIGF3YWl0IG1hdGNoZWRGaWxlcy5yZWR1Y2UoYXN5bmMgKHByZXZpb3VzLCBmaWxlKSA9PiB7XG4gICAgICAgIGF3YWl0IHByZXZpb3VzO1xuICAgICAgICBjb25zdCBoYXNoID0gYXdhaXQgdGhpcy5mcy5oYXNoKGZpbGUpO1xuICAgICAgICBoYXNoVGFibGVbam9pblVybHModGhpcy5iYXNlSHJlZiwgZmlsZSldID0gaGFzaDtcbiAgICAgIH0sIFByb21pc2UucmVzb2x2ZSgpKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogZ3JvdXAubmFtZSxcbiAgICAgICAgaW5zdGFsbE1vZGU6IGdyb3VwLmluc3RhbGxNb2RlIHx8ICdwcmVmZXRjaCcsXG4gICAgICAgIHVwZGF0ZU1vZGU6IGdyb3VwLnVwZGF0ZU1vZGUgfHwgZ3JvdXAuaW5zdGFsbE1vZGUgfHwgJ3ByZWZldGNoJyxcbiAgICAgICAgdXJsczogbWF0Y2hlZEZpbGVzLm1hcCh1cmwgPT4gam9pblVybHModGhpcy5iYXNlSHJlZiwgdXJsKSksXG4gICAgICAgIHBhdHRlcm5zOiAoZ3JvdXAucmVzb3VyY2VzLnVybHMgfHwgW10pLm1hcCh1cmwgPT4gdXJsVG9SZWdleCh1cmwsIHRoaXMuYmFzZUhyZWYsIHRydWUpKSxcbiAgICAgIH07XG4gICAgfSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBwcm9jZXNzRGF0YUdyb3Vwcyhjb25maWc6IENvbmZpZyk6IE9iamVjdFtdIHtcbiAgICByZXR1cm4gKGNvbmZpZy5kYXRhR3JvdXBzIHx8IFtdKS5tYXAoZ3JvdXAgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogZ3JvdXAubmFtZSxcbiAgICAgICAgcGF0dGVybnM6IGdyb3VwLnVybHMubWFwKHVybCA9PiB1cmxUb1JlZ2V4KHVybCwgdGhpcy5iYXNlSHJlZiwgdHJ1ZSkpLFxuICAgICAgICBzdHJhdGVneTogZ3JvdXAuY2FjaGVDb25maWcuc3RyYXRlZ3kgfHwgJ3BlcmZvcm1hbmNlJyxcbiAgICAgICAgbWF4U2l6ZTogZ3JvdXAuY2FjaGVDb25maWcubWF4U2l6ZSxcbiAgICAgICAgbWF4QWdlOiBwYXJzZUR1cmF0aW9uVG9Ncyhncm91cC5jYWNoZUNvbmZpZy5tYXhBZ2UpLFxuICAgICAgICB0aW1lb3V0TXM6IGdyb3VwLmNhY2hlQ29uZmlnLnRpbWVvdXQgJiYgcGFyc2VEdXJhdGlvblRvTXMoZ3JvdXAuY2FjaGVDb25maWcudGltZW91dCksXG4gICAgICAgIHZlcnNpb246IGdyb3VwLnZlcnNpb24gIT09IHVuZGVmaW5lZCA/IGdyb3VwLnZlcnNpb24gOiAxLFxuICAgICAgfTtcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJvY2Vzc05hdmlnYXRpb25VcmxzKFxuICAgIGJhc2VIcmVmOiBzdHJpbmcsIHVybHMgPSBERUZBVUxUX05BVklHQVRJT05fVVJMUyk6IHtwb3NpdGl2ZTogYm9vbGVhbiwgcmVnZXg6IHN0cmluZ31bXSB7XG4gIHJldHVybiB1cmxzLm1hcCh1cmwgPT4ge1xuICAgIGNvbnN0IHBvc2l0aXZlID0gIXVybC5zdGFydHNXaXRoKCchJyk7XG4gICAgdXJsID0gcG9zaXRpdmUgPyB1cmwgOiB1cmwuc3Vic3RyKDEpO1xuICAgIHJldHVybiB7cG9zaXRpdmUsIHJlZ2V4OiBgXiR7dXJsVG9SZWdleCh1cmwsIGJhc2VIcmVmKX0kYH07XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBnbG9iTGlzdFRvTWF0Y2hlcihnbG9iczogc3RyaW5nW10pOiAoZmlsZTogc3RyaW5nKSA9PiBib29sZWFuIHtcbiAgY29uc3QgcGF0dGVybnMgPSBnbG9icy5tYXAocGF0dGVybiA9PiB7XG4gICAgaWYgKHBhdHRlcm4uc3RhcnRzV2l0aCgnIScpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwb3NpdGl2ZTogZmFsc2UsXG4gICAgICAgIHJlZ2V4OiBuZXcgUmVnRXhwKCdeJyArIGdsb2JUb1JlZ2V4KHBhdHRlcm4uc3Vic3RyKDEpKSArICckJyksXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwb3NpdGl2ZTogdHJ1ZSxcbiAgICAgICAgcmVnZXg6IG5ldyBSZWdFeHAoJ14nICsgZ2xvYlRvUmVnZXgocGF0dGVybikgKyAnJCcpLFxuICAgICAgfTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gKGZpbGU6IHN0cmluZykgPT4gbWF0Y2hlcyhmaWxlLCBwYXR0ZXJucyk7XG59XG5cbmZ1bmN0aW9uIG1hdGNoZXMoZmlsZTogc3RyaW5nLCBwYXR0ZXJuczoge3Bvc2l0aXZlOiBib29sZWFuLCByZWdleDogUmVnRXhwfVtdKTogYm9vbGVhbiB7XG4gIGNvbnN0IHJlcyA9IHBhdHRlcm5zLnJlZHVjZSgoaXNNYXRjaCwgcGF0dGVybikgPT4ge1xuICAgIGlmIChwYXR0ZXJuLnBvc2l0aXZlKSB7XG4gICAgICByZXR1cm4gaXNNYXRjaCB8fCBwYXR0ZXJuLnJlZ2V4LnRlc3QoZmlsZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBpc01hdGNoICYmICFwYXR0ZXJuLnJlZ2V4LnRlc3QoZmlsZSk7XG4gICAgfVxuICB9LCBmYWxzZSk7XG4gIHJldHVybiByZXM7XG59XG5cbmZ1bmN0aW9uIHVybFRvUmVnZXgodXJsOiBzdHJpbmcsIGJhc2VIcmVmOiBzdHJpbmcsIGxpdGVyYWxRdWVzdGlvbk1hcms/OiBib29sZWFuKTogc3RyaW5nIHtcbiAgaWYgKCF1cmwuc3RhcnRzV2l0aCgnLycpICYmIHVybC5pbmRleE9mKCc6Ly8nKSA9PT0gLTEpIHtcbiAgICB1cmwgPSBqb2luVXJscyhiYXNlSHJlZiwgdXJsKTtcbiAgfVxuXG4gIHJldHVybiBnbG9iVG9SZWdleCh1cmwsIGxpdGVyYWxRdWVzdGlvbk1hcmspO1xufVxuXG5mdW5jdGlvbiBqb2luVXJscyhhOiBzdHJpbmcsIGI6IHN0cmluZyk6IHN0cmluZyB7XG4gIGlmIChhLmVuZHNXaXRoKCcvJykgJiYgYi5zdGFydHNXaXRoKCcvJykpIHtcbiAgICByZXR1cm4gYSArIGIuc3Vic3RyKDEpO1xuICB9IGVsc2UgaWYgKCFhLmVuZHNXaXRoKCcvJykgJiYgIWIuc3RhcnRzV2l0aCgnLycpKSB7XG4gICAgcmV0dXJuIGEgKyAnLycgKyBiO1xuICB9XG4gIHJldHVybiBhICsgYjtcbn1cblxuZnVuY3Rpb24gd2l0aE9yZGVyZWRLZXlzPFQgZXh0ZW5kcyB7W2tleTogc3RyaW5nXTogYW55fT4odW5vcmRlcmVkT2JqOiBUKTogVCB7XG4gIGNvbnN0IG9yZGVyZWRPYmogPSB7fSBhcyB7W2tleTogc3RyaW5nXTogYW55fTtcbiAgT2JqZWN0LmtleXModW5vcmRlcmVkT2JqKS5zb3J0KCkuZm9yRWFjaChrZXkgPT4gb3JkZXJlZE9ialtrZXldID0gdW5vcmRlcmVkT2JqW2tleV0pO1xuICByZXR1cm4gb3JkZXJlZE9iaiBhcyBUO1xufVxuIl19