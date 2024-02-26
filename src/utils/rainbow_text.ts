function rainbow_text(text: string) {

    const rainbowColors = [
        { r: 255, g: 0, b: 0 },     // Red
        { r: 255, g: 127, b: 0 },   // Orange
        { r: 255, g: 255, b: 0 },   // Yellow
        { r: 0, g: 255, b: 0 },     // Green
        { r: 0, g: 0, b: 255 },     // Blue
        { r: 75, g: 0, b: 130 },    // Indigo
        { r: 148, g: 0, b: 211 }    // Violet
    ];

    let rainbowText = '';
    for (let i = 0; i < text.length; i++) {
        const colorIndex = Math.round(i / text.length * (rainbowColors.length - 1));
        const color = rainbowColors[colorIndex];
        rainbowText += `\x1b[38;2;${color.r};${color.g};${color.b}m${text[i]}`;
    }
    return rainbowText + '\x1b[0m';

};

export { rainbow_text };
