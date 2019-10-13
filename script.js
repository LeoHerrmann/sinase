var time = 0;
var simulate_until = 0;




window.onload = function() {
    parameters_manager.fill_parameters_container();
}





var simulation = {
    start: function() {
        simulate_until = document.querySelector("input[name='simulate_until_input']").value;
        time = 0;
        
        statistics.save("population", creatures_manager.list.length);
        statistics.save("food", food_manager.list.length);
        statistics.save("average_creature_speed", creatures_manager.get_average_speed());
        
        var simulation_toggle_button = document.getElementById("simulation_toggle_button");
        simulation_toggle_button.onclick = simulation.stop;
        simulation_toggle_button.innerText = "Anhalten";

        simulation.time_unit_timeout = setTimeout(simulation.time_unit, 1000/60);
    },


    stop: function() {
      clearTimeout(simulation.time_unit_timeout);

        var simulation_toggle_button = document.getElementById("simulation_toggle_button");
        simulation_toggle_button.onclick = simulation.continue;
        simulation_toggle_button.innerText = "Fortsetzen";
    },


    continue: function() {
        simulate_until = document.querySelector("input[name='simulate_until_input']").value;
    
        simulation.time_unit_timeout = setTimeout(simulation.time_unit, 1000/60);

        var simulation_toggle_button = document.getElementById("simulation_toggle_button");
        simulation_toggle_button.onclick = simulation.stop;
        simulation_toggle_button.innerText = "Anhalten";
    },


    reset: function() {
        clearTimeout(simulation.time_unit_timeout);

        time = 0;
        simulate_until = 0;

        world.clear();
        statistics.clear();

        var simulation_toggle_button = document.getElementById("simulation_toggle_button");
        simulation_toggle_button.onclick = simulation.start;
        simulation_toggle_button.innerText = "Starten";
    },


    time_unit_timeout: 0,


    time_unit: function() {        
        if (time % 100 === 0) {
            statistics.save("population", creatures_manager.list.length);
            statistics.save("food", food_manager.list.length);
            statistics.save("average_creature_speed", creatures_manager.get_average_speed());
        }
        
        if (time < simulate_until) {
        creatures_manager.move();
        creatures_manager.eat();
        creatures_manager.check_energy();


        if (time % parameters_manager.get_value("food_growth_cycle") == 0) {
            world.populate(0, parameters_manager.get_value("food_growth_amount"));
        }


        visualize();
        
        time += 1;
        document.getElementById("current_time_label").innerText = time;
        
            simulation.time_unit_timeout = setTimeout(simulation.time_unit, 1000/60);
        }
        else {
            var simulation_toggle_button = document.getElementById("simulation_toggle_button");
            simulation_toggle_button.onclick = simulation.continue;
            simulation_toggle_button.innerText = "Fortsetzen";
        }
    }
}





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

        visualize();
    },


    clear: function() {
        creatures_manager.list = [];
        food_manager.list = [];

        document.getElementById("environment").innerHTML = "";
    }
}





var creatures_manager = {
    id_counter: 0,

    list: [],

    create_new: function(properties) {
        creatures_manager.id_counter++;

        var new_creature = {
            id: creatures_manager.id_counter,
            position: {},
            energy: parameters_manager.get_value("creature_start_energy"),
            speed: 1,


            multiply: function() {
                var child_properties = {
                    position: this.position,
                    direction: this.direction,
                    speed: this.speed
                };


                child_min_speed = this.speed - parseFloat(parameters_manager.get_value("creature_speed_variation"));
                child_max_speed = this.speed + parseFloat(parameters_manager.get_value("creature_speed_variation"));

                if (child_min_speed < parseFloat(parameters_manager.get_value("creature_speed_min"))) {
                    child_min_speed = parseFloat(parameters_manager.get_value("creature_speed_min"));
                }
                if (child_max_speed > parseFloat(parameters_manager.get_value("creature_speed_max"))) {
                    child_max_speed = parseFloat(parameters_manager.get_value("creature_speed_max"));
                }

                child_properties.speed = randint(child_min_speed * 100, child_max_speed * 100) / 100;

                creatures_manager.create_new(JSON.parse(JSON.stringify(child_properties)));

                this.energy -= parameters_manager.get_value("creature_start_energy");
            },


            die: function() {
                for (let i = 0; i < creatures_manager.list.length; i++) {
                    if (creatures_manager.list[i].id == this.id) {
                        creatures_manager.list.splice(i, 1);
                        document.querySelector(".creature[data-id='" + this.id + "']").remove();
                        break;
                    }
                }
            }
        };


        if (randint(0, 1) == 0) {
            random_number = randint(0, 1);

            new_creature.direction = [90, -90][random_number];
            new_creature.position.x = [0, 98][random_number];
            new_creature.position.y = randint(0, 98);
        }
        else {
            random_number = randint(0, 1);

            new_creature.direction = [0, 180][random_number];
            new_creature.position.y = [0, 98][random_number];
            new_creature.position.x = randint(0, 98);
        }


        for (let property in properties) {
            new_creature[property] = properties[property];
        }


        creatures_manager.list.push(new_creature);


        new_creature_div = document.createElement("div");
        new_creature_div.classList.add("creature");
        new_creature_div.setAttribute("data-id", creatures_manager.id_counter);
        document.getElementById("environment").append(new_creature_div);
    },



    move: function() {
        for (creature of creatures_manager.list) {
            creature.position.x += new_relative_position_x(creature.direction, creature.speed);
            creature.position.y += new_relative_position_y(creature.direction, creature.speed);
            creature.direction += randint(-40, 40);

            for (type in creature.position) {
                if (creature.position[type] < 0) {
                    creature.position[type] = 0;
                }
                if (creature.position[type] > 98) {
                    creature.position[type] = 98;
                }
            }

            creature.energy -= creature.speed * parameters_manager.get_value("creature_energy_consumption");
        }


        function new_relative_position_x(direction, speed) {
            return speed * Math.sin((Math.PI / 180) * direction);
        }

        function new_relative_position_y(direction, speed) {
            return speed * Math.cos((Math.PI / 180) * direction);
        }
    },



    eat: function() {
        for (creature of creatures_manager.list) {
            for (food of food_manager.list) {
                if (creature.position.x < food.position.x + 1 && creature.position.x + 2 > food.position.x &&
                    creature.position.y < food.position.y + 1 && creature.position.y + 2 > food.position.y
                ) {
                    creature.energy += 100;

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
    },



    check_energy: function() {
        for (creature of creatures_manager.list) {
            if (creature.energy >= 2 * parameters_manager.get_value("creature_start_energy")) {
                creature.multiply();
            }
            else if (creature.energy <= 0) {
                creature.die();
            }
        }
    },



    get_average_speed: function() {
        var average = 0;

        for (creature of creatures_manager.list) {
            average += creature.speed;
        }

        average /= creatures_manager.list.length;

        return average;
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
}





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
