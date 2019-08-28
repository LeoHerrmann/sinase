var settings_manager = {
    show: function() {
        var settings_container = document.getElementById("settings_container");

        for (setting in settings_manager.settings) {
            let new_input_set = document.createElement("div");
            let new_setting_label = document.createElement("label");
            let new_setting_input = document.createElement("input");


            new_input_set.classList.add("input_set")
            new_setting_label.setAttribute("for", setting + "_input");
            new_setting_label.innerText = setting + ": "
            new_setting_input.setAttribute("name", setting + "_input");

            for (attribute in settings_manager.settings[setting]) {
                new_setting_input.setAttribute(attribute, settings_manager.settings[setting][attribute]);
            }

            new_input_set.append(new_setting_label);
            new_input_set.append(new_setting_input);
            settings_container.append(new_input_set);
        }

        var save_button = document.createElement("button");
        save_button.innerText = "Speichern";
        save_button.classList.add("primary");
        save_button.addEventListener("click", settings_manager.save);
        settings_container.append(save_button)
    },


    save: function() {
        for (setting in settings_manager.settings) {
            var input = document.querySelector("#settings_container input[name='" + setting + "_input']").value;
            settings_manager.settings[setting].value = input;
        }
    },


    get_value: function(setting) {
        return settings_manager.settings[setting].value;
    },


    settings: {
        day_length: {
            value: 100,
            type: "number",
            min: 0
        },


        food_growth_cycle: {
            value: 10,
            type: "number",
            min: 0
        },

        food_growth_amount: {
            value: 20,
            type: "number",
            min: 0
        },


        creature_start_energy: {
            value: 400,
            type: "number",
            min: 0
        },

        creature_energy_consumption: {
            value: 5,
            type: "number",
            min: 0
        }/*,

        creature_reproduction_energy: {
            value: 800,
            type: "number",
            min: 0
        }*/
    }
};
