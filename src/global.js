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
    serverHost: "127.0.0.1",
    serverPort: "8080"
};

Gang = {
    NEUTRAL: 0,
    RED: 1,
    BLUE: 2
};

var connection = null;