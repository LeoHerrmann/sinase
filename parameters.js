var parameters_manager = {
    fill_parameters_container: function() {
        var parameters_container = document.getElementById("parameter_inputs_container");

        for (parameter in parameters_manager.parameters) {
            let new_input_set = document.createElement("div");
            let new_setting_label = document.createElement("label");
            let new_setting_input = document.createElement("input");


            new_input_set.classList.add("input_set")
            new_setting_label.setAttribute("for", parameter + "_input");
            new_setting_label.innerText = parameter + ": "
            new_setting_input.setAttribute("name", parameter + "_input");

            for (attribute in parameters_manager.parameters[parameter]) {
                new_setting_input.setAttribute(attribute, parameters_manager.parameters[parameter][attribute]);
            }

            new_input_set.append(new_setting_label);
            new_input_set.append(new_setting_input);
            parameters_container.append(new_input_set);
        }
    },


    save: function() {
        var errors_list = validate();

        if (errors_list.length == 0) {
            for (setting in parameters_manager.parameters) {
                var input = document.querySelector("#parameters_container input[name='" + setting + "_input']").value;
                parameters_manager.parameters[setting].value = input;
            }

            ui.popup.hide();
        }


        function validate() {
            var errors_list = [];

            var input = {};

            for (let setting in parameters_manager.parameters) {            
                var input_value = parseFloat(document.querySelector("#parameters_container input[name='" + setting + "_input']").value);
                input[setting] = input_value;

                var minimum_allowed_value = parameters_manager.parameters[setting].min;
                var maximum_allowed_value = parameters_manager.parameters[setting].max; 

                if (input_value < minimum_allowed_value) {
                    errors_list.push(setting + " muss mindestens " + minimum_allowed_value + " sein.");
                }
                else if (input_value > maximum_allowed_value) {
                    errors_list.push(setting + " darf höchstens " + maximum_allowed_value + " sein.");
                }
            }


            if (input["creature_speed_min"] > input["creature_speed_max"]) {
                errors_list.push("creature_speed_min darf nicht größer als creature_speed_max sein.");
            }


            var error_container = document.getElementById("error_container");

            if (errors_list.length == 0) {
                error_container.style.display = "none";
            }

            else {
                error_container.style.display = "block";
                error_container.innerHTML = "<span>Es sind noch Fehler zu beheben, bevor die Parameter gespeichert werden können:</span>";

                for (error of errors_list) {
                    var error_span = "<span>" + error + "</span>";

                    error_container.innerHTML += error_span;
                }
            }
        
            return errors_list;
        }
    },


    get_value: function(setting) {
        //return parameters_manager.parameters[setting].value;
        return parseFloat(parameters_manager.parameters[setting].value);
    },


    parameters: {
        simulation_visualization_interval: {
            value: 100,
            type: "number",
            min: 1,
            step: 1
        },

        food_growth_cycle: {
            value: 10,
            type: "number",
            min: 0,
            step: 1
        },

        food_growth_amount: {
            value: 15,
            type: "number",
            min: 0,
            step: 1
        },

        creature_start_energy: {
            value: 400,
            type: "number",
            min: 0,
            step: 1
        },

        creature_energy_consumption: {
            value: 0,
            type: "number",
            min: 0,
            step: 1
        },

        creature_speed_max: {
            value: 2,
            type: "number",
            min: 0.25,
            max: 4,
            step: "any"
        },

        creature_speed_min: {
            value: 0.5,
            type: "number",
            min: 0.25,
            max: 4,
            step: "any"
        },

        creature_speed_variation: {
            value: 0.5,
            type: "number",
            min: 0,
            max: 2,
            step: "any"
        },


        creature_size_max: {
            value: 4,
            type: "number",
            min: 0.5,
            max: 4,
            step: "any"
        },

        creature_size_min: {
            value: 0.5,
            type: "number",
            min: 0.5,
            max: 4,
            step: "any"
        },

        creature_size_variation: {
            value: 0.5,
            type: "number",
            min: 0,
            max: 2,
            step: "any"
        }
    }
};
