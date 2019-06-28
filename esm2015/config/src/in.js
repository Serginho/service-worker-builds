/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * A top-level Angular Service Worker configuration object.
 *
 * \@publicApi
 * @record
 */
export function Config() { }
if (false) {
    /** @type {?|undefined} */
    Config.prototype.appData;
    /** @type {?} */
    Config.prototype.index;
    /** @type {?|undefined} */
    Config.prototype.push;
    /** @type {?|undefined} */
    Config.prototype.debug;
    /** @type {?|undefined} */
    Config.prototype.assetGroups;
    /** @type {?|undefined} */
    Config.prototype.dataGroups;
    /** @type {?|undefined} */
    Config.prototype.navigationUrls;
}
/**
 * Configuration for handling push subscription changes.
 *
 * \@experimental
 * @record
 */
export function PushConfig() { }
if (false) {
    /** @type {?} */
    PushConfig.prototype.url;
}
/**
 * Configuration for handling debugger.
 *
 * \@experimental
 * @record
 */
export function DebugConfig() { }
if (false) {
    /** @type {?} */
    DebugConfig.prototype.endpoint;
}
/**
 * Configuration for a particular group of assets.
 *
 * \@publicApi
 * @record
 */
export function AssetGroup() { }
if (false) {
    /** @type {?} */
    AssetGroup.prototype.name;
    /** @type {?|undefined} */
    AssetGroup.prototype.installMode;
    /** @type {?|undefined} */
    AssetGroup.prototype.updateMode;
    /** @type {?} */
    AssetGroup.prototype.resources;
}
/**
 * Configuration for a particular group of dynamic URLs.
 *
 * \@publicApi
 * @record
 */
export function DataGroup() { }
if (false) {
    /** @type {?} */
    DataGroup.prototype.name;
    /** @type {?} */
    DataGroup.prototype.urls;
    /** @type {?|undefined} */
    DataGroup.prototype.version;
    /** @type {?} */
    DataGroup.prototype.cacheConfig;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9zZXJ2aWNlLXdvcmtlci9jb25maWcvc3JjL2luLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBdUJBLDRCQVFDOzs7SUFQQyx5QkFBYTs7SUFDYix1QkFBYzs7SUFDZCxzQkFBa0I7O0lBQ2xCLHVCQUFvQjs7SUFDcEIsNkJBQTJCOztJQUMzQiw0QkFBeUI7O0lBQ3pCLGdDQUEwQjs7Ozs7Ozs7QUFTNUIsZ0NBQTRDOzs7SUFBZCx5QkFBWTs7Ozs7Ozs7QUFPMUMsaUNBQWtEOzs7SUFBbkIsK0JBQWlCOzs7Ozs7OztBQU9oRCxnQ0FXQzs7O0lBVkMsMEJBQWE7O0lBQ2IsaUNBQWdDOztJQUNoQyxnQ0FBK0I7O0lBQy9CLCtCQU1FOzs7Ozs7OztBQVFKLCtCQU9DOzs7SUFOQyx5QkFBYTs7SUFDYix5QkFBYTs7SUFDYiw0QkFBaUI7O0lBQ2pCLGdDQUVFIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vKipcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IHR5cGUgR2xvYiA9IHN0cmluZztcblxuLyoqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCB0eXBlIER1cmF0aW9uID0gc3RyaW5nO1xuXG4vKipcbiAqIEEgdG9wLWxldmVsIEFuZ3VsYXIgU2VydmljZSBXb3JrZXIgY29uZmlndXJhdGlvbiBvYmplY3QuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgaW50ZXJmYWNlIENvbmZpZyB7XG4gIGFwcERhdGE/OiB7fTtcbiAgaW5kZXg6IHN0cmluZztcbiAgcHVzaD86IFB1c2hDb25maWc7XG4gIGRlYnVnPzogRGVidWdDb25maWc7XG4gIGFzc2V0R3JvdXBzPzogQXNzZXRHcm91cFtdO1xuICBkYXRhR3JvdXBzPzogRGF0YUdyb3VwW107XG4gIG5hdmlnYXRpb25VcmxzPzogc3RyaW5nW107XG59XG5cblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIGZvciBoYW5kbGluZyBwdXNoIHN1YnNjcmlwdGlvbiBjaGFuZ2VzLlxuICpcbiAqIEBleHBlcmltZW50YWxcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBQdXNoQ29uZmlnIHsgdXJsOiBzdHJpbmc7IH1cblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIGZvciBoYW5kbGluZyBkZWJ1Z2dlci5cbiAqXG4gKiBAZXhwZXJpbWVudGFsXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRGVidWdDb25maWcgeyBlbmRwb2ludDogc3RyaW5nOyB9XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBmb3IgYSBwYXJ0aWN1bGFyIGdyb3VwIG9mIGFzc2V0cy5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQXNzZXRHcm91cCB7XG4gIG5hbWU6IHN0cmluZztcbiAgaW5zdGFsbE1vZGU/OiAncHJlZmV0Y2gnfCdsYXp5JztcbiAgdXBkYXRlTW9kZT86ICdwcmVmZXRjaCd8J2xhenknO1xuICByZXNvdXJjZXM6IHtcbiAgICBmaWxlcz86IEdsb2JbXTtcbiAgICAvKiogQGRlcHJlY2F0ZWQgQXMgb2YgdjYgYHZlcnNpb25lZEZpbGVzYCBhbmQgYGZpbGVzYCBvcHRpb25zIGhhdmUgdGhlIHNhbWUgYmVoYXZpb3IuIFVzZVxuICAgICAgIGBmaWxlc2AgaW5zdGVhZC4gKi9cbiAgICB2ZXJzaW9uZWRGaWxlcz86IEdsb2JbXTtcbiAgICB1cmxzPzogR2xvYltdO1xuICB9O1xufVxuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gZm9yIGEgcGFydGljdWxhciBncm91cCBvZiBkeW5hbWljIFVSTHMuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgaW50ZXJmYWNlIERhdGFHcm91cCB7XG4gIG5hbWU6IHN0cmluZztcbiAgdXJsczogR2xvYltdO1xuICB2ZXJzaW9uPzogbnVtYmVyO1xuICBjYWNoZUNvbmZpZzoge1xuICAgIG1heFNpemU6IG51bWJlcjsgbWF4QWdlOiBEdXJhdGlvbjsgdGltZW91dD86IER1cmF0aW9uOyBzdHJhdGVneT86ICdmcmVzaG5lc3MnIHwgJ3BlcmZvcm1hbmNlJztcbiAgfTtcbn1cbiJdfQ==