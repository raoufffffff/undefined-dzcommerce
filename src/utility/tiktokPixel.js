// utils/tiktokPixel.js
export const initTikTokPixel = (pixelId) => {
    if (window.ttq) return;

    (function (w, d, t) {
        w.TiktokAnalyticsObject = t;
        const ttq = w[t] = w[t] || [];
        ttq.methods = [
            "page", "track", "identify", "instances", "debug",
            "on", "off", "once", "ready", "alias", "group", "enableCookie"
        ];
        ttq.setAndDefer = function (t, e) {
            t[e] = function () {
                t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
            };
        };
        for (let i = 0; i < ttq.methods.length; i++) {
            ttq.setAndDefer(ttq, ttq.methods[i]);
        }
        ttq.load = function (e, n) {
            const i = "https://analytics.tiktok.com/i18n/pixel/events.js";
            ttq._i = ttq._i || {};
            ttq._i[e] = [];
            ttq._i[e]._u = i;
            ttq._t = ttq._t || {};
            ttq._t[e] = +new Date();
            ttq._o = ttq._o || {};
            ttq._o[e] = n || {};
            const o = document.createElement("script");
            o.type = "text/javascript";
            o.async = true;
            o.src = `${i}?sdkid=${e}&lib=${t}`;
            const a = document.getElementsByTagName("script")[0];
            a.parentNode.insertBefore(o, a);
        };

        ttq.load(pixelId);
        ttq.page();
    })(window, document, 'ttq');
};

export const trackTikTokEvent = (event, data = {}) => {
    if (window.ttq) {
        window.ttq.track(event, data);
    }
};
