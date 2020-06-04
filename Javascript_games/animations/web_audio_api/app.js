let body, num, array, width, context, logo, myElements, analyser, src, height, audio, songArray;

body = document.querySelector('body');
audio = document.querySelector('audio');

num = 64;
array = new Uint8Array(num * 2);

songArray = [];
for (let i = 0; i < 8; i++) {
    songArray.push("songs/song" + i.toString() + ".mp3");
}

audio.src = songArray[Math.floor(Math.random() * songArray.length)];

width = 10;

window.onclick = function(){
    if (audio.paused) {
        audio.play();
    }
    else {
        audio.pause();
    }

    if(context) return;

    body.querySelector('h1').remove();

    let c1 = getRandomColor(), c2 = getRandomColor(), c3 = getRandomColor(), c4 = getRandomColor();

    for(let i = 0 ; i < num ; i++){
        logo = document.createElement('div');
        logo.className = 'logo';
        logo.style.background = `linear-gradient(${c1}, ${c2}, ${c3}, ${c4})`;
        logo.style.minWidth = width + 'px';
        //
        body.appendChild(logo);
    }

    myElements = document.getElementsByClassName('logo');

    context = new AudioContext();
    analyser = context.createAnalyser();

    src = context.createMediaElementSource(audio);
    src.connect(analyser);
    analyser.connect(context.destination);
    loop();
}

function loop() {
    window.requestAnimationFrame(loop);
    analyser.getByteFrequencyData(array);

    for (let i = 0 ; i < num ; i++){
        height = array[i + num] * 3;
        myElements[i].style.height = height + 'px';
        myElements[i].style.opacity = 0.008 * height;
    }
}

function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
