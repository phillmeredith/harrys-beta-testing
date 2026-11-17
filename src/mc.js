// Normal Minecraft (Bedrock), grouped the way a player thinks about it. Leaves are plain names; ids are "mc:<snake_case>".
const MC_TREE = {
  "Animals and mobs": {
    "Farm animals": ["Cow","Mooshroom","Pig","Sheep","Chicken","Rabbit","Goat","Horse","Donkey","Mule","Llama","Trader llama","Camel","Sniffer"],
    "Pets and helpers": ["Wolf (dog)","Cat","Ocelot","Parrot","Fox","Axolotl","Allay","Iron golem","Snow golem","Armadillo"],
    "Wild animals": ["Panda","Polar bear","Turtle","Frog","Tadpole","Bee","Bat","Squid","Glow squid","Dolphin","Cod","Salmon","Pufferfish","Tropical fish","Strider","Armadillo"],
    "Villagers and traders": ["Villager","Wandering trader","Piglin","Piglin brute"],
    "Monsters": ["Zombie","Husk","Drowned","Zombie villager","Skeleton","Stray","Bogged","Creeper","Spider","Cave spider","Enderman","Witch","Slime","Silverfish","Endermite","Phantom","Pillager","Vindicator","Evoker","Vex","Ravager","Guardian","Elder guardian","Shulker","Breeze"],
    "Nether creatures": ["Blaze","Ghast","Magma cube","Hoglin","Zoglin","Zombified piglin","Wither skeleton"],
    "Bosses": ["Ender dragon","Wither","Warden"]
  },
  "Blocks": {
    "Ground and nature": ["Grass block","Dirt","Coarse dirt","Mud","Sand","Red sand","Gravel","Clay","Snow","Ice","Packed ice","Moss","Podzol","Mycelium","Farmland","Dirt path"],
    "Wood and trees": ["Oak","Spruce","Birch","Jungle","Acacia","Dark oak","Mangrove","Cherry","Pale oak","Bamboo","Crimson","Warped","Leaves","Saplings","Planks","Logs"],
    "Stone and bricks": ["Stone","Cobblestone","Mossy cobblestone","Stone bricks","Bricks","Granite","Diorite","Andesite","Deepslate","Tuff","Calcite","Sandstone","Prismarine","Blackstone","Basalt","Quartz","Mud bricks","Terracotta","Concrete","Glass"],
    "Ores and treasure": ["Coal ore","Iron ore","Copper ore","Gold ore","Redstone ore","Lapis ore","Diamond ore","Emerald ore","Ancient debris","Amethyst","Block of gold","Block of diamond"],
    "Plants and crops": ["Flowers","Tall grass","Wheat","Carrots","Potatoes","Beetroot","Pumpkin","Melon","Sugar cane","Cactus","Berry bushes","Kelp","Seagrass","Vines","Mushrooms","Cocoa","Dripleaf","Azalea"],
    "Light": ["Torch","Lantern","Glowstone","Sea lantern","Shroomlight","Redstone lamp","Campfire","Candle","Froglight","End rod","Jack o'lantern"],
    "Useful blocks": ["Crafting table","Furnace","Blast furnace","Smoker","Chest","Barrel","Bed","Anvil","Enchanting table","Bookshelf","Brewing stand","Cauldron","Composter","Beacon","Respawn anchor","Lectern","Loom","Smithing table","Grindstone","Stonecutter","Cartography table","Jukebox","Note block","Bell","Hay bale"],
    "Redstone and moving parts": ["Redstone dust","Lever","Button","Pressure plate","Tripwire","Repeater","Comparator","Piston","Sticky piston","Observer","Hopper","Dropper","Dispenser","Rail","Powered rail","Detector rail","TNT","Target","Door","Trapdoor","Fence gate","Daylight sensor"],
    "Decoration": ["Wool","Carpet","Banner","Painting","Item frame","Flower pot","Sign","Hanging sign","Fence","Wall","Stairs","Slabs","Glass pane","Chain","Scaffolding","Armor stand","Head or skull","Decorated pot"],
    "Water and lava": ["Water","Lava","Bubble column","Powder snow","Cobweb","Honey block","Slime block"]
  },
  "Items": {
    "Tools": ["Pickaxe","Axe","Shovel","Hoe","Shears","Fishing rod","Flint and steel","Bucket","Compass","Recovery compass","Clock","Map","Spyglass","Brush","Lead","Name tag","Bundle"],
    "Weapons": ["Sword","Bow","Crossbow","Arrow","Trident","Mace","Shield","Snowball","Egg","Wind charge","Fire charge"],
    "Armour": ["Helmet","Chestplate","Leggings","Boots","Turtle shell","Elytra","Horse armour","Wolf armour","Leather","Iron","Gold","Diamond","Netherite"],
    "Food": ["Apple","Golden apple","Golden carrot","Bread","Carrot","Potato","Baked potato","Cookie","Cake","Pumpkin pie","Melon slice","Sweet berries","Glow berries","Honey bottle","Steak","Cooked chicken","Fish","Mushroom stew","Suspicious stew","Rotten flesh"],
    "Potions and magic": ["Potions","Splash potion","Lingering potion","Enchanted book","Experience bottle","Totem of undying","Ender pearl","Eye of ender","Nether star","Heart of the sea","Echo shard"],
    "Getting around": ["Saddle","Boat","Raft","Minecart","Elytra","Firework rocket","Carrot on a stick","Warped fungus on a stick","Ender pearl"],
    "Materials": ["Stick","String","Feather","Bone","Bone meal","Gunpowder","Slime ball","Leather","Iron ingot","Gold ingot","Copper ingot","Diamond","Emerald","Netherite ingot","Redstone","Lapis lazuli","Dyes","Paper","Book"],
    "Fun stuff": ["Music discs","Goat horn","Firework star","Spawn eggs","Paintings","Banner patterns","Armour trims","Pottery sherds"]
  },
  "Places": {
    "Grassy and forest": ["Plains","Sunflower plains","Meadow","Forest","Flower forest","Birch forest","Dark forest","Pale garden","Cherry grove","Taiga","Jungle","Bamboo jungle","Swamp","Mangrove swamp"],
    "Hot and dry": ["Desert","Savanna","Badlands","Wooded badlands"],
    "Cold and snowy": ["Snowy plains","Ice spikes","Snowy taiga","Frozen river","Snowy slopes","Frozen peaks","Grove"],
    "Water": ["River","Ocean","Warm ocean","Frozen ocean","Beach","Mushroom island"],
    "Underground": ["Caves","Lush caves","Dripstone caves","Deep dark","Mineshaft","Ancient city"],
    "Villages and buildings": ["Village","Pillager outpost","Woodland mansion","Desert temple","Jungle temple","Igloo","Shipwreck","Ocean monument","Ruined portal","Trail ruins","Trial chambers","Stronghold","Witch hut"],
    "The Nether": ["Nether wastes","Crimson forest","Warped forest","Soul sand valley","Basalt deltas","Nether fortress","Bastion"],
    "The End": ["The End island","End city","End ship","End gateway"]
  },
  "How the game works": {
    "Time and weather": ["Day and night","Sunrise and sunset","Rain","Thunderstorms","Snowing","Moon phases","Seasons (not in the game yet)"],
    "Health and food": ["Hearts","Hunger","Taking damage","Falling","Drowning","Fire and lava","Healing","Dying and respawning"],
    "Making things": ["Crafting","Smelting","Brewing","Enchanting","Repairing","Smithing","Trading","Dyeing"],
    "Farming and animals": ["Planting and growing","Breeding animals","Taming","Feeding animals","Animals following me","Baby animals growing up","Bees and honey"],
    "Building and mining": ["Placing blocks","Breaking blocks","Mining speed","Explosions","Water and lava flowing","Gravity blocks (sand, gravel)","Redstone circuits"],
    "Mobs and spawning": ["Where mobs appear","How many mobs","Mobs at night","Mob drops","Raids","Mobs following or attacking"],
    "Levels and rewards": ["Experience (XP)","Levels","Achievements","Loot in chests"]
  },
  "Me, the player": {
    "Moving": ["Walking","Sprinting","Sneaking","Jumping","Swimming","Climbing","Flying (creative)","Riding","Gliding (elytra)"],
    "Hands and inventory": ["Inventory","Hotbar","Holding things","Dropping things","Picking things up","Off-hand"],
    "Touch controls": ["The joystick","Jump button","Tapping","Tap and hold","Sneak button","Camera and looking around"],
    "How I look": ["My skin","My clothes","My cape","Emotes"],
    "Seeing and hearing": ["Camera views","Screen and menus","Chat and messages","Sounds and music","Subtitles"]
  },
  "World and settings": {
    "Game rules": ["Game mode (survival, creative, adventure)","Difficulty","Keep inventory","Daylight cycle","Weather cycle","Mob spawning","Fire spreading"],
    "Playing together": ["Playing with Laura","Joining a world","Who can build","Who can open chests"],
    "World": ["Making a new world","Saving","Loading","Render distance","World size","Spawn point"],
    "Settings": ["Volume","Brightness","Text size","Controls layout"]
  }
};
