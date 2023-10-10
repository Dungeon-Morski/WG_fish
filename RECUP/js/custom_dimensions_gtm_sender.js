/**
 * CustomDimensionsGTMSender script.
 *
 * Init example:

<script>
  (function(w,d,s,p) {
      var f=d.getElementsByTagName(s)[0],j=d.createElement(s),i;
      j.async=true;j.src=p["script"];
      for(i in p) {if (p.hasOwnProperty(i)) {j.setAttribute("data-"+i,p[i]);}}
      f.parentNode.insertBefore(j,f);
  })(window,document,"script",{"script":"https://test.te:8098/custom_dimensions_gtm_sender.js"});
</script>

 Parameters:
 * script - URL to load mapping script from, e.g.: https://tenor.wargaming.net/assets/campaigns/static/custom_dimensions_gtm_sender.js
 * For debug logging add URL param "custom-dimensions-gtm-sender-debug" to the page.
 */

// A url-search-params polyfill. https://cdn.jsdelivr.net/npm/url-search-params-polyfill@8.1.0/index.min.js
!function(t){"use strict";var n,r=function(){try{if(t.URLSearchParams&&"bar"===new t.URLSearchParams("foo=bar").get("foo"))return t.URLSearchParams}catch(t){}return null}(),e=r&&"a=1"===new r({a:1}).toString(),o=r&&"+"===new r("s=%2B").get("s"),i="__URLSearchParams__",a=!r||((n=new r).append("s"," &"),"s=+%26"===n.toString()),c=h.prototype,s=!(!t.Symbol||!t.Symbol.iterator);if(!(r&&e&&o&&a)){c.append=function(t,n){v(this[i],t,n)},c.delete=function(t){delete this[i][t]},c.get=function(t){var n=this[i];return this.has(t)?n[t][0]:null},c.getAll=function(t){var n=this[i];return this.has(t)?n[t].slice(0):[]},c.has=function(t){return d(this[i],t)},c.set=function(t,n){this[i][t]=[""+n]},c.toString=function(){var t,n,r,e,o=this[i],a=[];for(n in o)for(r=l(n),t=0,e=o[n];t<e.length;t++)a.push(r+"="+l(e[t]));return a.join("&")};var u=!!o&&r&&!e&&t.Proxy;Object.defineProperty(t,"URLSearchParams",{value:u?new Proxy(r,{construct:function(t,n){return new t(new h(n[0]).toString())}}):h});var f=t.URLSearchParams.prototype;f.polyfill=!0,f.forEach=f.forEach||function(t,n){var r=y(this.toString());Object.getOwnPropertyNames(r).forEach(function(e){r[e].forEach(function(r){t.call(n,r,e,this)},this)},this)},f.sort=f.sort||function(){var t,n,r,e=y(this.toString()),o=[];for(t in e)o.push(t);for(o.sort(),n=0;n<o.length;n++)this.delete(o[n]);for(n=0;n<o.length;n++){var i=o[n],a=e[i];for(r=0;r<a.length;r++)this.append(i,a[r])}},f.keys=f.keys||function(){var t=[];return this.forEach(function(n,r){t.push(r)}),g(t)},f.values=f.values||function(){var t=[];return this.forEach(function(n){t.push(n)}),g(t)},f.entries=f.entries||function(){var t=[];return this.forEach(function(n,r){t.push([r,n])}),g(t)},s&&(f[t.Symbol.iterator]=f[t.Symbol.iterator]||f.entries)}function h(t){((t=t||"")instanceof URLSearchParams||t instanceof h)&&(t=t.toString()),this[i]=y(t)}function l(t){var n={"!":"%21","'":"%27","(":"%28",")":"%29","~":"%7E","%20":"+","%00":"\0"};return encodeURIComponent(t).replace(/[!'\(\)~]|%20|%00/g,function(t){return n[t]})}function p(t){return t.replace(/[ +]/g,"%20").replace(/(%[a-f0-9]{2})+/gi,function(t){return decodeURIComponent(t)})}function g(n){var r={next:function(){var t=n.shift();return{done:void 0===t,value:t}}};return s&&(r[t.Symbol.iterator]=function(){return r}),r}function y(t){var n={};if("object"==typeof t)if(S(t))for(var r=0;r<t.length;r++){var e=t[r];if(!S(e)||2!==e.length)throw new TypeError("Failed to construct 'URLSearchParams': Sequence initializer must only contain pair elements");v(n,e[0],e[1])}else for(var o in t)t.hasOwnProperty(o)&&v(n,o,t[o]);else{0===t.indexOf("?")&&(t=t.slice(1));for(var i=t.split("&"),a=0;a<i.length;a++){var c=i[a],s=c.indexOf("=");-1<s?v(n,p(c.slice(0,s)),p(c.slice(s+1))):c&&v(n,p(c),"")}}return n}function v(t,n,r){var e="string"==typeof r?r:null!=r&&"function"==typeof r.toString?r.toString():JSON.stringify(r);d(t,n)?t[n].push(e):t[n]=[e]}function S(t){return!!t&&"[object Array]"===Object.prototype.toString.call(t)}function d(t,n){return Object.prototype.hasOwnProperty.call(t,n)}}("undefined"!=typeof global?global:"undefined"!=typeof window?window:this);

(function () {
    "use strict";

    function debugLog(msg) {
        if (console && location.href.indexOf("custom-dimensions-gtm-sender-debug") > -1) {
            console.log(msg);
        }
    }

    function fromInt36(value) {
        var digits36 = '0123456789abcdefghijklmnopqrstuvwxyz',
            base = BigInt(digits36.length),
            result = 0n;
        for ( let i = 0; i < value.length; i++ ) {
            result = result * base + BigInt(digits36.indexOf(value.charAt(i)));
        }
        return result
    }

    function getDataLayer() {
        if (typeof window.dataLayer === "undefined") {
            return debugLog("[CustomDimensionsGTMSender] Cannot find dataLayer");
        } else {
            return window.dataLayer;
        }
    }

    function getCommonMenu() {
        if (typeof window.WG === "undefined") {
            return debugLog("[CustomDimensionsGTMSender] Cannot find WG");
        }

        if (typeof window.WG.CommonMenu === "undefined") {
            return debugLog("[CustomDimensionsGTMSender] Cannot find WG.CommonMenu");
        }

        return window.WG.CommonMenu;
    }

    function makeCustomDimensionsData(options) {
        var query = new URLSearchParams(location.search);

        var utm_campaign = query.get("utm_campaign");
        var enctid = query.get("enctid");
        var foris = query.get("foris");

        return {
            "S_Prod_Name": options["project"],
            "S_Prod_Type": options["service"],
            "S_Prod_Realm": options["realm"],
            "S_Prod_Lang": options["language"],
            "S_TE_campaign_apc": utm_campaign,
            "S_TE_campaign_clickID": enctid ? fromInt36(enctid).toString() : null,
            "S_TE_registration_type": foris,
        };
    }

    function makeUserData(options) {
        return {
            "S_UserID": options["user_id"],
            "H_Login_Status": !!options["user_id"] | 0,
            'event': 'business_general_info',
        };
    }

    function sender() {
        var dataLayer = getDataLayer();
        var CommonMenu = getCommonMenu();
        if (CommonMenu === undefined || dataLayer === undefined) return;
        var options = CommonMenu.getOptions();

        debugLog("[CustomDimensionsGTMSender] Make custom data");
        var custom_data = makeCustomDimensionsData(options);
        debugLog("[CustomDimensionsGTMSender] Pushing custom data");
        debugLog(custom_data);
        dataLayer.push(custom_data);
        debugLog("[CustomDimensionsGTMSender] Pushed");

        debugLog("[CustomDimensionsGTMSender] Wait user data");
        var i = 0;
        var pid = setInterval(function () {
            var options = CommonMenu.getOptions();
            if (options["user_id"] !== undefined || i > 30) {
                debugLog("[CustomDimensionsGTMSender] Make user data");
                var user_data = makeUserData(options);
                dataLayer.push(user_data);
                debugLog("[CustomDimensionsGTMSender] Pushing user data");
                debugLog(user_data);
                debugLog("[CustomDimensionsGTMSender] Pushed");
                clearInterval(pid);
            }
            i++;
        }, 100);
    }

    function main() {
        debugLog("[CustomDimensionsGTMSender] Loading...");
        var i = 0;
        var pid = setInterval(function () {
            if (typeof window.WG !== "undefined") {
                sender();
                clearInterval(pid);
            }
            if (i > 50) clearInterval(pid);
            i++;
        }, 100);
    }

    main();

}());
