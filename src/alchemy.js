const alchemy = (function () {
    var proto = Alchemy.prototype;

    function Alchemy () {}

    // private methods
    /**
     * puts all selected request content into a specified location
     * 
     * @param {string} subject 
     * the module to get out of the load method
     * 
     * @param {string} location 
     * where to place the load method's content
     * 
     * @param {HTMLElement} tmp
     * temporary HTML element containing the request HTML
     * 
     * @param {boolean} [execute]
     * whether or not to append loaded content to the DOM
     * (set to true by default)
     * 
     * @return {void}
     */
        function allFlag (subject, location, tmp, execute) {
        if (!subject.match(/\[(| )all(| )\]/igm)) return subject;

        var noFlag = subject.replace(/\[(| )all(| )\]/igm, ""),
            nodes = tmp.querySelectorAll(noFlag),
            nodeList = [],
            execute = execute === undefined ? true : execute;

        if (!execute) return true;

        for (let i = 0; i < nodes.length; i++) {
            nodeList.push(nodes[i]);
        }

        nodeList.forEach((node) => {
            document.querySelector(location[subject]).append(node);
        });
    }

    /**
     * puts specified amount of selected request content into a 
     * specified location
     * 
     * @param {string} subject 
     * the module to get out of the load method
     * 
     * @param {string} location 
     * where to place the load method's content
     * 
     * @param {HTMLElement} tmp
     * temporary HTML element containing the request HTML
     * 
     * @param {boolean} [execute]
     * whether or not to append loaded content to the DOM
     * (set to true by default)
     * 
     * @return {void}
     */
    function amountFlag (subject, location, tmp, execute) {
        if (!subject.match(/\[(| )\d+(| )\]/igm)) return subject;

        var flag = subject.match(/\[(| )(\d+)(| )\]/igm)[0].replace(/\[|\]/igm, ""),
            noFlag = subject.replace(/\[(| )\d+(| )\]/igm, ""),
            nodes = tmp.querySelectorAll(noFlag),
            nodeList = [],
            execute = execute === undefined ? true : execute;

        if (!execute) return true;

        for (let i = 0; i < Number(flag); i++) {
            nodeList.push(nodes[i]);
        }

        nodeList.forEach((node) => {
            document.querySelector(location[subject]).append(node);
        });
    }

    /**
     * puts a singular request item into a specified location
     * 
     * @param {string} subject 
     * the module to get out of the load method
     * 
     * @param {string} location 
     * where to place the load method's content
     * 
     * @param {HTMLElement} tmp
     * temporary HTML element containing the request HTML
     * 
     * @param {boolean} [execute]
     * whether or not to append loaded content to the DOM
     * (set to true by default)
     * 
     * @return {void}
     */
    function noFlag (subject, location, tmp, execute) {
        if (!subject.match(/\[.*?\]/igm)) {
            var subjectNode = tmp.querySelector(subject),
            execute = execute === undefined ? true : execute;

        if (!execute) return true;

            document.querySelector(location).append(subjectNode);
        }
    }

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
            fn.into = function (selector, callback) {
                if (!(fn.insert instanceof Array)) {
                    document.querySelector(selector).append(fn.insert);
                }
                else if (fn.insert instanceof Array) {
                    fn.insert.forEach((item) => {
                        document.querySelector(selector).append(item);
                    });
                }

                callback ? callback() : null;
            }

            /**
             * excludes certain elements from being part of what was requested
             * 
             * @param  {...string} selectors 
             * the element selectors to exclude from the requested item(s)
             * 
             * @return {self}
             */
            fn.exclude = function (...selectors) {
                selectors.forEach((selector) => {
                    if (noFlag(selector, null, tmp, false)) {
                        tmp.querySelector(selector).remove();
                    } 
                    else if (allFlag(selector, null, tmp, false)) {
                        var validSelector = selector.replace(/\[(| )all(| )\]/igm, ""),
                            removable = tmp.querySelectorAll(validSelector);

                        for (let i = 0; i < removable.length; i++) {
                            removable[i].remove();
                        }
                    }
                });

                return fn;
            }

            /**
             * inserts multiple elements from the requested page into the specified location
             * 
             * @param {object} props 
             * key value pair, key is the inserted item's selector and the value is the 
             * inserted into element's selector:
             * 
             * {
             *  ".requested-elem" : ".location"
             * }
             */
            fn.insertInto = function (props, callback) {
                for (let key in props) {
                    noFlag(key, props, tmp);
                    allFlag(key, props, tmp);
                    amountFlag(key, props, tmp);
                }

                callback ? callback() : null;
            }

            /**
             * alters the loaded HTML's layout
             * 
             * @param {string} selector 
             * the HTML element to alter
             * 
             * @param {string} mutation 
             * references to the HTML elements arranged in a 
             * different order:
             * 
             * [[ img ]]
             * 
             * [[ p ]]
             * 
             * @return {void}
             */
            fn.mutate = function (selector, mutation) {
                var nodes = tmp.querySelectorAll(selector),
                    keys = mutation.match(/\[\[.*?\]\]/igm),
                    validKeys = [];

                keys.forEach((key, i) => {
                    validKeys.push(key.replace(/\[|\]| /gm, ""));
                });

                for (let i = 0; i < nodes.length; i++) {
                    var mutated = "";

                    validKeys.forEach((key, x) => {
                        var elems = nodes[i].querySelectorAll(key);

                        for (let j = 0; j < elems.length; j++) {
                            mutated += elems[j].outerHTML;
                            elems[j].remove();
                        }
                    });

                    nodes[i].innerHTML = mutated;
                }
                
            }
        }

        return fn;
    }

    // public methods

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

    return new Alchemy();
})();