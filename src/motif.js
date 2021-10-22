const motif = (function () {
    var proto = Motif.prototype;

    function Motif () {}

    /**
     * methods for load method callback
     * 
     * @param {string} response 
     * the ajax request response
     * 
     * @return {object}
     */
    function loadMethods (response) {
        var fn = {};

        if (response) {
            var tmp = document.createElement("div");

            fn.response = response;

            tmp.innerHTML = response;

            /**
             * inserts an element from the load method into a selected
             * element on the document
             * 
             * @param {string} selector 
             * the element to insert into the document from the
             * load method
             * 
             * @return {self}
             */
            fn.insert = function (selector) {
                fn.insert = tmp.querySelector(selector);

                return fn;
            }

            /**
             * inserts all elements from the load method into a selected
             * element on the document
             * 
             * @param {string} selector 
             * the elements to insert into the document from the 
             * load method
             * 
             * @return {self}
             */
            fn.insertAll = function (selector) {
                var items = [],
                    nodes = tmp.querySelectorAll(selector);

                for (let i = 0; i < nodes.length; i++) {
                    items.push(nodes[i]);
                }

                fn.insert = items;

                return fn;
            }
    
            /**
             * the document element to insert loaded elements into
             * 
             * @param {string} selector 
             * the element's selector
             * 
             * @return {void}
             */
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

    /**
     * loads DOM content from a url
     * 
     * @param {string} url 
     * the url to load DOM content from
     * 
     * @param {callback} callback 
     * if the load is successful this callback will execute
     * the callback takes one parameter in which methods can be 
     * called such as: insert().into() or insertAll().into()
     * 
     * @return {void}
     */
    proto.load = function (url, callback) {
        var xr = new XMLHttpRequest();

        xr.open("GET", url, true);

        xr.onreadystatechange = () => {
            if (xr.readyState === 4 && xr.status === 200) {
                var response = xr.responseText;

                callback ? callback(loadMethods(response)) : null;
            }
        }

        xr.send();
    }

    return new Motif();
})();