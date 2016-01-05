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
        css: function(obj) {
            return this.each(function(c) { Object.assign(c.style, obj); });
        },
        on: function(evt, cb) {
            return this.each(function(c) {
                evt.split(' ').forEach(function(e) {
                    c.addEventListener(e, cb, false);
                });
            });
        },
        show: function() { return this.css({'visibility': 'initial'}); },
        hide: function() { return this.css({'visibility': 'hidden'}); },
        each: function(func) { this.forEach(func); return this; },

        set: function(attr, value) {
            return this.each(function(c) { c[attr] = value; });
        },
        text: function(d) { return this.set('textContent', d); },
        html: function(d) { return this.set('innerHTML', d); },
    });

    Object.assign($, {
        ajax: function(opts) {
            var req = new XMLHttpRequest();
            req.open(opts.method||'GET', opts.url, true);
            req.onreadystatechange = function(evt) {
                if(evt.readyState == 4 && req.status == 200)
                    (opts.success||function(){})(evt);
                else
                    (opts.error||function(){})(evt);
            }
            req.send(opts.data||null);
            return this;
        },
    });

    return $;
})();

if(window.$ == undefined)
    window.$ = uQuery;
