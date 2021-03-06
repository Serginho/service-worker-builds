/**
 * @fileoverview added by tsickle
 * Generated from: packages/service-worker/config/src/duration.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** @type {?} */
const PARSE_TO_PAIRS = /([0-9]+[^0-9]+)/g;
/** @type {?} */
const PAIR_SPLIT = /^([0-9]+)([dhmsu]+)$/;
/**
 * @param {?} duration
 * @return {?}
 */
export function parseDurationToMs(duration) {
    /** @type {?} */
    const matches = [];
    /** @type {?} */
    let array;
    while ((array = PARSE_TO_PAIRS.exec(duration)) !== null) {
        matches.push(array[0]);
    }
    return matches
        .map((/**
     * @param {?} match
     * @return {?}
     */
    match => {
        /** @type {?} */
        const res = PAIR_SPLIT.exec(match);
        if (res === null) {
            throw new Error(`Not a valid duration: ${match}`);
        }
        /** @type {?} */
        let factor = 0;
        switch (res[2]) {
            case 'd':
                factor = 86400000;
                break;
            case 'h':
                factor = 3600000;
                break;
            case 'm':
                factor = 60000;
                break;
            case 's':
                factor = 1000;
                break;
            case 'u':
                factor = 1;
                break;
            default:
                throw new Error(`Not a valid duration unit: ${res[2]}`);
        }
        return parseInt(res[1]) * factor;
    }))
        .reduce((/**
     * @param {?} total
     * @param {?} value
     * @return {?}
     */
    (total, value) => total + value), 0);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHVyYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9zZXJ2aWNlLXdvcmtlci9jb25maWcvc3JjL2R1cmF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7TUFRTSxjQUFjLEdBQUcsa0JBQWtCOztNQUNuQyxVQUFVLEdBQUcsc0JBQXNCOzs7OztBQUV6QyxNQUFNLFVBQVUsaUJBQWlCLENBQUMsUUFBZ0I7O1VBQzFDLE9BQU8sR0FBYSxFQUFFOztRQUV4QixLQUEyQjtJQUMvQixPQUFPLENBQUMsS0FBSyxHQUFHLGNBQWMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxJQUFJLEVBQUU7UUFDdkQsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUN4QjtJQUNELE9BQU8sT0FBTztTQUNULEdBQUc7Ozs7SUFBQyxLQUFLLENBQUMsRUFBRTs7Y0FDTCxHQUFHLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDbEMsSUFBSSxHQUFHLEtBQUssSUFBSSxFQUFFO1lBQ2hCLE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXlCLEtBQUssRUFBRSxDQUFDLENBQUM7U0FDbkQ7O1lBQ0csTUFBTSxHQUFXLENBQUM7UUFDdEIsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDZCxLQUFLLEdBQUc7Z0JBQ04sTUFBTSxHQUFHLFFBQVEsQ0FBQztnQkFDbEIsTUFBTTtZQUNSLEtBQUssR0FBRztnQkFDTixNQUFNLEdBQUcsT0FBTyxDQUFDO2dCQUNqQixNQUFNO1lBQ1IsS0FBSyxHQUFHO2dCQUNOLE1BQU0sR0FBRyxLQUFLLENBQUM7Z0JBQ2YsTUFBTTtZQUNSLEtBQUssR0FBRztnQkFDTixNQUFNLEdBQUcsSUFBSSxDQUFDO2dCQUNkLE1BQU07WUFDUixLQUFLLEdBQUc7Z0JBQ04sTUFBTSxHQUFHLENBQUMsQ0FBQztnQkFDWCxNQUFNO1lBQ1I7Z0JBQ0UsTUFBTSxJQUFJLEtBQUssQ0FBQyw4QkFBOEIsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUMzRDtRQUNELE9BQU8sUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztJQUNuQyxDQUFDLEVBQUM7U0FDRCxNQUFNOzs7OztJQUFDLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSyxHQUFHLEtBQUssR0FBRSxDQUFDLENBQUMsQ0FBQztBQUNsRCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5jb25zdCBQQVJTRV9UT19QQUlSUyA9IC8oWzAtOV0rW14wLTldKykvZztcbmNvbnN0IFBBSVJfU1BMSVQgPSAvXihbMC05XSspKFtkaG1zdV0rKSQvO1xuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VEdXJhdGlvblRvTXMoZHVyYXRpb246IHN0cmluZyk6IG51bWJlciB7XG4gIGNvbnN0IG1hdGNoZXM6IHN0cmluZ1tdID0gW107XG5cbiAgbGV0IGFycmF5OiBSZWdFeHBFeGVjQXJyYXl8bnVsbDtcbiAgd2hpbGUgKChhcnJheSA9IFBBUlNFX1RPX1BBSVJTLmV4ZWMoZHVyYXRpb24pKSAhPT0gbnVsbCkge1xuICAgIG1hdGNoZXMucHVzaChhcnJheVswXSk7XG4gIH1cbiAgcmV0dXJuIG1hdGNoZXNcbiAgICAgIC5tYXAobWF0Y2ggPT4ge1xuICAgICAgICBjb25zdCByZXMgPSBQQUlSX1NQTElULmV4ZWMobWF0Y2gpO1xuICAgICAgICBpZiAocmVzID09PSBudWxsKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBOb3QgYSB2YWxpZCBkdXJhdGlvbjogJHttYXRjaH1gKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZmFjdG9yOiBudW1iZXIgPSAwO1xuICAgICAgICBzd2l0Y2ggKHJlc1syXSkge1xuICAgICAgICAgIGNhc2UgJ2QnOlxuICAgICAgICAgICAgZmFjdG9yID0gODY0MDAwMDA7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdoJzpcbiAgICAgICAgICAgIGZhY3RvciA9IDM2MDAwMDA7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdtJzpcbiAgICAgICAgICAgIGZhY3RvciA9IDYwMDAwO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAncyc6XG4gICAgICAgICAgICBmYWN0b3IgPSAxMDAwO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAndSc6XG4gICAgICAgICAgICBmYWN0b3IgPSAxO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgTm90IGEgdmFsaWQgZHVyYXRpb24gdW5pdDogJHtyZXNbMl19YCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KHJlc1sxXSkgKiBmYWN0b3I7XG4gICAgICB9KVxuICAgICAgLnJlZHVjZSgodG90YWwsIHZhbHVlKSA9PiB0b3RhbCArIHZhbHVlLCAwKTtcbn1cbiJdfQ==