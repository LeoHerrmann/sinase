var time = 0;
var simulate_until = 0;





window.onload = function() {
    parameters_manager.fill_parameters_container();
};





var simulation = {
    start: function() {
        simulate_until = document.querySelector("input[name='simulate_until_input']").value;
        time = 0;

        simulation.time_unit_timeout = setTimeout(simulation.time_unit, 0);

        var simulation_toggle_button = document.getElementById("simulation_toggle_button");
        simulation_toggle_button.onclick = simulation.stop;
        simulation_toggle_button.innerText = "Stop";
    },


    stop: function() {
        clearTimeout(simulation.time_unit_timeout);

        var simulation_toggle_button = document.getElementById("simulation_toggle_button");
        simulation_toggle_button.onclick = simulation.continue;
        simulation_toggle_button.innerText = "Continue";
    },


    continue: function() {
        simulate_until = document.querySelector("input[name='simulate_until_input']").value;

        simulation.time_unit_timeout = setTimeout(simulation.time_unit, 0);

        var simulation_toggle_button = document.getElementById("simulation_toggle_button");
        simulation_toggle_button.onclick = simulation.stop;
        simulation_toggle_button.innerText = "Stop";
    },


    reset: function() {
        clearTimeout(simulation.time_unit_timeout);

        time = 0;
        simulate_until = 0;

        world.clear();
        statistics.clear();

        var simulation_toggle_button = document.getElementById("simulation_toggle_button");
        simulation_toggle_button.onclick = simulation.start;
        simulation_toggle_button.innerText = "Start";
    },


    time_unit_timeout: 0,


    time_unit: function() {
        if (time % 100 === 0) {
            statistics.save("population", "population", creatures_manager.list.length);
            statistics.save("food", "food", food_manager.list.length);
            statistics.save("creature_speed", "average", creatures_manager.get_average_speed());
            statistics.save("creature_speed", "minimum", creatures_manager.get_minimum_speed());
            statistics.save("creature_speed", "maximum", creatures_manager.get_maximum_speed());
            statistics.save("creature_size", "average", creatures_manager.get_average_size());
            statistics.save("creature_size", "minimum", creatures_manager.get_minimum_size());
            statistics.save("creature_size", "maximum", creatures_manager.get_maximum_size());
        }

        if (time < simulate_until) {
            for (creature of creatures_manager.list) {
                creature.move();
                creature.eat();
                creature.check_energy();
            }

            if (time % parameters_manager.get_value("food_growth_cycle") == 0) {
                world.populate(0, parameters_manager.get_value("food_growth_amount"));
            }


            if (time % parameters_manager.get_value("simulation_visualization_interval") == 0) {
                visualize();
            }

            time += 1;
            document.getElementById("current_time_label").innerText = time;

            simulation.time_unit_timeout = setTimeout(simulation.time_unit, 0);
        }
        else {
            visualize();
            var simulation_toggle_button = document.getElementById("simulation_toggle_button");
            simulation_toggle_button.onclick = simulation.continue;
            simulation_toggle_button.innerText = "Continue";
        }
    }
};





var world = {
    populate: function(creature_count, food_count) {
        if (typeof creature_count === "undefined" && typeof food_count === "undefined") {
            creature_count = document.getElementById("new_creature_count_input").value;
            food_count = document.getElementById("new_food_count_input").value;
        }

        for (let i = 0; i < creature_count; i++) {
            creatures_manager.create_new();
        }

        for (let i = 0; i < food_count; i++) {
            food_manager.create_new();
        }

        //visualize();
    },


    clear: function() {
        creatures_manager.list = [];
        food_manager.list = [];

        document.getElementById("environment").innerHTML = "";
    }
};




class Creature {
    constructor(id, position, direction, energy, speed, size) {
        this.id = id;
        this.position = position;
        this.direction = direction;
        this.energy = energy;
        this.speed = speed;
        this.size = size;
    }


    move() {
        this.position.x += new_relative_position_x(this.direction, this.speed);
        this.position.y += new_relative_position_y(this.direction, this.speed);
        this.direction += randint(-40, 40);

        for (let type in this.position) {
            if (this.position[type] < 0) {
                this.position[type] = 0;
            }
            if (this.position[type] > 100 - this.size) {
                this.position[type] = 100 - this.size; 
            }
        }

        //this.energy -= 1.3 * this.speed + 8 * this.size + parameters_manager.get_value("creature_energy_consumption");
        this.energy -= 0.2 * this.speed ** 2 + 0.2 * this.size ** 3;


        function new_relative_position_x(direction, speed) {
            return speed * Math.sin((Math.PI / 180) * direction);
        }

        function new_relative_position_y(direction, speed) {
            return speed * Math.cos((Math.PI / 180) * direction);
        }
        
        return this.position
    }


    eat() {
        for (let food of food_manager.list) {
            if (this.position.x < food.position.x + 1 && this.position.x + this.size > food.position.x &&
                this.position.y < food.position.y + 1 && this.position.y + this.size > food.position.y
            ) {
                this.energy += 100;

                document.querySelector(".food[data-id='" + food.id + "']").remove();
                for (let i = 0; i < food_manager.list.length; i++) {
                    if (food_manager.list[i].id == food.id) {
                        food_manager.list.splice(i, 1);
                        break;
                    }
                }
            }
        }
    }
    
    
    check_energy() {
    if (this.energy >= 2 * parameters_manager.get_value("creature_start_energy")) {
            this.multiply();
        }
        else if (this.energy <= 0) {
            this.die();
        }
    }


    multiply() {
        var child_properties = {
            position: this.position,
            direction: this.direction,
            speed: this.speed,
            size: this.size
        };


        var child_min_speed = this.speed - parseFloat(parameters_manager.get_value("creature_speed_variation"));
        var child_max_speed = this.speed + parseFloat(parameters_manager.get_value("creature_speed_variation"));

        if (child_min_speed < parseFloat(parameters_manager.get_value("creature_speed_min"))) {
            child_min_speed = parseFloat(parameters_manager.get_value("creature_speed_min"));
        }
        if (child_max_speed > parseFloat(parameters_manager.get_value("creature_speed_max"))) {
            child_max_speed = parseFloat(parameters_manager.get_value("creature_speed_max"));
        }

        child_properties.speed = randint(child_min_speed * 100, child_max_speed * 100) / 100;
        
        
        var child_min_size = this.size - parseFloat(parameters_manager.get_value("creature_size_variation"));
        var child_max_size = this.size + parseFloat(parameters_manager.get_value("creature_size_variation"));

        if (child_min_size < parseFloat(parameters_manager.get_value("creature_size_min"))) {
            child_min_size = parseFloat(parameters_manager.get_value("creature_size_min"));
        }
        if (child_max_size > parseFloat(parameters_manager.get_value("creature_size_max"))) {
            child_max_size = parseFloat(parameters_manager.get_value("creature_size_max"));
        }

        child_properties.size = randint(child_min_size * 100, child_max_size * 100) / 100;
        
        
        creatures_manager.create_new(JSON.parse(JSON.stringify(child_properties)));

        this.energy -= parameters_manager.get_value("creature_start_energy");
    }


    die() {
        for (let i = 0; i < creatures_manager.list.length; i++) {
            if (creatures_manager.list[i].id == this.id) {
                creatures_manager.list.splice(i, 1);
                document.querySelector(".creature[data-id='" + this.id + "']").remove();
                break;
            }
        }
    }
}




var creatures_manager = {
    id_counter: 0,

    list: [],

    create_new: function(properties) {
        creatures_manager.id_counter++;

        var new_id = creatures_manager.id_counter;
        var new_position = {};
        var new_direction;
        var new_energy = parameters_manager.get_value("creature_start_energy");
        var new_speed = (parameters_manager.get_value("creature_speed_min") + parameters_manager.get_value("creature_speed_max")) / 2;
        var new_size = (parameters_manager.get_value("creature_size_min") + parameters_manager.get_value("creature_size_max")) / 2;


        new_position["x"] = randint(0, 100 - new_size);
        new_position["y"] = randint(0, 100 - new_size);
        new_direction = randint(0, 360);


        var new_creature = new Creature(new_id, new_position, new_direction, new_energy, new_speed, new_size);


        for (let property in properties) {
            new_creature[property] = properties[property];
        }


        creatures_manager.list.push(new_creature);


        new_creature_div = document.createElement("div"); 
        new_creature_div.classList.add("creature");
        new_creature_div.setAttribute("data-id", creatures_manager.id_counter);
        new_creature_div.style.width = new_creature.size + "%";
        new_creature_div.style.height = new_creature.size + "%";
        document.getElementById("environment").append(new_creature_div);
    },




    get_average_speed: function() {
        var average = 0;

        for (creature of creatures_manager.list) {
            average += creature.speed;
        }

        average /= creatures_manager.list.length;

        return average;
    },

    get_minimum_speed: function() {
        var minimum = creatures_manager.list[0].speed;

        for (creature of creatures_manager.list) {
            if (creature.speed < minimum) {
                minimum = creature.speed;
            }
        }

        return minimum;
    },

    get_maximum_speed: function() {
        var maximum = creatures_manager.list[0].speed;

        for (creature of creatures_manager.list) {
            if (creature.speed > maximum) {
                maximum = creature.speed;
            }
        }

        return maximum;
    },
    
    
    get_average_size: function() {
        var average = 0;

        for (creature of creatures_manager.list) {
            average += creature.size;
        }

        average /= creatures_manager.list.length;

        return average;
    },

    get_minimum_size: function() {
        var minimum = creatures_manager.list[0].size;

        for (creature of creatures_manager.list) {
            if (creature.size < minimum) {
                minimum = creature.size;
            }
        }

        return minimum;
    },

    get_maximum_size: function() {
        var maximum = creatures_manager.list[0].size;

        for (creature of creatures_manager.list) {
            if (creature.size > maximum) {
                maximum = creature.size;
            }
        }

        return maximum;
    }
};





var food_manager = {
    id_counter: 0,

    list: [],

    create_new: function() {
        food_manager.id_counter++;

        var new_food = {
            id: food_manager.id_counter,
            position: {
                x: randint(0, 99),
                y: randint(0, 99)
            }
        };

        food_manager.list.push(new_food);

        new_food_div = document.createElement("div");
        new_food_div.classList.add("food");
        new_food_div.setAttribute("data-id", food_manager.id_counter);
        document.getElementById("environment").append(new_food_div);
    }
};





function visualize() {
    for (let i = 0; i < creatures_manager.list.length; i++) {
        let creature_div = document.querySelector(".creature[data-id='" + creatures_manager.list[i].id + "']");

        creature_div.style.left = creatures_manager.list[i].position.x + "%";
        creature_div.style.top = creatures_manager.list[i].position.y + "%";
    }

    for (let i = 0; i < food_manager.list.length; i++) {
        let food_div = document.querySelector(".food[data-id='" + food_manager.list[i].id + "']");

        food_div.style.left = food_manager.list[i].position.x + "%";
        food_div.style.top = food_manager.list[i].position.y + "%";
    }
}





function randint(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
