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
import { Injectable } from '@angular/core';
import { NEVER, Subject, merge } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { ERR_SW_NOT_SUPPORTED, NgswCommChannel } from './low_level';
/**
 * Subscribe and listen to push notifications from the Service Worker.
 *
 * \@publicApi
 */
export class SwPush {
    /**
     * @param {?} sw
     */
    constructor(sw) {
        this.sw = sw;
        this.subscriptionChanges = new Subject();
        if (!sw.isEnabled) {
            this.messages = NEVER;
            this.subscription = NEVER;
            return;
        }
        this.messages = this.sw.eventsOfType('PUSH').pipe(map(message => message.data));
        this.pushManager = this.sw.registration.pipe(map(registration => registration.pushManager));
        /** @type {?} */
        const workerDrivenSubscriptions = this.pushManager.pipe(switchMap(pm => pm.getSubscription()));
        this.subscription = merge(workerDrivenSubscriptions, this.subscriptionChanges);
        this.subscription.subscribe(subscription => {
            /** @type {?} */
            let pushData = {
                action: 'STATUS_PUSH',
                statusNonce: this.sw.generateNonce(),
                subscription: null
            };
            if (typeof (PushSubscription) === 'function' && subscription instanceof PushSubscription) {
                pushData.subscription = JSON.parse(JSON.stringify(subscription));
            }
            this.sw.postMessageWithStatus('STATUS_PUSH', pushData, pushData.statusNonce);
        });
    }
    /**
     * True if the Service Worker is enabled (supported by the browser and enabled via
     * `ServiceWorkerModule`).
     * @return {?}
     */
    get isEnabled() { return this.sw.isEnabled; }
    /**
     * @param {?} options
     * @return {?}
     */
    requestSubscription(options) {
        if (!this.sw.isEnabled) {
            return Promise.reject(new Error(ERR_SW_NOT_SUPPORTED));
        }
        /** @type {?} */
        const pushOptions = { userVisibleOnly: true };
        /** @type {?} */
        let key = this.decodeBase64(options.serverPublicKey.replace(/_/g, '/').replace(/-/g, '+'));
        /** @type {?} */
        let applicationServerKey = new Uint8Array(new ArrayBuffer(key.length));
        for (let i = 0; i < key.length; i++) {
            applicationServerKey[i] = key.charCodeAt(i);
        }
        pushOptions.applicationServerKey = applicationServerKey;
        return this.pushManager.pipe(switchMap(pm => pm.subscribe(pushOptions)), take(1))
            .toPromise()
            .then(sub => {
            this.subscriptionChanges.next(sub);
            return sub;
        });
    }
    /**
     * @return {?}
     */
    unsubscribe() {
        if (!this.sw.isEnabled) {
            return Promise.reject(new Error(ERR_SW_NOT_SUPPORTED));
        }
        /** @type {?} */
        const doUnsubscribe = (sub) => {
            if (sub === null) {
                throw new Error('Not subscribed to push notifications.');
            }
            return sub.unsubscribe().then(success => {
                if (!success) {
                    throw new Error('Unsubscribe failed!');
                }
                this.subscriptionChanges.next(null);
            });
        };
        return this.subscription.pipe(take(1), switchMap(doUnsubscribe)).toPromise();
    }
    /**
     * @param {?} input
     * @return {?}
     */
    decodeBase64(input) { return atob(input); }
}
SwPush.decorators = [
    { type: Injectable }
];
/** @nocollapse */
SwPush.ctorParameters = () => [
    { type: NgswCommChannel }
];
if (false) {
    /**
     * Emits the payloads of the received push notification messages.
     * @type {?}
     */
    SwPush.prototype.messages;
    /**
     * Emits the currently active
     * [PushSubscription](https://developer.mozilla.org/en-US/docs/Web/API/PushSubscription)
     * associated to the Service Worker registration or `null` if there is no subscription.
     * @type {?}
     */
    SwPush.prototype.subscription;
    /** @type {?} */
    SwPush.prototype.pushManager;
    /** @type {?} */
    SwPush.prototype.subscriptionChanges;
    /** @type {?} */
    SwPush.prototype.sw;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVzaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3NlcnZpY2Utd29ya2VyL3NyYy9wdXNoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUMsS0FBSyxFQUFjLE9BQU8sRUFBRSxLQUFLLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDdkQsT0FBTyxFQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFcEQsT0FBTyxFQUFDLG9CQUFvQixFQUFFLGVBQWUsRUFBWSxNQUFNLGFBQWEsQ0FBQzs7Ozs7O0FBUzdFLE1BQU0sT0FBTyxNQUFNOzs7O0lBdUJqQixZQUFvQixFQUFtQjtRQUFuQixPQUFFLEdBQUYsRUFBRSxDQUFpQjttQ0FGVCxJQUFJLE9BQU8sRUFBeUI7UUFHaEUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUU7WUFDakIsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7WUFDdEIsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7WUFDMUIsT0FBTztTQUNSO1FBRUQsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBWSxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFFM0YsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7O1FBRTVGLE1BQU0seUJBQXlCLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJ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RCxPQUFPLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ3RDLElBQUksQ0FBQyxPQUFPLEVBQUU7b0JBQ1osTUFBTSxJQUFJLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO2lCQUN4QztnQkFFRCxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3JDLENBQUMsQ0FBQztTQUNKLENBQUM7UUFFRixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztLQUM5RTs7Ozs7SUFFTyxZQUFZLENBQUMsS0FBYSxJQUFZLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDOzs7WUE3RmxFLFVBQVU7Ozs7WUFSbUIsZUFBZSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TkVWRVIsIE9ic2VydmFibGUsIFN1YmplY3QsIG1lcmdlfSBmcm9tICdyeGpzJztcbmltcG9ydCB7bWFwLCBzd2l0Y2hNYXAsIHRha2V9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtFUlJfU1dfTk9UX1NVUFBPUlRFRCwgTmdzd0NvbW1DaGFubmVsLCBQdXNoRXZlbnR9IGZyb20gJy4vbG93X2xldmVsJztcblxuXG4vKipcbiAqIFN1YnNjcmliZSBhbmQgbGlzdGVuIHRvIHB1c2ggbm90aWZpY2F0aW9ucyBmcm9tIHRoZSBTZXJ2aWNlIFdvcmtlci5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBTd1B1c2gge1xuICAvKipcbiAgICogRW1pdHMgdGhlIHBheWxvYWRzIG9mIHRoZSByZWNlaXZlZCBwdXNoIG5vdGlmaWNhdGlvbiBtZXNzYWdlcy5cbiAgICovXG4gIHJlYWRvbmx5IG1lc3NhZ2VzOiBPYnNlcnZhYmxlPG9iamVjdD47XG5cbiAgLyoqXG4gICAqIEVtaXRzIHRoZSBjdXJyZW50bHkgYWN0aXZlXG4gICAqIFtQdXNoU3Vic2NyaXB0aW9uXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvUHVzaFN1YnNjcmlwdGlvbilcbiAgICogYXNzb2NpYXRlZCB0byB0aGUgU2VydmljZSBXb3JrZXIgcmVnaXN0cmF0aW9uIG9yIGBudWxsYCBpZiB0aGVyZSBpcyBubyBzdWJzY3JpcHRpb24uXG4gICAqL1xuICByZWFkb25seSBzdWJzY3JpcHRpb246IE9ic2VydmFibGU8UHVzaFN1YnNjcmlwdGlvbnxudWxsPjtcblxuICAvKipcbiAgICogVHJ1ZSBpZiB0aGUgU2VydmljZSBXb3JrZXIgaXMgZW5hYmxlZCAoc3VwcG9ydGVkIGJ5IHRoZSBicm93c2VyIGFuZCBlbmFibGVkIHZpYVxuICAgKiBgU2VydmljZVdvcmtlck1vZHVsZWApLlxuICAgKi9cbiAgZ2V0IGlzRW5hYmxlZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuc3cuaXNFbmFibGVkOyB9XG5cbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIHByaXZhdGUgcHVzaE1hbmFnZXIgITogT2JzZXJ2YWJsZTxQdXNoTWFuYWdlcj47XG4gIHByaXZhdGUgc3Vic2NyaXB0aW9uQ2hhbmdlcyA9IG5ldyBTdWJqZWN0PFB1c2hTdWJzY3JpcHRpb258bnVsbD4oKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHN3OiBOZ3N3Q29tbUNoYW5uZWwpIHtcbiAgICBpZiAoIXN3LmlzRW5hYmxlZCkge1xuICAgICAgdGhpcy5tZXNzYWdlcyA9IE5FVkVSO1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb24gPSBORVZFUjtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLm1lc3NhZ2VzID0gdGhpcy5zdy5ldmVudHNPZlR5cGU8UHVzaEV2ZW50PignUFVTSCcpLnBpcGUobWFwKG1lc3NhZ2UgPT4gbWVzc2FnZS5kYXRhKSk7XG5cbiAgICB0aGlzLnB1c2hNYW5hZ2VyID0gdGhpcy5zdy5yZWdpc3RyYXRpb24ucGlwZShtYXAocmVnaXN0cmF0aW9uID0+IHJlZ2lzdHJhdGlvbi5wdXNoTWFuYWdlcikpO1xuXG4gICAgY29uc3Qgd29ya2VyRHJpdmVuU3Vic2NyaXB0aW9ucyA9IHRoaXMucHVzaE1hbmFnZXIucGlwZShzd2l0Y2hNYXAocG0gPT4gcG0uZ2V0U3Vic2NyaXB0aW9uKCkpKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbiA9IG1lcmdlKHdvcmtlckRyaXZlblN1YnNjcmlwdGlvbnMsIHRoaXMuc3Vic2NyaXB0aW9uQ2hhbmdlcyk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbi5zdWJzY3JpYmUoc3Vic2NyaXB0aW9uID0+IHtcbiAgICAgIGxldCBwdXNoRGF0YSA9IHtcbiAgICAgICAgYWN0aW9uOiAnU1RBVFVTX1BVU0gnLFxuICAgICAgICBzdGF0dXNOb25jZTogdGhpcy5zdy5nZW5lcmF0ZU5vbmNlKCksXG4gICAgICAgIHN1YnNjcmlwdGlvbjogbnVsbFxuICAgICAgfTtcbiAgICAgIGlmICh0eXBlb2YoUHVzaFN1YnNjcmlwdGlvbikgPT09ICdmdW5jdGlvbicgJiYgc3Vic2NyaXB0aW9uIGluc3RhbmNlb2YgUHVzaFN1YnNjcmlwdGlvbikge1xuICAgICAgICBwdXNoRGF0YS5zdWJzY3JpcHRpb24gPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHN1YnNjcmlwdGlvbikpO1xuICAgICAgfVxuICAgICAgdGhpcy5zdy5wb3N0TWVzc2FnZVdpdGhTdGF0dXMoJ1NUQVRVU19QVVNIJywgcHVzaERhdGEsIHB1c2hEYXRhLnN0YXR1c05vbmNlKTtcbiAgICB9KTtcbiAgfVxuXG4gIHJlcXVlc3RTdWJzY3JpcHRpb24ob3B0aW9uczoge3NlcnZlclB1YmxpY0tleTogc3RyaW5nfSk6IFByb21pc2U8UHVzaFN1YnNjcmlwdGlvbj4ge1xuICAgIGlmICghdGhpcy5zdy5pc0VuYWJsZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoRVJSX1NXX05PVF9TVVBQT1JURUQpKTtcbiAgICB9XG4gICAgY29uc3QgcHVzaE9wdGlvbnM6IFB1c2hTdWJzY3JpcHRpb25PcHRpb25zSW5pdCA9IHt1c2VyVmlzaWJsZU9ubHk6IHRydWV9O1xuICAgIGxldCBrZXkgPSB0aGlzLmRlY29kZUJhc2U2NChvcHRpb25zLnNlcnZlclB1YmxpY0tleS5yZXBsYWNlKC9fL2csICcvJykucmVwbGFjZSgvLS9nLCAnKycpKTtcbiAgICBsZXQgYXBwbGljYXRpb25TZXJ2ZXJLZXkgPSBuZXcgVWludDhBcnJheShuZXcgQXJyYXlCdWZmZXIoa2V5Lmxlbmd0aCkpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBhcHBsaWNhdGlvblNlcnZlcktleVtpXSA9IGtleS5jaGFyQ29kZUF0KGkpO1xuICAgIH1cbiAgICBwdXNoT3B0aW9ucy5hcHBsaWNhdGlvblNlcnZlcktleSA9IGFwcGxpY2F0aW9uU2VydmVyS2V5O1xuXG4gICAgcmV0dXJuIHRoaXMucHVzaE1hbmFnZXIucGlwZShzd2l0Y2hNYXAocG0gPT4gcG0uc3Vic2NyaWJlKHB1c2hPcHRpb25zKSksIHRha2UoMSkpXG4gICAgICAgIC50b1Byb21pc2UoKVxuICAgICAgICAudGhlbihzdWIgPT4ge1xuICAgICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uQ2hhbmdlcy5uZXh0KHN1Yik7XG4gICAgICAgICAgcmV0dXJuIHN1YjtcbiAgICAgICAgfSk7XG4gIH1cblxuICB1bnN1YnNjcmliZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoIXRoaXMuc3cuaXNFbmFibGVkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKEVSUl9TV19OT1RfU1VQUE9SVEVEKSk7XG4gICAgfVxuXG4gICAgY29uc3QgZG9VbnN1YnNjcmliZSA9IChzdWI6IFB1c2hTdWJzY3JpcHRpb24gfCBudWxsKSA9PiB7XG4gICAgICBpZiAoc3ViID09PSBudWxsKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTm90IHN1YnNjcmliZWQgdG8gcHVzaCBub3RpZmljYXRpb25zLicpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc3ViLnVuc3Vic2NyaWJlKCkudGhlbihzdWNjZXNzID0+IHtcbiAgICAgICAgaWYgKCFzdWNjZXNzKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbnN1YnNjcmliZSBmYWlsZWQhJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbkNoYW5nZXMubmV4dChudWxsKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICByZXR1cm4gdGhpcy5zdWJzY3JpcHRpb24ucGlwZSh0YWtlKDEpLCBzd2l0Y2hNYXAoZG9VbnN1YnNjcmliZSkpLnRvUHJvbWlzZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBkZWNvZGVCYXNlNjQoaW5wdXQ6IHN0cmluZyk6IHN0cmluZyB7IHJldHVybiBhdG9iKGlucHV0KTsgfVxufVxuIl19