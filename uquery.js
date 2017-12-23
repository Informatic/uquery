window.uQuery = (function() {
    function $(selector) {
        if(selector instanceof Function)
            return $(document).on('DOMContentLoaded', selector);

        if(this == window)
            return new $(selector);

        if(selector instanceof Node)
            this.push(selector)
        else if(selector instanceof Array)
            this.push.apply(this, selector);
        else
            this.push.apply(this, document.querySelectorAll(selector));
    }

    $.prototype = new Array;

    Object.assign($.prototype, {
        each: function(func) { this.forEach(func); return this; },

        css: function(obj) {
            if(typeof obj == 'string')
                return this[0]?this[0].style[obj]:undefined;
            return this.each(function(c) { Object.assign(c.style, obj); });
        },
        attr: function(obj) {
            if(typeof obj == 'string')
                return this[0]?this[0].getAttribute(obj):undefined;

            return this.each(function(c) { for(var n in obj) {
                if (obj[n] === null)
                    c.removeAttribute(n);
                else
                    c.setAttribute(n, obj[n]);
            }});
        },
        on: function(evt, cb) {
            return this.each(function(c) {
                evt.split(' ').forEach(function(e) {
                    c.addEventListener(e, cb, false);
                });
            });
        },
        show: function() { return this.css({'display': 'block'}); }, // FIXME
        hide: function() { return this.css({'display': 'none'}); },

        set: function(attr, value) {
            if (value === undefined) {
                return this[0]?this[0][attr]:undefined;
            }
            return this.each(function(c) { c[attr] = value; });
        },
        text: function(d) { return this.set('textContent', d); },
        html: function(d) { return this.set('innerHTML', d); },
        val: function(d) { return this.set('value', d); },

        hasClass: function(c) { return this[0]?this[0].classList.contains(c):undefined },
        appendClass: function(c) {
            return this.each(function(e) { e.classList.add(c); });
        },
        removeClass: function(c) {
            return this.each(function(e) { e.classList.remove(c); });
        },
        toggleClass: function(c) {
            return this.each(function(e) {
                e.classList.contains(c) ? e.classList.remove(c) : c.classList.add(c);
            });
        },
    });

    Object.assign($, {
        ajax: function(opts) {
            var req = new XMLHttpRequest();
            req.open(opts.method||'GET', opts.url, true);
            for (var k in opts.headers||{}) {
                req.setRequestHeader(k, opts.headers[k]);
            }
            req.onreadystatechange = function(evt) {
                if(req.readyState == 4) {
                    if(opts.json)
                        req.responseJSON = JSON.parse(req.response);

                    (opts.response||function(){})(req);
                    if(req.status == 200)
                        (opts.success||function(){})(req);
                    else
                        (opts.error||function(){})(req);
                }
            }
            req.send(opts.data||null);
            return this;
        },
        formEncode: function(data) {
            var urlEncodedData = "";
            var urlEncodedDataPairs = [];
            var name;

            for(name in data) {
                urlEncodedDataPairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
            }

            return urlEncodedDataPairs.join('&').replace(/%20/g, '+');
        }
    });

    return $;
})();

if(window.$ == undefined)
    window.$ = uQuery;
