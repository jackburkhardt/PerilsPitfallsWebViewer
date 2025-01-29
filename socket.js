const urlParams = new URLSearchParams(window.location.search);

let socket;
let auth = {};

var cached_save_game = null;

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

        window.addEventListener("canYouHearMe", () => {
            console.log("Yes, I can hear you!");
        });

        window.addEventListener("disconnect", () => {
            socket.disconnect();
        });

        enterGame();

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

function enterGame(){
    socket.emit("enter", {auth: auth}, (response) => {
        var response_str = JSON.stringify(response);
        console.log("got post-entry data: " + response_str);
        cached_save_game = JSON.stringify(response.player.state)

        console.log("Setting up event listeners...");
        window.addEventListener("unityReadyForData", () => {
            unitySaveDataCallback();
        });

        window.addEventListener("putSaveGame", (e) => {
            console.log("putSaveGame event received: " + JSON.stringify(e.detail.data));
            socket.emit("putGameState", e.detail.data, (response, error) => {
                if (error) console.error(error);
            });
        });

        window.addEventListener("playerEvent", (e) => {
            socket.emit("playerEvent", e.detail.data);
        });
    });
}

function unitySaveDataCallback(){
    UnityGame.SendMessage("Save System", "WebSaveGameCallback", cached_save_game);
}

