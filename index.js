const { createClient } = require("bedrock-protocol");
const { EventEmitter } = require("events");

const client = createClient({
    host: "127.0.0.1",
    port: 19132,
    offline: true,
    username: `ILikeMining${Math.round(Math.random() * 100)}`,
});

let tickInterval;
let tick = 0;
const ticker = new EventEmitter();

const pickaxe = {
    network_id: 318,
    count: 1,
    metadata: 0,
    has_stack_id: 1,
    stack_id: 18,
    block_runtime_id: 0,
    extra: {
        has_nbt: true,
        nbt: {
            version: 1,
            nbt: {
                type: "compound",
                name: "",
                value: { Damage: { type: "int", value: 0 } },
            },
        },
        can_place_on: [],
        can_destroy: [],
    },
};

client.on("spawn", () => {
    console.log("Spawn!");
    console.log(client.startGameData.runtime_entity_id);
    tickInterval = setInterval(() => ticker.emit("tick", ++tick), 50);
});

let stop = 0;
let position = { ...client.startGameData.player_position };

ticker.on("tick", (tick) => {
    client.queue("player_auth_input", {
        pitch: client.startGameData.rotation.x,
        yaw: client.startGameData.rotation.z,
        position: {
            x: position.x,
            y: position.y,
            z: position.z,
        },
        move_vector: { x: 0, z: 0 },
        head_yaw: client.startGameData.rotation.z,
        input_data: {
            ascend: false,
            descend: false,
            north_jump: false,
            jump_down: false,
            sprint_down: false,
            change_height: false,
            jumping: false,
            auto_jumping_in_water: false,
            sneaking: false,
            sneak_down: false,
            up: false,
            down: false,
            left: false,
            right: false,
            up_left: false,
            up_right: false,
            want_up: false,
            want_down: false,
            want_down_slow: false,
            want_up_slow: false,
            sprinting: false,
            ascend_block: false,
            descend_block: false,
            sneak_toggle_down: false,
            persist_sneak: false,
            start_sprinting: false,
            stop_sprinting: false,
            start_sneaking: false,
            stop_sneaking: false,
            start_swimming: false,
            stop_swimming: false,
            start_jumping: false,
            start_gliding: false,
            stop_gliding: false,
            item_interact: false,
            block_action: false,
            item_stack_request: false,
        },
        input_mode: "touch",
        play_mode: "normal",
        interaction_model: "crosshair",
        tick,
        delta: { x: 0, y: 0, z: 0 },
    });

    if (tick % 5 === 0) breakBlock(position, tick);
});

client.on("move_player", (packet) => {
    if (BigInt(packet.runtime_id) !== client.startGameData.runtime_entity_id) return;
    if (packet.mode !== "teleport") return;
    console.log(packet);
    position = packet.position;

    breakBlock(packet.position, tick);
});

const breakBlock = ({ x, y, z }, tick) => {
    const stop = tick + 5;

    x = Math.floor(x);
    y = Math.floor(y - 1.62);
    z = Math.floor(z);

    console.log({ x, y, z, tick, stop });

    client.queue("player_auth_input", {
        pitch: client.startGameData.rotation.x,
        yaw: client.startGameData.rotation.z,
        position: { x, y: y + 1.62, z },
        move_vector: { x: 0, z: 0 },
        head_yaw: client.startGameData.rotation.z,
        input_data: {
            ascend: false,
            descend: false,
            north_jump: false,
            jump_down: false,
            sprint_down: false,
            change_height: false,
            jumping: false,
            auto_jumping_in_water: false,
            sneaking: false,
            sneak_down: false,
            up: false,
            down: false,
            left: false,
            right: false,
            up_left: false,
            up_right: false,
            want_up: false,
            want_down: false,
            want_down_slow: false,
            want_up_slow: false,
            sprinting: false,
            ascend_block: false,
            descend_block: false,
            sneak_toggle_down: false,
            persist_sneak: false,
            start_sprinting: false,
            stop_sprinting: false,
            start_sneaking: false,
            stop_sneaking: false,
            start_swimming: false,
            stop_swimming: false,
            start_jumping: false,
            start_gliding: false,
            stop_gliding: false,
            item_interact: false,
            block_action: true,
            item_stack_request: false,
        },
        input_mode: "touch",
        play_mode: "screen",
        interaction_model: "crosshair",
        tick: tick,
        delta: { x: 0, y: 0, z: 0 },
        block_action: [
            { action: "start_break", position: { x, y: (y - 1) * 2, z }, face: 2 },
            { action: "crack_break", position: { x, y: (y - 1) * 2, z }, face: 2 },
        ],
    });

    const cracks = setInterval(() => {
        if (++tick < stop)
            client.queue("player_auth_input", {
                pitch: client.startGameData.rotation.x,
                yaw: client.startGameData.rotation.z,
                position: { x, y: y + 1.62, z },
                move_vector: { x: 0, z: 0 },
                head_yaw: client.startGameData.rotation.z,
                input_data: {
                    ascend: false,
                    descend: false,
                    north_jump: false,
                    jump_down: false,
                    sprint_down: false,
                    change_height: false,
                    jumping: false,
                    auto_jumping_in_water: false,
                    sneaking: false,
                    sneak_down: false,
                    up: false,
                    down: false,
                    left: false,
                    right: false,
                    up_left: false,
                    up_right: false,
                    want_up: false,
                    want_down: false,
                    want_down_slow: false,
                    want_up_slow: false,
                    sprinting: false,
                    ascend_block: false,
                    descend_block: false,
                    sneak_toggle_down: false,
                    persist_sneak: false,
                    start_sprinting: false,
                    stop_sprinting: false,
                    start_sneaking: false,
                    stop_sneaking: false,
                    start_swimming: false,
                    stop_swimming: false,
                    start_jumping: false,
                    start_gliding: false,
                    stop_gliding: false,
                    item_interact: false,
                    block_action: true,
                    item_stack_request: false,
                },
                input_mode: "touch",
                play_mode: "screen",
                interaction_model: "crosshair",
                tick,
                delta: { x: 0, y: 0, z: 0 },
                block_action: [{ action: "crack_break", position: { x, y: (y - 1) * 2, z }, face: 2 }],
            });
        else {
            clearInterval(cracks);
            client.queue("player_auth_input", {
                pitch: client.startGameData.rotation.x,
                yaw: client.startGameData.rotation.z,
                position: { x, y: y + 1.62, z },
                move_vector: { x: 0, z: 0 },
                head_yaw: client.startGameData.rotation.z,
                input_data: {
                    ascend: false,
                    descend: false,
                    north_jump: false,
                    jump_down: false,
                    sprint_down: false,
                    change_height: false,
                    jumping: false,
                    auto_jumping_in_water: false,
                    sneaking: false,
                    sneak_down: false,
                    up: false,
                    down: false,
                    left: false,
                    right: false,
                    up_left: false,
                    up_right: false,
                    want_up: false,
                    want_down: false,
                    want_down_slow: false,
                    want_up_slow: false,
                    sprinting: false,
                    ascend_block: false,
                    descend_block: false,
                    sneak_toggle_down: false,
                    persist_sneak: false,
                    start_sprinting: false,
                    stop_sprinting: false,
                    start_sneaking: false,
                    stop_sneaking: false,
                    start_swimming: false,
                    stop_swimming: false,
                    start_jumping: false,
                    start_gliding: false,
                    stop_gliding: false,
                    item_interact: true,
                    block_action: true,
                    item_stack_request: false,
                },
                input_mode: "touch",
                play_mode: "screen",
                interaction_model: "crosshair",
                tick,
                delta: { x: 0, y: 0, z: 0 },
                transaction: {
                    legacy: {
                        legacy_request_id: 0,
                    },
                    actions: [],
                    data: {
                        action_type: "break_block",
                        block_position: { x, y: (y - 1) % 2 === 0 ? (y - 1) / 2 : -Math.ceil((y - 1) / 2), z },
                        face: 2,
                        hotbar_slot: 0,
                        held_item: pickaxe,
                        player_pos: { x, y: y + 1.62, z },
                        click_pos: { x: 0, y: 0, z: 0 },
                        block_runtime_id: 0,
                    },
                },
                block_action: [
                    { action: "stop_break" },
                    { action: "crack_break", position: { x, y: (y - 1) * 2, z }, face: 2 },
                ],
            });
        }
    }, 50);
};

client.on("text", ({ message }) => {
    if (message.startsWith(".mine")) {
        // const [x, y, z] = message.split(" ").slice(1).map(Number);

        const [x, y, z] = Object.values(position).map(Math.round);

        console.log({ x, y, z, tick });

        breakBlock(position, tick);
    }
});

client.on("inventory_content", (packet) => {
    if (packet.window_id !== "inventory") return;

    const cobble = packet.input.filter((x) => x.network_id === 4);
    const cobbleStacks = cobble.map((x) => x.count);
    const cobbleCount = cobbleStacks.length ? cobbleStacks.reduce((a, b) => a + b) : 0;

    console.log({ cobble, cobbleStacks, cobbleCount });
});
