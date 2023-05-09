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
            app.enumerate(c.phones);
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
        c.phone_insert = false;
        axios.post(create_phone_url, {
            contact_id: c.id,
            phone_name: c.new_phone_name,
            phone_number: c.new_phone_number,
        }).then(function (r) {
            // Prepend the phone to the user's phones.
            let p = {
                id: r.data.phone_id,
                phone_number: r.data.phone_number,
                phone_type: r.data.phone_type,
                contact_id: c.id
            };
            c.phones.unshift(p);
            app.enumerate(c.phones);
            c.new_phone_name = "";
            c.new_phone_number = "";
        })
    }

    app.delete_phone = function (c_idx, p_idx) {
        let c = app.vue.contacts[c_idx];
        let p = c.phones[p_idx];
        axios.post(delete_phone_url, {
            contact_id: c.id,
            phone_id: p.id,
        }).then(function (r) {
            c.phones.splice(p_idx, 1);
            app.enumerate(c.phones);
        });
    };

    // This contains all the methods.
    app.methods = {
        // Complete as you see fit.
        start_insert: app.start_insert,
        create_contact: app.create_contact,
        cancel_creation: app.cancel_creation,
        insert_phone: app.insert_phone,
        create_phone: app.create_phone,
        delete_phone: app.delete_phone,
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
