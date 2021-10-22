const motif = (function () {
    var proto = Motif.prototype;

    function Motif (selector) {
        // this.put = "";
        this.selector = selector;
        this.elem = document.querySelector(selector);
    }

    // proto.put = function (selector) {
    //     this.put = selector;
    // }

    // proto.from = function (url, callback) {
    //     var put = this.put;
    // }

    function loadMethods (response, json) {
        var fn = {};

        if (response) {
            var tmp = document.createElement("div");

            fn.json = json;
            fn.response = response;

            tmp.innerHTML = response;

            fn.insert = function (selector) {
                fn.insert = tmp.querySelector(selector);

                return fn;
            }
    
            fn.into = function (selector) {
                document.querySelector(selector).append(fn.insert);
            }
        }

        return fn;
    }

    proto.load = function (url, callback) {
        var xr = new XMLHttpRequest();

        xr.open("GET", url);

        xr.onreadystatechange = () => {
            if (xr.readyState === 4 && xr.status === 200) {
                var response = xr.responseText,
                    json = "";

                try {
                    json = JSON.parse(response);
                } catch (er) {}

                callback ? callback(loadMethods(response, json)) : null;
            }
        }

        xr.send();
    }

    return (selector) => {
        new Motif(selector);
    };
})();

// motif.load("{BlogURL}module-navigation", function (module) {
//     module.insert("ul").into(".nav");
// });

// motif(".nav").put("ul").from("{BlogURL}module-navigation");