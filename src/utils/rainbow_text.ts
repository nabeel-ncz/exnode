function rainbow_text(text: string) {
    const colors = ['\x1b[1;31m', '\x1b[1;33m', '\x1b[1;32m', '\x1b[1;36m', '\x1b[1;34m', '\x1b[1;35m'];
    let rainbowText = '';
    for (let i = 0; i < text.length; i++) {
        rainbowText += `${colors[i % colors.length]}${text[i]}`;
    }
    return rainbowText + '\x1b[0m';
};

export { rainbow_text };
