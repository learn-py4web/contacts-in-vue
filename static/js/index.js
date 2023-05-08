// This will be the object that will contain the Vue attributes
// and be used to initialize it.
let app = {};

// Given an empty app object, initializes it filling its attributes,
// creates a Vue instance, and then initializes the Vue instance.
let init = (app) => {

    // This is the Vue data.
    app.data = {
        // Complete as you see fit.
        contacts: [],
        mode_insert: false,
        new_contact_name: "",
    };

    app.enumerate = (a) => {
        // This adds an _idx field to each element of the array.
        let k = 0;
        a.map((e) => {e._idx = k++;});
        return a;
    };

    app.contact_init = (a) => {
        // This adds an _idx field to each element of the array.
        let k = 0;
        a.map((e) => {e._idx = k++;});
        for (let c of a) {
            c.phone_insert = false;
            c.new_phone_name = "";
            c.new_phone_number = "";
        }
        return a;
    };

    app.start_insert = function () {
        app.vue.new_contact_name = "";
        app.vue.mode_insert = true;
    };

    app.create_contact = function () {
        app.vue.mode_insert = false;
        let contact_name = app.vue.new_contact_name;
        app.vue.new_contact_name = "";
        axios.post(create_contact_url, {contact_name: contact_name})
            .then(function (r) {
                app.vue.contacts.unshift(r.data.contact);
                app.contact_init(app.vue.contacts);
            });
    };

    app.cancel_creation = function () {
        app.vue.new_contact_name = "";
        app.vue.mode_insert = false;
    };

    app.insert_phone = function (c_idx) {
        let c = app.vue.contacts[c_idx];
        c.phone_insert = true;
    };

    app.create_phone = function (c_idx) {
        let c = app.vue.contacts[c_idx];
        axios.post(create_phone_url, {
            contact_id: c.id,
            phone_name: c.new_phone_name,
            phone_number: c.new_phone_number,
        }).then(function (r) {
            // TODO.
        })
    }

    // This contains all the methods.
    app.methods = {
        // Complete as you see fit.
        start_insert: app.start_insert,
        create_contact: app.create_contact,
        cancel_creation: app.cancel_creation,
        insert_phone: app.insert_phone,
        create_phone: app.create_phone,
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
        axios.get(get_contacts_url).then(function (r) {
            app.vue.contacts = app.contact_init(r.data.contacts);
        });
    };

    // Call to the initializer.
    app.init();
};

// This takes the (empty) app object, and initializes it,
// putting all the code i
init(app);
