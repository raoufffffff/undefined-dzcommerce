import data from '../config.json'
const { email, facebook, instgarm, logo, main_color, phone, store_name, tiktok, id, tiktokP } = data
const getTextColorForBackground = (hexColor) => {
    hexColor = hexColor.replace('#', '');
    const r = parseInt(hexColor.substring(0, 2), 16);
    const g = parseInt(hexColor.substring(2, 4), 16);
    const b = parseInt(hexColor.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128 ? '#fff' : '#000';
};
const lightenHexColor = (hex, percent = 30) => {
    hex = hex.replace('#', '');

    if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
    }

    const num = parseInt(hex, 16);
    let r = (num >> 16) + Math.round((255 - (num >> 16)) * (percent / 100));
    let g = ((num >> 8) & 0x00FF) + Math.round((255 - ((num >> 8) & 0x00FF)) * (percent / 100));
    let b = (num & 0x0000FF) + Math.round((255 - (num & 0x0000FF)) * (percent / 100));

    r = Math.min(255, r);
    g = Math.min(255, g);
    b = Math.min(255, b);

    return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
};

const secondColor = lightenHexColor(main_color)
const textColor = getTextColorForBackground(main_color);
export default { email, facebook, secondColor, instgarm, logo, main_color, phone, store_name, tiktok, id, textColor, tiktokP } 