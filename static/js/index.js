// This will be the object that will contain the Vue attributes
// and be used to initialize it.
let app = {};


// Given an empty app object, initializes it filling its attributes,
// creates a Vue instance, and then initializes the Vue instance.
let init = (app) => {

    // This is the Vue data.
    app.data = {
        // Complete as you see fit.
        userinput: "",
    };

    app.enumerate = (a) => {
        // This adds an _idx field to each element of the array.
        let k = 0;
        a.map((e) => {e._idx = k++;});
        return a;
    };

    app.letsgo = function () {
        let v = app.vue.userinput;
        axios.post(my_callback_url, {userinput: v}).then(
            function(response) {
                console.log(response.data.result);
                console.log(v);
            }
        )
        v += " hello";

    };

    app.letsgo_safe = function () {
        let v = app.vue.userinput;
        (function (vv) {
            axios.post(my_callback_url, {userinput: vv}).then(
                function (response) {
                    console.log(response.data.result);
                    console.log(vv);
                }
            )
        })(v);
        v += " hello";
    };

    // This contains all the methods.
    app.methods = {
        // Complete as you see fit.
        letsgo: app.letsgo,
        letsgo_safe: app.letsgo_safe,
    };

    // This creates the Vue instance.
    app.vue = new Vue({
        el: "#vue-target",
        data: app.data,
        methods: app.methods
    });

    // And this initializes it.
    app.init = () => {
        // Put here any initialization code.
        // Typically this is a server GET call to load the data.
    };

    // Call to the initializer.
    app.init();
};

// This takes the (empty) app object, and initializes it,
// putting all the code i
init(app);
