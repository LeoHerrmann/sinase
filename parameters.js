var parameters_manager = {
    fill_parameters_container: function() {
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
        
        var error_container = "<div id='error_container'></div>";

        var save_button = "<button class='primary' onclick='parameters_manager.save();'>Validieren und Speichern</button>";
        
        parameters_container.innerHTML += error_container + save_button;
    },
    
    
    validate: function() {
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
        error_container.innerHTML = "";
        
        for (error of errors_list) {
            var error_span = 
                "<span>" + 
                    error +
                "</span>";
                
            error_container.innerHTML += error_span;
        }
        
        return errors_list;
    },


    save: function() {
        var errors_list = parameters_manager.validate();
    
        if (errors_list.length == 0) {
            for (setting in parameters_manager.parameters) {
                var input = document.querySelector("#parameters_container input[name='" + setting + "_input']").value;
                parameters_manager.parameters[setting].value = input;
            }
            
            ui.popup.hide();
        }
    },


    get_value: function(setting) {
        return parameters_manager.parameters[setting].value;
    },


    parameters: {
        food_growth_cycle: {
            value: 10,
            type: "number",
            min: 0,
            step: 1
        },

        food_growth_amount: {
            value: 20,
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
            value: 5,
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
        }
        
        /*,

        creature_reproduction_energy: {
            value: 800,
            type: "number",
            min: 0
        }*/
    }
};
