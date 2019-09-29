var parameters_manager = {
    show: function() {
        var parameters_container = document.getElementById("parameters_container");

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

        var save_button = "<button class='primary' onclick='parameters_manager.save(); ui.popup.hide();'>Speichern</button>";
        
        parameters_container.innerHTML += save_button;
    },


    save: function() {
        for (setting in parameters_manager.parameters) {
            var input = document.querySelector("#parameters_container input[name='" + setting + "_input']").value;
            parameters_manager.parameters[setting].value = input;
        }
    },


    get_value: function(setting) {
        return parameters_manager.parameters[setting].value;
    },


    parameters: {
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
        },
        
        creature_speed_max: {
            value: 2,
            type: "number",
            min: 0.25,
            max: 4,
            step: 0.25
        },
        
        creature_speed_min: {
            value: 0.5,
            type: "number",
            min: 0.25,
            max: 4,
            step: 0.1
        },
        
        creature_speed_variation: {
            value: 0.5,
            type: "number",
            min: 0,
            max: 2,
            step: 0.1
        }
        
        /*,

        creature_reproduction_energy: {
            value: 800,
            type: "number",
            min: 0
        }*/
    }
};
