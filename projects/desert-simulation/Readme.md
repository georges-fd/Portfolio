# Desert Ecosystem Simulation

## Project Overview

This project simulates a desert ecosystem populated by various actors: cacti, rats, snakes, and clouds. The simulation incorporates a day/night cycle that influences the behavior of these entities based on temperature changes.

The entities in the simulation use wander, seek, flee, and follow behaviors, additionally to other species-specific behaviors that will be influenced by the day/night cycle. Rats and snakes have the ability to reproduce and share their DNA using the genetic algorithm.

## Actors and Behaviors

### Cacti:

- Continuously produce fruits, with growth accelerated by rain.
- The fruits serve as the food source for rats.

### Rats:

- Activity and speed increase during the day, allowing for faster foraging.
- Become inactive and slower at night, but their metabolism increases due to colder temperatures.
- Reproduce when reaching a specific hunger threshold, consuming energy in the process.
- Exhibit social behavior, sharing food amongst themselves. Rats will avoid eating the food if they have enough energy. Consume only what's necessary for survival and reproduction, minimizing energy waste.

### Snakes:

- Prey on rats.
- More active and have heightened perception at night due to improved temperature detection.
- Metabolism increases at night due to colder temperatures.
- Become less active during the day, leading to a reduced metabolism due to their cold-blooded nature.
- Reproduce when reaching a specific hunger threshold, consuming energy in the process.
- Snakes are selfish and will consume any prey that falls within their perception.

### Clouds:

- Form through evaporation during the day.
- Release water upon reaching a certain size, simulating rain.

## Genetic Algorithm Analysis

Rats and snakes share the ability to reproduce, using the genetic algorithm, the reproduction rate factor of each species specifies how likely two individuals are to reproduce when they come into contact. Many factors are shared in their DNA, including speed, size, perception radius, reproduction rate, metabolism, and maximum health.

The reproduction phase occurs when two individuals of a species come into contact, and after meeting the reproduction rate threshold, the crossover phase begins. During crossover, the DNA is split 50% between the parents, with a chance for mutations. Each gene has a 1% chance of mutation, which could affect the creature positively or negatively. For example, a mutation affecting the reproduction rate could lead to rapid bursts in the rat population, eventually causing negative consequences due to scarcity of food resources.

Optimizing the parameters to maintain species equilibrium is challenging, especially considering the random factors that can influence the simulation's outcome such as rain, cacti positions, and the day night cycle. However, observations indicate that rats will eventually outlive the snakes, although not by a significant margin, given the starting simulation population of 4 snakes and 35 rats. Despite the rats' numerical advantage, snakes' nocturnal advantage as formidable predators leads to rapid elimination of the rat population.

Increasing the number of rats further leads to food scarcity and a rapid decline in their population. Conversely, adding just one more snake tips the balance heavily in favor of the snakes. Adjusting the number of cacti could initially pose challenges for rat adaptation and reproduction. However, with replenished food resources during rainfall, rat populations may rebound, leading to abundance in food later in the simulation.
                                                          
## Summary

This project simulates a desert ecosystem with cacti, rats, and snakes interacting under a day/night cycle. Rats eat cacti fruits and reproduce, while snakes hunt rats at night. Rainfall and cloud formation further affect the ecosystem. You can adjust parameters like population numbers and cacti placement to study how they impact the delicate balance between predator and prey. 


