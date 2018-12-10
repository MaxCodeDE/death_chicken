const chickenName = "Death Chicken";

var system = server.registerSystem(0,0);

system.initialize = function() {
    this.listenForEvent("minecraft:entity_death", (eventData) => this.onEntityDeath(eventData));
}

system.onEntityDeath = function (eventData) {
    
    if (eventData.entity.__identifier__ === "minecraft:player") {

        this.executeCommand(eventData, "/time set 0");

        this.broadcastEvent("minecraft:spawn_particle_attached_entity", {'effect': 'minecraft:angry_villager', 'entity': eventData.entity, 'offset': [0,0,0]});

        //this.createEntity("item_entity", "minecraft:iron_sword");

        this.spawnChicken(eventData);

        this.printDeathPos(eventData);
        
    }
}


system.printDeathPos = function (eventData) {
    var deathEntityPos = this.getComponent(eventData.entity, "minecraft:position");
    
    this.log(`Gestorben bei:`); 
    this.log(`X: ${deathEntityPos.x}`); 
    this.log(`Y: ${deathEntityPos.y}`); 
    this.log(`Z: ${deathEntityPos.z}`); 
}

system.spawnChicken = function (eventData) {
    // Spawn the start game chicken
    var deathChicken = this.createEntity("entity", "minecraft:chicken");
    
    var deathChickenName = this.createComponent(deathChicken, "minecraft:nameable");
    deathChickenName.alwaysShow = true;
    deathChickenName.name = chickenName;
    this.applyComponentChanges(deathChicken, deathChickenName);
    
    var deathEntityPos = this.getComponent(eventData.entity, "minecraft:position");
    var deathChickenPos = this.getComponent(deathChicken, "minecraft:position");
    deathChickenPos.x = deathEntityPos.x;
    deathChickenPos.y = deathEntityPos.y;
    deathChickenPos.z = deathEntityPos.z;
    this.applyComponentChanges(deathChicken, deathChickenPos);
    
}

system.executeCommand = function (eventData, command) {
    this.broadcastEvent("minecraft:execute_command", command);
}

system.log = function (message) {
    this.broadcastEvent("minecraft:display_chat_event", message);  
}