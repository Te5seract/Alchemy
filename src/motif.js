const motif = (function () {
    var proto = Motif.prototype;

    function Motif () {
    }

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

            fn.insertAll = function (selector) {
                var items = [],
                    nodes = tmp.querySelectorAll(selector);

                for (let i = 0; i < nodes.length; i++) {
                    items.push(nodes[i]);
                }

                fn.insert = items;

                return fn;
            }
    
            fn.into = function (selector) {
                if (!(fn.insert instanceof Array)) {
                    document.querySelector(selector).append(fn.insert);
                }
                else if (fn.insert instanceof Array) {
                    fn.insert.forEach((item) => {
                        console.log(item);
                        document.querySelector(selector).append(item);
                    });
                }
            }
        }

        return fn;
    }

    proto.load = function (url, callback) {
        var xr = new XMLHttpRequest();

        xr.open("GET", url, true);

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

    return new Motif();
})();