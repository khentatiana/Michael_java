window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;

let begin = false;
let myButton1 = document.getElementById('play');
let myButton2 = document.getElementById('reload')
let myButton3 = document.getElementById('file-button');
let myButton4 = document.getElementById('replay-song');
let songTitle = document.getElementById('name');

// getting our audio tag
let audio = document.getElementById('audio');

let start = function() {
    // initialize our visualizer by drawing the bar and starting the analyser
    let ctx = new AudioContext();
    let analyser = ctx.createAnalyser();
    let audioSrc = ctx.createMediaElementSource(audio);
    // we have to connect the MediaElementSource with the analyser 
    audioSrc.connect(analyser);
    analyser.connect(ctx.destination);
    // we could configure the analyser: e.g. analyser.fftSize (for further infos read the spec)
    // analyser.fftSize = 64;
    // frequencyBinCount tells you how many values you'll receive from the analyser
    let frequencyData = new Uint8Array(analyser.frequencyBinCount);

    // we're ready to receive some data!
    let canvas = document.getElementById('canvas'),
        cwidth = canvas.width,
        cheight = canvas.height - 2,
        meterWidth = 10, //width of the meters in the spectrum
        gap = 2, //gap between meters
        capHeight = 2,
        capStyle = '#fff',
        meterNum = 800 / (10 + 2), //count of the meters
        capYPositionArray = []; ////store the vertical position of hte caps for the preivous frame
        ctx = canvas.getContext('2d'),
        gradient = ctx.createLinearGradient(0, 0, 0, 300);

    let c1 = getRandomColor(), c2 = getRandomColor(), c3 = getRandomColor();

    gradient.addColorStop(1, c1);
    gradient.addColorStop(0.5, c2);
    gradient.addColorStop(0, c3);
    // loop
    function renderFrame() {
        let array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        let step = Math.round(array.length / meterNum); //sample limited data from the total array
        ctx.clearRect(0, 0, cwidth, cheight);
        for (let i = 0; i < meterNum; i++) {
            let value = array[i * step];
            if (capYPositionArray.length < Math.round(meterNum)) {
                capYPositionArray.push(value);
            }
            ctx.fillStyle = capStyle;
            //draw the cap, with transition effect
            if (value < capYPositionArray[i]) {
                ctx.fillRect(i * 12, cheight - (--capYPositionArray[i]), meterWidth, capHeight);
            } else {
                ctx.fillRect(i * 12, cheight - value, meterWidth, capHeight);
                capYPositionArray[i] = value;
            }
            ctx.fillStyle = gradient; //set the filllStyle to gradient for a better look
            ctx.fillRect(i * 12 /*meterWidth+gap*/ , cheight - value + capHeight, meterWidth, cheight); //the meter
        }
        requestAnimationFrame(renderFrame);
    }
    renderFrame();
    // audio.play();
};

myButton1.onclick = function() {preparation();};

function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function preparation() {
    //  start tge visualizer unless the audio tag has no src
    if (begin === true) {
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
    }
    else {
        let audio = document.getElementById("audio");
        let src = generateSource();
        audio.src = src;

        songTitle.textContent = src;
    }
    start();
    begin = true;

    audio.play();
    audio.addEventListener("ended", function () {
        begin = false;
        let src = generateSource();

        audio.src = src;
        audio.play()
        songTitle.textContent = src;
    });
}

// generates a source for our audio
function generateSource() {
    let songsArray = [], genres = [["memes", 8], ["russian", 9]], dir, fileCount;

    dir = genres[Math.floor(Math.random() * genres.length)];
    fileCount = dir[1];

    for (let i = 0; i < fileCount; i++) {
        songsArray.push("music/" + dir[0] + "/song" + i.toString() + ".mp3");
    }

    return songsArray[Math.floor(Math.random() * songsArray.length)];
}

// adding an event listener to reload the page
myButton2.onclick = function() {
    location.reload();
};

// adding an event listener for adding a file src for our audio tag
myButton3.onclick = function() {
    document.getElementById("file-input").click();
}

let file = document.getElementById("file-input");

// changing the audio src to the file that we received from the user
file.onchange = function() {
    let files = this.files;
    console.log(this.files)
    audio.src = URL.createObjectURL(files[0]);
    audio.load();
    begin = true;
    songTitle.textContent = files[0].name;
    myButton1.click();
};

// adding an event listener to replay the song that is playing
myButton4.onclick = function () {
    audio.pause();
    audio.currentTime = 0;
    audio.play();
}
