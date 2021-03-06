/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __read, __spread } from "tslib";
var QUESTION_MARK = '[^/]';
var WILD_SINGLE = '[^/]*';
var WILD_OPEN = '(?:.+\\/)?';
var TO_ESCAPE_BASE = [
    { replace: /\./g, with: '\\.' },
    { replace: /\+/g, with: '\\+' },
    { replace: /\*/g, with: WILD_SINGLE },
];
var TO_ESCAPE_WILDCARD_QM = __spread(TO_ESCAPE_BASE, [
    { replace: /\?/g, with: QUESTION_MARK },
]);
var TO_ESCAPE_LITERAL_QM = __spread(TO_ESCAPE_BASE, [
    { replace: /\?/g, with: '\\?' },
]);
export function globToRegex(glob, literalQuestionMark) {
    if (literalQuestionMark === void 0) { literalQuestionMark = false; }
    var toEscape = literalQuestionMark ? TO_ESCAPE_LITERAL_QM : TO_ESCAPE_WILDCARD_QM;
    var segments = glob.split('/').reverse();
    var regex = '';
    while (segments.length > 0) {
        var segment = segments.pop();
        if (segment === '**') {
            if (segments.length > 0) {
                regex += WILD_OPEN;
            }
            else {
                regex += '.*';
            }
        }
        else {
            var processed = toEscape.reduce(function (segment, escape) { return segment.replace(escape.replace, escape.with); }, segment);
            regex += processed;
            if (segments.length > 0) {
                regex += '\\/';
            }
        }
    }
    return regex;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2xvYi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3NlcnZpY2Utd29ya2VyL2NvbmZpZy9zcmMvZ2xvYi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsSUFBTSxhQUFhLEdBQUcsTUFBTSxDQUFDO0FBQzdCLElBQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQztBQUM1QixJQUFNLFNBQVMsR0FBRyxZQUFZLENBQUM7QUFFL0IsSUFBTSxjQUFjLEdBQUc7SUFDckIsRUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUM7SUFDN0IsRUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUM7SUFDN0IsRUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUM7Q0FDcEMsQ0FBQztBQUNGLElBQU0scUJBQXFCLFlBQ3RCLGNBQWM7SUFDakIsRUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUM7RUFDdEMsQ0FBQztBQUNGLElBQU0sb0JBQW9CLFlBQ3JCLGNBQWM7SUFDakIsRUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUM7RUFDOUIsQ0FBQztBQUVGLE1BQU0sVUFBVSxXQUFXLENBQUMsSUFBWSxFQUFFLG1CQUEyQjtJQUEzQixvQ0FBQSxFQUFBLDJCQUEyQjtJQUNuRSxJQUFNLFFBQVEsR0FBRyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixDQUFDO0lBQ3BGLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDM0MsSUFBSSxLQUFLLEdBQVcsRUFBRSxDQUFDO0lBQ3ZCLE9BQU8sUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7UUFDMUIsSUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLEdBQUcsRUFBRyxDQUFDO1FBQ2hDLElBQUksT0FBTyxLQUFLLElBQUksRUFBRTtZQUNwQixJQUFJLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUN2QixLQUFLLElBQUksU0FBUyxDQUFDO2FBQ3BCO2lCQUFNO2dCQUNMLEtBQUssSUFBSSxJQUFJLENBQUM7YUFDZjtTQUNGO2FBQU07WUFDTCxJQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUM3QixVQUFDLE9BQU8sRUFBRSxNQUFNLElBQUssT0FBQSxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUE1QyxDQUE0QyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ2hGLEtBQUssSUFBSSxTQUFTLENBQUM7WUFDbkIsSUFBSSxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDdkIsS0FBSyxJQUFJLEtBQUssQ0FBQzthQUNoQjtTQUNGO0tBQ0Y7SUFDRCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmNvbnN0IFFVRVNUSU9OX01BUksgPSAnW14vXSc7XG5jb25zdCBXSUxEX1NJTkdMRSA9ICdbXi9dKic7XG5jb25zdCBXSUxEX09QRU4gPSAnKD86LitcXFxcLyk/JztcblxuY29uc3QgVE9fRVNDQVBFX0JBU0UgPSBbXG4gIHtyZXBsYWNlOiAvXFwuL2csIHdpdGg6ICdcXFxcLid9LFxuICB7cmVwbGFjZTogL1xcKy9nLCB3aXRoOiAnXFxcXCsnfSxcbiAge3JlcGxhY2U6IC9cXCovZywgd2l0aDogV0lMRF9TSU5HTEV9LFxuXTtcbmNvbnN0IFRPX0VTQ0FQRV9XSUxEQ0FSRF9RTSA9IFtcbiAgLi4uVE9fRVNDQVBFX0JBU0UsXG4gIHtyZXBsYWNlOiAvXFw/L2csIHdpdGg6IFFVRVNUSU9OX01BUkt9LFxuXTtcbmNvbnN0IFRPX0VTQ0FQRV9MSVRFUkFMX1FNID0gW1xuICAuLi5UT19FU0NBUEVfQkFTRSxcbiAge3JlcGxhY2U6IC9cXD8vZywgd2l0aDogJ1xcXFw/J30sXG5dO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2xvYlRvUmVnZXgoZ2xvYjogc3RyaW5nLCBsaXRlcmFsUXVlc3Rpb25NYXJrID0gZmFsc2UpOiBzdHJpbmcge1xuICBjb25zdCB0b0VzY2FwZSA9IGxpdGVyYWxRdWVzdGlvbk1hcmsgPyBUT19FU0NBUEVfTElURVJBTF9RTSA6IFRPX0VTQ0FQRV9XSUxEQ0FSRF9RTTtcbiAgY29uc3Qgc2VnbWVudHMgPSBnbG9iLnNwbGl0KCcvJykucmV2ZXJzZSgpO1xuICBsZXQgcmVnZXg6IHN0cmluZyA9ICcnO1xuICB3aGlsZSAoc2VnbWVudHMubGVuZ3RoID4gMCkge1xuICAgIGNvbnN0IHNlZ21lbnQgPSBzZWdtZW50cy5wb3AoKSE7XG4gICAgaWYgKHNlZ21lbnQgPT09ICcqKicpIHtcbiAgICAgIGlmIChzZWdtZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJlZ2V4ICs9IFdJTERfT1BFTjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlZ2V4ICs9ICcuKic7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHByb2Nlc3NlZCA9IHRvRXNjYXBlLnJlZHVjZShcbiAgICAgICAgICAoc2VnbWVudCwgZXNjYXBlKSA9PiBzZWdtZW50LnJlcGxhY2UoZXNjYXBlLnJlcGxhY2UsIGVzY2FwZS53aXRoKSwgc2VnbWVudCk7XG4gICAgICByZWdleCArPSBwcm9jZXNzZWQ7XG4gICAgICBpZiAoc2VnbWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICByZWdleCArPSAnXFxcXC8nO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcmVnZXg7XG59XG4iXX0=