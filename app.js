const colorDivs = document.querySelectorAll('.color');
const generateBtn = document.querySelector('.generate');
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll('.color h2');
let initialColors;

const generateHex = () =>{
    const hexColor = chroma.random();
    return hexColor;
};

const randomColors = () =>{
    colorDivs.forEach((div, index) => {
        const randomColor = generateHex();
        const hexText = div.children[0];

        div.style.backgroundColor = randomColor;
        hexText.innerText = randomColor;
    });
};

randomColors();