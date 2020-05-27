var settings_manager = {
    fill_settings_container: function() {
        var settings_container = document.getElementById("settings_inputs_container");

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
            settings_container.prepend(new_input_set);
        }
    },


    save: function() {
        var errors_list = validate();

        if (errors_list.length == 0) {
            for (setting in settings_manager.settings) {
                var input = document.querySelector("#settings_container input[name='" + setting + "_input']").value;
                settings_manager.settings[setting].value = input;
            }

            ui.popup.hide();
        }


        function validate() {
            var errors_list = [];

            var input = {};

            for (let setting in settings_manager.settings) {            
                var input_value = parseFloat(document.querySelector("#settings_container input[name='" + setting + "_input']").value);
                input[setting] = input_value;

                var minimum_allowed_value = settings_manager.settings[setting].min;
                var maximum_allowed_value = settings_manager.settings[setting].max; 

                if (input_value < minimum_allowed_value) {
                    errors_list.push(setting + " must be higher or equal to " + minimum_allowed_value + ".");
                }
                else if (input_value > maximum_allowed_value) {
                    errors_list.push(setting + " must be lower or equal to " + maximum_allowed_value + ".");
                }
            }


            var error_container = document.querySelector("#settings_container .error_container");

            if (errors_list.length == 0) {
                error_container.style.display = "none";
            }

            else {
                error_container.style.display = "block";
                error_container.innerHTML = "<span>Some errors need to be corrected before the settings can be saved:</span>";

                for (error of errors_list) {
                    var error_span = "<span>" + error + "</span>";

                    error_container.innerHTML += error_span;
                }
            }

            return errors_list;
        }
    },


    get_value: function(setting) {
        return parseFloat(settings_manager.settings[setting].value);
    },


    settings: {
        visualization_interval: {
            value: 1,
            type: "number",
            min: 1,
            step: 1
        },

        statistics_log_interval: {
            value: 500,
            type: "number",
            min: 100,
            step: 1
        }
    }
};
