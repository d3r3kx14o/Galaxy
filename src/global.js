var entities = [
];
var globals = {
    playground: {
        width: 1000,
        height: 800
    },
    wallThickness: 20,
    ejectInitSpeed: 8,
    ejectForce: 0.5,
    frameRate: 24,
    serverHost: "192.168.1.102",
    serverPort: 3014
};

Gang = {
    NEUTRAL: 0,
    RED: 1,
    BLUE: 2
};

var connection = null;