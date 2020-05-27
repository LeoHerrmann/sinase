const help_text = "<p>Sinase is an application that allows you to simulate natural selection. It lets you set up an environment with creatures and food and observe how parameters like food growth or mutations of different traits affect the population.</p>" + 

"<p>If it is the first time you are using this application, I highly recommend going through this guide to get a basic idea of how it works.</p>" +

"<h3>The basic concept</h3>" +

"<p>Every creature has an initial energy level. As time passes, creatures move and their energy levels decrease. If a creature finds food it eats it and its energy level rises. If it runs out of energy, it dies. If it manages to double its initial energy value, it reproduces and the energy is equally split between the parent and child creatures. When a creature reproduces, the new creature might have slightly different traits than its parent. This is called mutation. The maximum degree of mutation of the individual traits can be set using the parameters menu.</p>" +

"<h3>Traits</h3>" + 

"<p>Creatures can vary in their size and speed. These traits can mutate between generations.</p>" +

"<p>Larger creatures have a higher chance of picking up food. Also, creatures can eat other creatures if they are at least 1.3 times larger. In this case, the larger creature gets all the energy of the smaller creature. On the other hand, larger creatures require more energy to move.</p>" +

"<p>Faster creatures have a higher chance of picking up food, however they also require more energy to move a certain distance.</p>" +

"<h3>Parameters</h3>" +

"<p>food_growth_interval:<br/>" +
"The interval in which food grows<br/>" +
"A value of x means food will appear every x-th time unit." +

"<p>food_growth_amount:<br/>" +
"The amount of food that appears each time food grows</p>" +

"<p>creature_initial_energy:<br/>" +
"The creature's initial energy value<br/>" +
"This parameter doesn't have big effects on the population.<br/>" +
"If the value is too low however, population and food start flucuating.</p>" +

"<p>creature_[trait]_min:<br/>" +
"The minimum value a mutatable trait can have</p>" +

"<p>creature_[trait]_max:<br/>" +
"The maximum value a mutatable trait can have</p>" +

"<p>creature_[trait]_default:<br/>" +
"The value of a mutatable trait that creatures which creatures created using the population menu have</p>" +

"<p>creature_[trait]_variation:<br/>" +
"The maximum difference between a creature's trait and its parent's trait</p>" +

"<h3>First steps</h3>" +

"<p>1) Generate creatures and food using the population menu.</p>" +

"<p>2) Start the flow of time using the time menu. In case time stops automatically increase the 'simulate until' value and continue the simulation.</p>" +

"<p>3) Wait until the properties of the creatures and environment have reached a point at where they are nearly constant. Use the statistics menu to watch the development of these properties.</p>" +

"<p>4) Start changing parameters in the parameters menu. Don't make too many changes at once however, as you won't be able to see the effects of those changes properly. You can for instance change the food growth by altering food_growth_interval or food_growth_amount. Alternatively, you can also allow one of the creatures traits to mutate by editing creature_[trait]_mutation (0.1 is a good starting point here). Remember to validate and save your changes, otherwise they won't have any effect.</p>" +

"<p>5) Watch how your changes affect the environment and population using the statistics menu.</p>" +

"<p>6) Now that you've gone through the basics of how it works you can continue experimenting with more parameters.</p>";
