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
            this.subscription = NEVER;
            return;
        }
        this.messages = this.sw.eventsOfType('PUSH').pipe(map(function (message) { return message.data; }));
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVzaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3NlcnZpY2Utd29ya2VyL3NyYy9wdXNoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7QUFFSCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxLQUFLLEVBQWMsT0FBTyxFQUFFLEtBQUssRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUN2RCxPQUFPLEVBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUVwRCxPQUFPLEVBQUMsb0JBQW9CLEVBQUUsZUFBZSxFQUFZLE1BQU0sYUFBYSxDQUFDO0FBRzdFOzs7O0dBSUc7QUFFSDtJQXVCRSxnQkFBb0IsRUFBbUI7UUFBdkMsaUJBeUJDO1FBekJtQixPQUFFLEdBQUYsRUFBRSxDQUFpQjtRQUYvQix3QkFBbUIsR0FBRyxJQUFJLE9BQU8sRUFBeUIsQ0FBQztRQUdqRSxJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRTtZQUNqQixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztZQUN0QixJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztZQUMxQixPQUFPO1NBQ1I7UUFFRCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFZLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQSxPQUFPLElBQUksT0FBQSxPQUFPLENBQUMsSUFBSSxFQUFaLENBQVksQ0FBQyxDQUFDLENBQUM7UUFFM0YsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUEsWUFBWSxJQUFJLE9BQUEsWUFBWSxDQUFDLFdBQVcsRUFBeEIsQ0FBd0IsQ0FBQyxD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QUMsQ0FBQyxDQUFDO1NBQ3hEO1FBRUQsSUFBTSxhQUFhLEdBQUcsVUFBQyxHQUE0QjtZQUNqRCxJQUFJLEdBQUcsS0FBSyxJQUFJLEVBQUU7Z0JBQ2hCLE1BQU0sSUFBSSxLQUFLLENBQUMsdUNBQXVDLENBQUMsQ0FBQzthQUMxRDtZQUVELE9BQU8sR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFBLE9BQU87Z0JBQ25DLElBQUksQ0FBQyxPQUFPLEVBQUU7b0JBQ1osTUFBTSxJQUFJLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO2lCQUN4QztnQkFFRCxLQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3RDLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDO1FBRUYsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDL0UsQ0FBQztJQUVPLDZCQUFZLEdBQXBCLFVBQXFCLEtBQWEsSUFBWSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUE1RnhELE1BQU07UUFEbEIsVUFBVSxFQUFFO2lEQXdCYSxlQUFlO09BdkI1QixNQUFNLENBNkZsQjtJQUFELGFBQUM7Q0FBQSxBQTdGRCxJQTZGQztTQTdGWSxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtORVZFUiwgT2JzZXJ2YWJsZSwgU3ViamVjdCwgbWVyZ2V9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHttYXAsIHN3aXRjaE1hcCwgdGFrZX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge0VSUl9TV19OT1RfU1VQUE9SVEVELCBOZ3N3Q29tbUNoYW5uZWwsIFB1c2hFdmVudH0gZnJvbSAnLi9sb3dfbGV2ZWwnO1xuXG5cbi8qKlxuICogU3Vic2NyaWJlIGFuZCBsaXN0ZW4gdG8gcHVzaCBub3RpZmljYXRpb25zIGZyb20gdGhlIFNlcnZpY2UgV29ya2VyLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFN3UHVzaCB7XG4gIC8qKlxuICAgKiBFbWl0cyB0aGUgcGF5bG9hZHMgb2YgdGhlIHJlY2VpdmVkIHB1c2ggbm90aWZpY2F0aW9uIG1lc3NhZ2VzLlxuICAgKi9cbiAgcmVhZG9ubHkgbWVzc2FnZXM6IE9ic2VydmFibGU8b2JqZWN0PjtcblxuICAvKipcbiAgICogRW1pdHMgdGhlIGN1cnJlbnRseSBhY3RpdmVcbiAgICogW1B1c2hTdWJzY3JpcHRpb25dKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9QdXNoU3Vic2NyaXB0aW9uKVxuICAgKiBhc3NvY2lhdGVkIHRvIHRoZSBTZXJ2aWNlIFdvcmtlciByZWdpc3RyYXRpb24gb3IgYG51bGxgIGlmIHRoZXJlIGlzIG5vIHN1YnNjcmlwdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IHN1YnNjcmlwdGlvbjogT2JzZXJ2YWJsZTxQdXNoU3Vic2NyaXB0aW9ufG51bGw+O1xuXG4gIC8qKlxuICAgKiBUcnVlIGlmIHRoZSBTZXJ2aWNlIFdvcmtlciBpcyBlbmFibGVkIChzdXBwb3J0ZWQgYnkgdGhlIGJyb3dzZXIgYW5kIGVuYWJsZWQgdmlhXG4gICAqIGBTZXJ2aWNlV29ya2VyTW9kdWxlYCkuXG4gICAqL1xuICBnZXQgaXNFbmFibGVkKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5zdy5pc0VuYWJsZWQ7IH1cblxuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgcHJpdmF0ZSBwdXNoTWFuYWdlciAhOiBPYnNlcnZhYmxlPFB1c2hNYW5hZ2VyPjtcbiAgcHJpdmF0ZSBzdWJzY3JpcHRpb25DaGFuZ2VzID0gbmV3IFN1YmplY3Q8UHVzaFN1YnNjcmlwdGlvbnxudWxsPigpO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgc3c6IE5nc3dDb21tQ2hhbm5lbCkge1xuICAgIGlmICghc3cuaXNFbmFibGVkKSB7XG4gICAgICB0aGlzLm1lc3NhZ2VzID0gTkVWRVI7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbiA9IE5FVkVSO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMubWVzc2FnZXMgPSB0aGlzLnN3LmV2ZW50c09mVHlwZTxQdXNoRXZlbnQ+KCdQVVNIJykucGlwZShtYXAobWVzc2FnZSA9PiBtZXNzYWdlLmRhdGEpKTtcblxuICAgIHRoaXMucHVzaE1hbmFnZXIgPSB0aGlzLnN3LnJlZ2lzdHJhdGlvbi5waXBlKG1hcChyZWdpc3RyYXRpb24gPT4gcmVnaXN0cmF0aW9uLnB1c2hNYW5hZ2VyKSk7XG5cbiAgICBjb25zdCB3b3JrZXJEcml2ZW5TdWJzY3JpcHRpb25zID0gdGhpcy5wdXNoTWFuYWdlci5waXBlKHN3aXRjaE1hcChwbSA9PiBwbS5nZXRTdWJzY3JpcHRpb24oKSkpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9uID0gbWVyZ2Uod29ya2VyRHJpdmVuU3Vic2NyaXB0aW9ucywgdGhpcy5zdWJzY3JpcHRpb25DaGFuZ2VzKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9uLnN1YnNjcmliZShzdWJzY3JpcHRpb24gPT4ge1xuICAgICAgbGV0IHB1c2hEYXRhID0ge1xuICAgICAgICBhY3Rpb246ICdTVEFUVVNfUFVTSCcsXG4gICAgICAgIHN0YXR1c05vbmNlOiB0aGlzLnN3LmdlbmVyYXRlTm9uY2UoKSxcbiAgICAgICAgc3Vic2NyaXB0aW9uOiBudWxsXG4gICAgICB9O1xuICAgICAgaWYgKHR5cGVvZihQdXNoU3Vic2NyaXB0aW9uKSA9PT0gJ2Z1bmN0aW9uJyAmJiBzdWJzY3JpcHRpb24gaW5zdGFuY2VvZiBQdXNoU3Vic2NyaXB0aW9uKSB7XG4gICAgICAgIHB1c2hEYXRhLnN1YnNjcmlwdGlvbiA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoc3Vic2NyaXB0aW9uKSk7XG4gICAgICB9XG4gICAgICB0aGlzLnN3LnBvc3RNZXNzYWdlV2l0aFN0YXR1cygnU1RBVFVTX1BVU0gnLCBwdXNoRGF0YSwgcHVzaERhdGEuc3RhdHVzTm9uY2UpO1xuICAgIH0pO1xuICB9XG5cbiAgcmVxdWVzdFN1YnNjcmlwdGlvbihvcHRpb25zOiB7c2VydmVyUHVibGljS2V5OiBzdHJpbmd9KTogUHJvbWlzZTxQdXNoU3Vic2NyaXB0aW9uPiB7XG4gICAgaWYgKCF0aGlzLnN3LmlzRW5hYmxlZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihFUlJfU1dfTk9UX1NVUFBPUlRFRCkpO1xuICAgIH1cbiAgICBjb25zdCBwdXNoT3B0aW9uczogUHVzaFN1YnNjcmlwdGlvbk9wdGlvbnNJbml0ID0ge3VzZXJWaXNpYmxlT25seTogdHJ1ZX07XG4gICAgbGV0IGtleSA9IHRoaXMuZGVjb2RlQmFzZTY0KG9wdGlvbnMuc2VydmVyUHVibGljS2V5LnJlcGxhY2UoL18vZywgJy8nKS5yZXBsYWNlKC8tL2csICcrJykpO1xuICAgIGxldCBhcHBsaWNhdGlvblNlcnZlcktleSA9IG5ldyBVaW50OEFycmF5KG5ldyBBcnJheUJ1ZmZlcihrZXkubGVuZ3RoKSk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXkubGVuZ3RoOyBpKyspIHtcbiAgICAgIGFwcGxpY2F0aW9uU2VydmVyS2V5W2ldID0ga2V5LmNoYXJDb2RlQXQoaSk7XG4gICAgfVxuICAgIHB1c2hPcHRpb25zLmFwcGxpY2F0aW9uU2VydmVyS2V5ID0gYXBwbGljYXRpb25TZXJ2ZXJLZXk7XG5cbiAgICByZXR1cm4gdGhpcy5wdXNoTWFuYWdlci5waXBlKHN3aXRjaE1hcChwbSA9PiBwbS5zdWJzY3JpYmUocHVzaE9wdGlvbnMpKSwgdGFrZSgxKSlcbiAgICAgICAgLnRvUHJvbWlzZSgpXG4gICAgICAgIC50aGVuKHN1YiA9PiB7XG4gICAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25DaGFuZ2VzLm5leHQoc3ViKTtcbiAgICAgICAgICByZXR1cm4gc3ViO1xuICAgICAgICB9KTtcbiAgfVxuXG4gIHVuc3Vic2NyaWJlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghdGhpcy5zdy5pc0VuYWJsZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoRVJSX1NXX05PVF9TVVBQT1JURUQpKTtcbiAgICB9XG5cbiAgICBjb25zdCBkb1Vuc3Vic2NyaWJlID0gKHN1YjogUHVzaFN1YnNjcmlwdGlvbiB8IG51bGwpID0+IHtcbiAgICAgIGlmIChzdWIgPT09IG51bGwpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb3Qgc3Vic2NyaWJlZCB0byBwdXNoIG5vdGlmaWNhdGlvbnMuJyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdWIudW5zdWJzY3JpYmUoKS50aGVuKHN1Y2Nlc3MgPT4ge1xuICAgICAgICBpZiAoIXN1Y2Nlc3MpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vuc3Vic2NyaWJlIGZhaWxlZCEnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uQ2hhbmdlcy5uZXh0KG51bGwpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIHJldHVybiB0aGlzLnN1YnNjcmlwdGlvbi5waXBlKHRha2UoMSksIHN3aXRjaE1hcChkb1Vuc3Vic2NyaWJlKSkudG9Qcm9taXNlKCk7XG4gIH1cblxuICBwcml2YXRlIGRlY29kZUJhc2U2NChpbnB1dDogc3RyaW5nKTogc3RyaW5nIHsgcmV0dXJuIGF0b2IoaW5wdXQpOyB9XG59XG4iXX0=