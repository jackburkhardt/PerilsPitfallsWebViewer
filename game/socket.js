const urlParams = new URLSearchParams(window.location.search);

let socket;
let auth = {};

function establishSession(url, opts, cb) {
    const defaultOpts = opts || { withCredentiasl: true };

    socket = io(url, defaultOpts);
    socket.on("connect", () => {
        console.log("Connected to server!");
        cb();
    });

    socket.on("error", (error) => {
        console.error(error);
        cb({ error });
    });
    
    socket.on("connect_error", (error) => {
        console.error(error);
        cb({ error });
    });
}

var game_id = urlParams.get("i");
var email = urlParams.get("e");
var token = urlParams.get("tk");

if (!game_id || !email || !token) {
    console.error("Invalid session parameters!");
    return;
}

auth = { game_id: game_id, email: email, token: token };


socket.emit("event", { game_id: game_id, email: email, token: token }, (response) => {
    console.log(response);
});


// event listeners for Unity functions
window.addEventListener("canYouHearMe", () => {
    console.log("Yes, I can hear you!");
});

window.addEventListener("disconnect", () => {
    socket.disconnect();
});

window.addEventListener("putSaveGame", (e) => {
    socket.emit("saveGame", e.detail.slot, e.detail.data);
});

window.addEventListener("saveGameExists", (e) => {
    socket.emit("saveGameExists", e.detail.slot, (response) => {
        UnityGame.SendMessage("App", "saveGameExists", response);
    });
});

window.addEventListener("getSaveGame", (e) => {
    socket.emit("getSaveGame", e.detail.slot, (response) => {
        UnityGame.SendMessage("App", "getSaveGame", response);
    });
});

window.addEventListener("playerEvent", (e) => {
    socket.emit("playerEvent", e.detail.data);
});
