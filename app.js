const colorDivs = document.querySelectorAll('.color');
const generateBtn = document.querySelector('.generate');
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll('.color h2');
const popup = document.querySelector('.copy-container');
const adjustBtn = document.querySelectorAll('.adjust');
const lockBtn = document.querySelectorAll('.lock');
const xBtn = document.querySelectorAll('.close-adjustment');
const sliderContainers = document.querySelectorAll('.sliders');
let initialColors;
let savedPalettes = [];



sliders.forEach(slider => {
    slider.addEventListener('input', (e) => {
        const index = 
            e.target.getAttribute("data-bright") ||
            e.target.getAttribute("data-sat") ||
            e.target.getAttribute("data-hue");

        let sliders = e.target.parentElement.querySelectorAll('input[type="range"]');
        const hue = sliders[0];
        const brightness = sliders[1];
        const saturation = sliders[2];

        const currentColor = initialColors[index];

        let color = chroma(currentColor)
            .set('hsl.s', saturation.value)
            .set('hsl.l', brightness.value)
            .set('hsl.h', hue.value);

        colorDivs[index].style.backgroundColor = color;

        colorizeSliders(color, hue, brightness, saturation);

    });
})

colorDivs.forEach((div, index) =>{
    div.addEventListener('change', () =>{
        const currentDiv = colorDivs[index];
        const thisColor = chroma(currentDiv.style.backgroundColor);
        const colorName = currentDiv.querySelector('h2');
        const icons = currentDiv.querySelectorAll('.controls button');
        colorName.innerText = thisColor.hex();
        checkContrast(thisColor, colorName);
        for (icon of icons) {
            checkContrast(thisColor, icon);
        }
    });
});

currentHexes.forEach(hex =>{
    hex.addEventListener('click', () =>{
        const el = document.createElement('textarea');
        el.innerText = hex.innerText;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);

        const popupBox = popup.children[0];
        popup.classList.add("active");
        popupBox.classList.add("active");
    });
});

popup.addEventListener('transitionend', () => {
    const popupBox = popup.children[0];
    popup.classList.remove('active');
    popupBox.classList.remove('active');
})

adjustBtn.forEach((button, index) =>{
    button.addEventListener('click', () => {
        sliderContainers[index].classList.toggle('active');
    });
});

xBtn.forEach((button, index) => {
    button.addEventListener('click', () =>{
        sliderContainers[index].classList.remove('active');
    })
})

const generateHex = () =>{
    const hexColor = chroma.random();
    return hexColor;
};


const randomColors = () =>{
    initialColors = [];
    colorDivs.forEach((div, index) => {
        const randomColor = generateHex();
        const hexText = div.children[0];
        if(div.classList.contains('locked')){
            initialColors.push(hexText.innerText);
            return;
        }else{
            initialColors.push(chroma(randomColor).hex());
        };
        
        div.style.backgroundColor = randomColor;
        hexText.innerText = randomColor;
        checkContrast(randomColor, hexText);

        const color = chroma(randomColor);
        const sliders = div.querySelectorAll('.sliders input');
        const hue = sliders[0];
        const brightness = sliders[1];
        const saturation = sliders[2];

        colorizeSliders(color, hue, brightness, saturation);
    });

    resetInputs();

    adjustBtn.forEach((button, index) =>{
        checkContrast(initialColors[index], button[index]);
        checkContrast(initialColors[index], lockBtn[index]);
    })
};



const checkContrast = (color, text) =>{
    const luminance = chroma(color).luminance();

    if(luminance < 0.5){
        text.style.color = 'white';
    }else {
        text.style.color = 'black';
    }
};

const colorizeSliders = (color, hue, brightness, saturation) =>{
    const noSat = color.set('hsl.s', 0);
    const fullSat = color.set('hsl.s', 1);
    const scaleSat = chroma.scale([noSat, color, fullSat]);
    
    const midBright = color.set('hsl.l', 0.5);
    const scaleBright = chroma.scale(['black', midBright, 'white']);

    saturation.style.backgroundImage = `linear-gradient(to right,
        ${scaleSat(0)}, 
        ${scaleSat(1)})`;
    brightness.style.backgroundImage = `linear-gradient(to right,
        ${scaleBright(0)},
        ${scaleBright(0.5)} ,
        ${scaleBright(1)})`;
    hue.style.backgroundImage = `linear-gradient(to right, 
        rgb(204,75,75),
        rgb(204,204,75),
        rgb(75,204,75),
        rgb(75,204,204),
        rgb(75,75,204),
        rgb(204,75,204),
        rgb(204,75,75))`;
};

const resetInputs = () =>{
    const sliders = document.querySelectorAll('.sliders input');
    sliders.forEach(slider=>{
        switch(slider.name){
            case "hue":
                const hueColor = initialColors[slider.getAttribute("data-hue")];
                slider.value = Math.floor(chroma(hueColor).hsl()[0]) ;
                break;
            case "brightness":
                const brightColor = initialColors[slider.getAttribute("data-bright")];
                slider.value = Math.floor(chroma(brightColor).hsl()[2] * 100) / 100;
                break;
            case "saturation":
                const satColor = initialColors[slider.getAttribute("data-sat")];
                slider.value = Math.floor(chroma(satColor).hsl()[1] * 100) / 100;
                break;
        }
    })
}
const saveBtn = document.querySelector(".save");
const submitSave = document.querySelector(".submit-save");
const closeSave = document.querySelector(".close-save");
const saveContainer = document.querySelector(".save-container");
const saveInput = document.querySelector(".save-container input");

submitSave.addEventListener("click", savePalette);


const closeLibraryBtn = document.querySelector(".close-library");
saveBtn.addEventListener("click", () =>{
    const popup = saveContainer.children[0];
    saveContainer.classList.add("active");
    popup.classList.add("active");
});
closeSave.addEventListener("click", ()=>{
    const popup = saveContainer.children[0];
    saveContainer.classList.remove("active");
    popup.classList.add("remove");
});

function savePalette(e) {
    saveContainer.classList.remove("active");
    popup.classList.remove("active");
    const name = saveInput.value;
    const colors = [];
    currentHexes.forEach(hex => {
      colors.push(hex.innerText);
    });
    let paletteNr;
    const paletteObjects = JSON.parse(localStorage.getItem("palettes"));
    if (paletteObjects) {
        paletteNr = paletteObjects.length;
    } else {
        paletteNr = savedPalettes.length;
    }

    const paletteObj = { name, colors, nr: paletteNr };
    savedPalettes.push(paletteObj);
    //Save to localStorage
    savetoLocal(paletteObj);
    saveInput.value = "";
}

function savetoLocal(paletteObj) {
    let localPalettes;
    if (localStorage.getItem("palettes") === null) {
      localPalettes = [];
    } else {
      localPalettes = JSON.parse(localStorage.getItem("palettes"));
    }
    localPalettes.push(paletteObj);
    localStorage.setItem("palettes", JSON.stringify(localPalettes));
}
generateBtn.addEventListener('click', randomColors);
randomColors();