/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { NEVER, Subject, merge } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { ERR_SW_NOT_SUPPORTED, NgswCommChannel } from './low_level';
/**
 * Subscribe and listen to push notifications from the Service Worker.
 *
 * @publicApi
 */
var SwPush = /** @class */ (function () {
    function SwPush(sw) {
        var _this = this;
        this.sw = sw;
        this.subscriptionChanges = new Subject();
        if (!sw.isEnabled) {
            this.messages = NEVER;
            this.notificationClicks = NEVER;
            this.subscription = NEVER;
            return;
        }
        this.messages = this.sw.eventsOfType('PUSH').pipe(map(function (message) { return message.data; }));
        this.notificationClicks =
            this.sw.eventsOfType('NOTIFICATION_CLICK').pipe(map(function (message) { return message.data; }));
        this.pushManager = this.sw.registration.pipe(map(function (registration) { return registration.pushManager; }));
        var workerDrivenSubscriptions = this.pushManager.pipe(switchMap(function (pm) { return pm.getSubscription(); }));
        this.subscription = merge(workerDrivenSubscriptions, this.subscriptionChanges);
        this.subscription.subscribe(function (subscription) {
            var pushData = {
                action: 'STATUS_PUSH',
                statusNonce: _this.sw.generateNonce(),
                subscription: null
            };
            if (typeof (PushSubscription) === 'function' && subscription instanceof PushSubscription) {
                pushData.subscription = JSON.parse(JSON.stringify(subscription));
            }
            _this.sw.postMessageWithStatus('STATUS_PUSH', pushData, pushData.statusNonce);
        });
    }
    Object.defineProperty(SwPush.prototype, "isEnabled", {
        /**
         * True if the Service Worker is enabled (supported by the browser and enabled via
         * `ServiceWorkerModule`).
         */
        get: function () { return this.sw.isEnabled; },
        enumerable: true,
        configurable: true
    });
    SwPush.prototype.requestSubscription = function (options) {
        var _this = this;
        if (!this.sw.isEnabled) {
            return Promise.reject(new Error(ERR_SW_NOT_SUPPORTED));
        }
        var pushOptions = { userVisibleOnly: true };
        var key = this.decodeBase64(options.serverPublicKey.replace(/_/g, '/').replace(/-/g, '+'));
        var applicationServerKey = new Uint8Array(new ArrayBuffer(key.length));
        for (var i = 0; i < key.length; i++) {
            applicationServerKey[i] = key.charCodeAt(i);
        }
        pushOptions.applicationServerKey = applicationServerKey;
        return this.pushManager.pipe(switchMap(function (pm) { return pm.subscribe(pushOptions); }), take(1))
            .toPromise()
            .then(function (sub) {
            _this.subscriptionChanges.next(sub);
            return sub;
        });
    };
    SwPush.prototype.unsubscribe = function () {
        var _this = this;
        if (!this.sw.isEnabled) {
            return Promise.reject(new Error(ERR_SW_NOT_SUPPORTED));
        }
        var doUnsubscribe = function (sub) {
            if (sub === null) {
                throw new Error('Not subscribed to push notifications.');
            }
            return sub.unsubscribe().then(function (success) {
                if (!success) {
                    throw new Error('Unsubscribe failed!');
                }
                _this.subscriptionChanges.next(null);
            });
        };
        return this.subscription.pipe(take(1), switchMap(doUnsubscribe)).toPromise();
    };
    SwPush.prototype.decodeBase64 = function (input) { return atob(input); };
    SwPush = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [NgswCommChannel])
    ], SwPush);
    return SwPush;
}());
export { SwPush };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVzaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3NlcnZpY2Utd29ya2VyL3NyYy9wdXNoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7QUFFSCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxLQUFLLEVBQWMsT0FBTyxFQUFFLEtBQUssRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUN2RCxPQUFPLEVBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUVwRCxPQUFPLEVBQUMsb0JBQW9CLEVBQUUsZUFBZSxFQUFZLE1BQU0sYUFBYSxDQUFDO0FBRzdFOzs7O0dBSUc7QUFFSDtJQXdDRSxnQkFBb0IsRUFBbUI7UUFBdkMsaUJBNkJDO1FBN0JtQixPQUFFLEdBQUYsRUFBRSxDQUFpQjtRQUYvQix3QkFBbUIsR0FBRyxJQUFJLE9BQU8sRUFBeUIsQ0FBQztRQUdqRSxJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRTtZQUNqQixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztZQUN0QixJQUFJLENBQUMsa0JBQWtCLEdBQUcsS0FBSyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO1lBQzFCLE9BQU87U0FDUjtRQUVELElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQVksTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFBLE9BQU8sSUFBSSxPQUFBLE9BQU8sQ0FBQyxJQUFJLEVBQVosQ0FBWSxDQUFDLENBQUMsQ0FBQztRQUUzRixJQUFJLENBQUMsa0JBQWtCO1lBQ25CLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLG9CQUFvQixDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcs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QWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge05FVkVSLCBPYnNlcnZhYmxlLCBTdWJqZWN0LCBtZXJnZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge21hcCwgc3dpdGNoTWFwLCB0YWtlfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7RVJSX1NXX05PVF9TVVBQT1JURUQsIE5nc3dDb21tQ2hhbm5lbCwgUHVzaEV2ZW50fSBmcm9tICcuL2xvd19sZXZlbCc7XG5cblxuLyoqXG4gKiBTdWJzY3JpYmUgYW5kIGxpc3RlbiB0byBwdXNoIG5vdGlmaWNhdGlvbnMgZnJvbSB0aGUgU2VydmljZSBXb3JrZXIuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU3dQdXNoIHtcbiAgLyoqXG4gICAqIEVtaXRzIHRoZSBwYXlsb2FkcyBvZiB0aGUgcmVjZWl2ZWQgcHVzaCBub3RpZmljYXRpb24gbWVzc2FnZXMuXG4gICAqL1xuICByZWFkb25seSBtZXNzYWdlczogT2JzZXJ2YWJsZTxvYmplY3Q+O1xuXG4gIC8qKlxuICAgKiBFbWl0cyB0aGUgcGF5bG9hZHMgb2YgdGhlIHJlY2VpdmVkIHB1c2ggbm90aWZpY2F0aW9uIG1lc3NhZ2VzIGFzIHdlbGwgYXMgdGhlIGFjdGlvbiB0aGUgdXNlclxuICAgKiBpbnRlcmFjdGVkIHdpdGguIElmIG5vIGFjdGlvbiB3YXMgdXNlZCB0aGUgYWN0aW9uIHByb3BlcnR5IHdpbGwgYmUgYW4gZW1wdHkgc3RyaW5nIGAnJ2AuXG4gICAqXG4gICAqIE5vdGUgdGhhdCB0aGUgYG5vdGlmaWNhdGlvbmAgcHJvcGVydHkgaXMgKipub3QqKiBhIFtOb3RpZmljYXRpb25dW01vemlsbGEgTm90aWZpY2F0aW9uXSBvYmplY3RcbiAgICogYnV0IHJhdGhlciBhXG4gICAqIFtOb3RpZmljYXRpb25PcHRpb25zXShodHRwczovL25vdGlmaWNhdGlvbnMuc3BlYy53aGF0d2cub3JnLyNkaWN0ZGVmLW5vdGlmaWNhdGlvbm9wdGlvbnMpXG4gICAqIG9iamVjdCB0aGF0IGFsc28gaW5jbHVkZXMgdGhlIGB0aXRsZWAgb2YgdGhlIFtOb3RpZmljYXRpb25dW01vemlsbGEgTm90aWZpY2F0aW9uXSBvYmplY3QuXG4gICAqXG4gICAqIFtNb3ppbGxhIE5vdGlmaWNhdGlvbl06IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9Ob3RpZmljYXRpb25cbiAgICovXG4gIHJlYWRvbmx5IG5vdGlmaWNhdGlvbkNsaWNrczogT2JzZXJ2YWJsZSA8IHtcbiAgICBhY3Rpb246IHN0cmluZztcbiAgICBub3RpZmljYXRpb246IE5vdGlmaWNhdGlvbk9wdGlvbnMmeyB0aXRsZTogc3RyaW5nIH1cbiAgfVxuICA+IDtcblxuICAvKipcbiAgICogRW1pdHMgdGhlIGN1cnJlbnRseSBhY3RpdmVcbiAgICogW1B1c2hTdWJzY3JpcHRpb25dKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9QdXNoU3Vic2NyaXB0aW9uKVxuICAgKiBhc3NvY2lhdGVkIHRvIHRoZSBTZXJ2aWNlIFdvcmtlciByZWdpc3RyYXRpb24gb3IgYG51bGxgIGlmIHRoZXJlIGlzIG5vIHN1YnNjcmlwdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IHN1YnNjcmlwdGlvbjogT2JzZXJ2YWJsZTxQdXNoU3Vic2NyaXB0aW9ufG51bGw+O1xuXG4gIC8qKlxuICAgKiBUcnVlIGlmIHRoZSBTZXJ2aWNlIFdvcmtlciBpcyBlbmFibGVkIChzdXBwb3J0ZWQgYnkgdGhlIGJyb3dzZXIgYW5kIGVuYWJsZWQgdmlhXG4gICAqIGBTZXJ2aWNlV29ya2VyTW9kdWxlYCkuXG4gICAqL1xuICBnZXQgaXNFbmFibGVkKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5zdy5pc0VuYWJsZWQ7IH1cblxuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgcHJpdmF0ZSBwdXNoTWFuYWdlciAhOiBPYnNlcnZhYmxlPFB1c2hNYW5hZ2VyPjtcbiAgcHJpdmF0ZSBzdWJzY3JpcHRpb25DaGFuZ2VzID0gbmV3IFN1YmplY3Q8UHVzaFN1YnNjcmlwdGlvbnxudWxsPigpO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgc3c6IE5nc3dDb21tQ2hhbm5lbCkge1xuICAgIGlmICghc3cuaXNFbmFibGVkKSB7XG4gICAgICB0aGlzLm1lc3NhZ2VzID0gTkVWRVI7XG4gICAgICB0aGlzLm5vdGlmaWNhdGlvbkNsaWNrcyA9IE5FVkVSO1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb24gPSBORVZFUjtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLm1lc3NhZ2VzID0gdGhpcy5zdy5ldmVudHNPZlR5cGU8UHVzaEV2ZW50PignUFVTSCcpLnBpcGUobWFwKG1lc3NhZ2UgPT4gbWVzc2FnZS5kYXRhKSk7XG5cbiAgICB0aGlzLm5vdGlmaWNhdGlvbkNsaWNrcyA9XG4gICAgICAgIHRoaXMuc3cuZXZlbnRzT2ZUeXBlKCdOT1RJRklDQVRJT05fQ0xJQ0snKS5waXBlKG1hcCgobWVzc2FnZTogYW55KSA9PiBtZXNzYWdlLmRhdGEpKTtcblxuICAgIHRoaXMucHVzaE1hbmFnZXIgPSB0aGlzLnN3LnJlZ2lzdHJhdGlvbi5waXBlKG1hcChyZWdpc3RyYXRpb24gPT4gcmVnaXN0cmF0aW9uLnB1c2hNYW5hZ2VyKSk7XG5cbiAgICBjb25zdCB3b3JrZXJEcml2ZW5TdWJzY3JpcHRpb25zID0gdGhpcy5wdXNoTWFuYWdlci5waXBlKHN3aXRjaE1hcChwbSA9PiBwbS5nZXRTdWJzY3JpcHRpb24oKSkpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9uID0gbWVyZ2Uod29ya2VyRHJpdmVuU3Vic2NyaXB0aW9ucywgdGhpcy5zdWJzY3JpcHRpb25DaGFuZ2VzKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9uLnN1YnNjcmliZShzdWJzY3JpcHRpb24gPT4ge1xuICAgICAgbGV0IHB1c2hEYXRhID0ge1xuICAgICAgICBhY3Rpb246ICdTVEFUVVNfUFVTSCcsXG4gICAgICAgIHN0YXR1c05vbmNlOiB0aGlzLnN3LmdlbmVyYXRlTm9uY2UoKSxcbiAgICAgICAgc3Vic2NyaXB0aW9uOiBudWxsXG4gICAgICB9O1xuICAgICAgaWYgKHR5cGVvZihQdXNoU3Vic2NyaXB0aW9uKSA9PT0gJ2Z1bmN0aW9uJyAmJiBzdWJzY3JpcHRpb24gaW5zdGFuY2VvZiBQdXNoU3Vic2NyaXB0aW9uKSB7XG4gICAgICAgIHB1c2hEYXRhLnN1YnNjcmlwdGlvbiA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoc3Vic2NyaXB0aW9uKSk7XG4gICAgICB9XG4gICAgICB0aGlzLnN3LnBvc3RNZXNzYWdlV2l0aFN0YXR1cygnU1RBVFVTX1BVU0gnLCBwdXNoRGF0YSwgcHVzaERhdGEuc3RhdHVzTm9uY2UpO1xuICAgIH0pO1xuICB9XG5cbiAgcmVxdWVzdFN1YnNjcmlwdGlvbihvcHRpb25zOiB7c2VydmVyUHVibGljS2V5OiBzdHJpbmd9KTogUHJvbWlzZTxQdXNoU3Vic2NyaXB0aW9uPiB7XG4gICAgaWYgKCF0aGlzLnN3LmlzRW5hYmxlZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihFUlJfU1dfTk9UX1NVUFBPUlRFRCkpO1xuICAgIH1cbiAgICBjb25zdCBwdXNoT3B0aW9uczogUHVzaFN1YnNjcmlwdGlvbk9wdGlvbnNJbml0ID0ge3VzZXJWaXNpYmxlT25seTogdHJ1ZX07XG4gICAgbGV0IGtleSA9IHRoaXMuZGVjb2RlQmFzZTY0KG9wdGlvbnMuc2VydmVyUHVibGljS2V5LnJlcGxhY2UoL18vZywgJy8nKS5yZXBsYWNlKC8tL2csICcrJykpO1xuICAgIGxldCBhcHBsaWNhdGlvblNlcnZlcktleSA9IG5ldyBVaW50OEFycmF5KG5ldyBBcnJheUJ1ZmZlcihrZXkubGVuZ3RoKSk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXkubGVuZ3RoOyBpKyspIHtcbiAgICAgIGFwcGxpY2F0aW9uU2VydmVyS2V5W2ldID0ga2V5LmNoYXJDb2RlQXQoaSk7XG4gICAgfVxuICAgIHB1c2hPcHRpb25zLmFwcGxpY2F0aW9uU2VydmVyS2V5ID0gYXBwbGljYXRpb25TZXJ2ZXJLZXk7XG5cbiAgICByZXR1cm4gdGhpcy5wdXNoTWFuYWdlci5waXBlKHN3aXRjaE1hcChwbSA9PiBwbS5zdWJzY3JpYmUocHVzaE9wdGlvbnMpKSwgdGFrZSgxKSlcbiAgICAgICAgLnRvUHJvbWlzZSgpXG4gICAgICAgIC50aGVuKHN1YiA9PiB7XG4gICAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25DaGFuZ2VzLm5leHQoc3ViKTtcbiAgICAgICAgICByZXR1cm4gc3ViO1xuICAgICAgICB9KTtcbiAgfVxuXG4gIHVuc3Vic2NyaWJlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghdGhpcy5zdy5pc0VuYWJsZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoRVJSX1NXX05PVF9TVVBQT1JURUQpKTtcbiAgICB9XG5cbiAgICBjb25zdCBkb1Vuc3Vic2NyaWJlID0gKHN1YjogUHVzaFN1YnNjcmlwdGlvbiB8IG51bGwpID0+IHtcbiAgICAgIGlmIChzdWIgPT09IG51bGwpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb3Qgc3Vic2NyaWJlZCB0byBwdXNoIG5vdGlmaWNhdGlvbnMuJyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdWIudW5zdWJzY3JpYmUoKS50aGVuKHN1Y2Nlc3MgPT4ge1xuICAgICAgICBpZiAoIXN1Y2Nlc3MpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vuc3Vic2NyaWJlIGZhaWxlZCEnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uQ2hhbmdlcy5uZXh0KG51bGwpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIHJldHVybiB0aGlzLnN1YnNjcmlwdGlvbi5waXBlKHRha2UoMSksIHN3aXRjaE1hcChkb1Vuc3Vic2NyaWJlKSkudG9Qcm9taXNlKCk7XG4gIH1cblxuICBwcml2YXRlIGRlY29kZUJhc2U2NChpbnB1dDogc3RyaW5nKTogc3RyaW5nIHsgcmV0dXJuIGF0b2IoaW5wdXQpOyB9XG59XG4iXX0=