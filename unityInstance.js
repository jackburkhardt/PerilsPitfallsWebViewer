let UnityGame = null;

// Most of this is boilerplate from the Unity documentation
if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    // Mobile device style: fill the whole browser client area with the game canvas:
    var meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes';
    document.getElementsByTagName('head')[0].appendChild(meta);

    var canvas = document.querySelector("#unity-canvas");
    canvas.style.width = window.innerWidth;
    canvas.style.height = window.innerHeight;
    canvas.style.position = "fixed";

    document.body.style.textAlign = "left";
  }

  createUnityInstance(document.querySelector("#unity-canvas"), {
    dataUrl: "Build/PerilsPitfallsWebViewer.data",
    frameworkUrl: "Build/PerilsPitfallsWebViewer.framework.js",
    codeUrl: "Build/PerilsPitfallsWebViewer.wasm",
    streamingAssetsUrl: "StreamingAssets",
    companyName: "SimCase",
    productName: "Perils and Pitfalls",
    productVersion: "0.1.3a",
    matchWebGLToCanvasSize: true, // Uncomment this to separately control WebGL canvas render size and DOM element size.
    // devicePixelRatio: 1, // Uncomment this to override low DPI rendering on high DPI displays.
  }).then((unityInstance) => {
    UnityGame = unityInstance;
  }).catch(console.error);
