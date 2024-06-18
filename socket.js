const urlParams = new URLSearchParams(window.location.search);

let socket;
let auth = {};

var game_id = urlParams.get("i");
var email = urlParams.get("e");
var token = urlParams.get("tk");

if (!game_id || !email || !token) {  //keep this
    console.error("Invalid session parameters!");
} else {
    auth = {e: email, i: game_id, tk: token};

establishSession("wss://sc-perils-80117cab3167.herokuapp.com", 
    { query: auth, }, 
    
    (error) => {
        if (error) console.error({error});
    }
)
}

function establishSession(url, opts, cb) {
    const defaultOpts = opts || { withCredentials: true };

    socket = io(url, defaultOpts);
    socket.on("connect", () => {
        console.log("Connected to server!");

        console.log("Setting up event listeners...");
        window.addEventListener("canYouHearMe", () => {
            console.log("Yes, I can hear you!");
        });

        window.addEventListener("disconnect", () => {
            socket.disconnect();
        });

        window.addEventListener("putSaveGame", (e) => {
            socket.emit("saveGame", e.detail.slot, e.detail.data);
        });

        window.addEventListener("getOccupiedSaveSlots", () => {
            socket.emit("getOccupiedSaveSlots", (response) => {
                UnityGame.SendMessage("App", "getOccupiedSaveSlotsCallback", response.data); // grab only slot list
            });
        });

        window.addEventListener("getSaveGame", (e) => {
            socket.emit("getSaveGame", e.detail.slot, (response) => {
                UnityGame.SendMessage("App", "getSaveGameCallback", response.data); // grab only save data
            });
        });

        window.addEventListener("playerEvent", (e) => {
            socket.emit("playerEvent", e.detail.data);
        });

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

    socket.on("disconnect", () => {
        console.log("Disconnected from server!");
    });
}

function emitEvent(event, data, cb){
    socket.emit(event, {auth: auth}, data, (response) => {
        cb(response);
    });
}


