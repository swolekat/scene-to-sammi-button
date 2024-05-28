const createSceneCommand = (scene) => {
    return {
        "cmd": 50,
        "obsid": "Main",
        "b0": scene.name,
    };
};

const convertFilterToSammiCommand = (filter, sourceName) => {
    return {
        "b1": "",
        "cmd": 65,
        "obsid": "Main",
        "b0": JSON.stringify({
            "op": 6,
            "d": {
                "requestType": "CreateSourceFilter",
                "requestData": {
                    sourceName,
                    "filterName": filter.name,
                    "filterKind": filter.versioned_id,
                    "filterSettings": filter.settings,
                }
            }
        }),
        "b2": ""
    };
};

const convertSourceToSammiCommands = (source, sceneName) => {
    if(!source.filters){
        return [];
    }
    const filterCommands = source.filters.map(filter => convertFilterToSammiCommand(filter, source.name));

    return [
        // create source command
        {
            "b1": source.versioned_id,
            "b3": JSON.stringify(source.settings),
            "cmd": 47,
            "obsid": "Main",
            "b0": source.name,
            "b2": sceneName,
            "v0": 1
        },
        // do timeout just to make sure the scene exists before setting position and scale and filters
        {
            "cmd": 190,
            "obsid": "Main",
            "vis": true,
            "b0": "500"
        },
        // set position
        {
            "b1": source.name,
            "b3": `${source.pos.y}`,
            "cmd": 22,
            "obsid": "Main",
            "b0": sceneName,
            "b2": `${source.pos.x}`
        },
        // set scale
        {
            "b1": source.name,
            "b3": `${source.scale.y}`,
            "cmd": 32,
            "obsid": "Main",
            "b0": sceneName,
            "b2": `${source.scale.x}`
        },
        ...filterCommands,
    ];
};


export const convertSceneToSammiButton = (scene) => {
    const sourceCommands = scene.sources.map(source => convertSourceToSammiCommands(source, scene.name));
    const allCommands = [
        createSceneCommand(scene),
        ...sourceCommands.flat(),
    ];
    const command_list = allCommands.map((command, index) => {
        return {
            ...command,
            pos: index,
            ms: 0,
            sel: false,
            dis: false,
            xpan: 0,
        };
    });

    return {
        color: 12632256,
        persistent: true,
        text: `Create\n${scene.name}\nScene`,
        release_duration: 0,
        queueable: false,
        command_list,
        press_type: 0,
        x: 0,
        is_transparent: false,
        border: 2,
        image: "",
        triggers: [],
        group_id: "",
        overlappable: false,
        init_variable: "",
        width: 0.1,
        button_id: `${scene.name}-create`,
        button_duration: 0,
        y: 0,
        switch_deck: "",
        height: 0.1,
        release_list: [],
        functions: 65,
        stretch: false
    };
};

