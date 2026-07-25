const patterns = {

  // je 1.0~1.19.4

  "je-1.0-block": {
    name: "方块字符（1.0~1.19.4）",
    symbol: "▞",
    pixelMapping: ["  ", " ▗", "▖ ", "▄", " ▝", "▐", "▞", "▟", "▘ ", "▚", "▌ ", "▙", "▀", "▜", "▛", "█"],
    canvasWidth: {
      jeSign: 20,
      jeHangingSign: 10, // 1.19.4 实验性玩法
    },
  },

  "je-1.0-braille": {
    name: "盲文字符（1.0~1.19.4）",
    symbol: "⣤⡜⠛",
    pixelMapping: ["⠀⠀⠀", "⠀⢠⣤", "⣤⡄⠀", "⣤⣤⣤", "⠀⠘⠛", "⠀⢸⣿", "⣤⡜⠛", "⣤⣼⣿", "⠛⠃⠀", "⠛⢣⣤", "⣿⡇⠀", "⣿⣧⣤", "⠛⠛⠛", "⠛⢻⣿", "⣿⡟⠛", "⣿⣿⣿"],
    canvasWidth: {
      jeSign: 20,
      jeHangingSign: 10, // 1.19.4 实验性玩法
    },
  },

  // je 1.20+

  "je-1.20-block-circleSquare": {
    name: "方块字符（1.20+）",
    symbol: "▗◚",
    pixelMapping: ["  ", " ◛", "◛ ", "▄", " ◚", "▐", "🙾", "◛▉", "◚ ", "🙿", "▌ ", "▉◛", "▀", "◚▉", "▉◚", "█"],
    canvasWidth: {
      jeSign: 20,
      jeHangingSign: 12,
    },
  },

  "je-1.20-circleSquare": {
    name: "含圆方块字符（1.20+）",
    symbol: "◛◚",
    pixelMapping: ["  ", " ◛", "◛ ", "◛◛", " ◚", " ◙", "◛◚", "◛◙", "◚ ", "◚◛", "◙ ", "◙◛", "◚◚", "◚◙", "◙◚", "◙◙"],
    canvasWidth: {
      jeSign: 18,
      jeHangingSign: 12,
    },
  },

  "je-1.20-wide": {
    name: "方块字符 宽（1.20+）",
    symbol: "▄▀",
    pixelMapping: ["    ", "  ▄", "▄  ", "▄▄", "  ▀", "  █", "▄▀", "▄█", "▀  ", "▀▄", "█  ", "█▄", "▀▀", "▀█", "█▀", "██"],
    canvasWidth: {
      jeSign: 10,
      jeHangingSign: 6,
    },
  },

  "je-1.20-braille": {
    name: "盲文字符（1.20+）",
    symbol: "⣤⡜⠛",
    pixelMapping: ["⠀⠀⠀", "⠀⢠⣤", "⣤⡄⠀", "⣤⣤⣤", "⠀⠘⠛", "⠀⢸⣿", "⣤⡜⠛", "⣤⣼⣿", "⠛⠃⠀", "⠛⢣⣤", "⣿⡇⠀", "⣿⣧⣤", "⠛⠛⠛", "⠛⢻⣿", "⣿⡟⠛", "⣿⣿⣿"],
    canvasWidth: {
      jeSign: 20,
      jeHangingSign: 12,
    },
  },

  // be

  "be-block": {
    name: "方块字符",
    symbol: "▞",
    pixelMapping: ["  ", " ▗", "▖ ", "▄", " ▝", " ▐", "▞", "▟", "▘ ", "▚", "▌ ", "▙", "▀", "▜", "▛", "█"], // 不完全对齐
    canvasWidth: {
      beSign: 18,
      beHangingSign: 12, // 以及 1.19.50 实验性玩法 下一个主要更新
    },
  },

  "be-circleSquare": {
    name: "含圆方块字符",
    symbol: "◛◚",
    pixelMapping: ["  ", " ◛", "◛ ", "◛◛", " ◚", " ◙", "◛◚", "◛◙", "◚ ", "◚◛", "◙ ", "◙◛", "◚◚", "◚◙", "◙◚", "◙◙"], // 不完全对齐
    canvasWidth: {
      beSign: 16,
      beHangingSign: 12, // 以及 1.19.50 实验性玩法 下一个主要更新
    },
  },

  "be-wide": {
    name: "方块字符 宽",
    symbol: "▄▀",
    pixelMapping: ["    ", "  ▄", "▄  ", "▄▄", "  ▀", "  █", "▄▀", "▄█", "▀  ", "▀▄", "█  ", "█▄", "▀▀", "▀█", "█▀", "██"], // 不完全对齐
    canvasWidth: {
      beSign: 8,
      beHangingSign: 6, // 以及 1.19.50 实验性玩法 下一个主要更新
    },
  },

  "be-braille": {
    name: "盲文字符",
    symbol: "⣤⡜⠛",
    pixelMapping: ["⠀⠀⠀", "⠀⢠⣤", "⣤⡄⠀", "⣤⣤⣤", "⠀⠘⠛", "⠀⢸⣿", "⣤⡜⠛", "⣤⣼⣿", "⠛⠃⠀", "⠛⢣⣤", "⣿⡇⠀", "⣿⣧⣤", "⠛⠛⠛", "⠛⢻⣿", "⣿⡟⠛", "⣿⣿⣿"],
    canvasWidth: {
      beSign: 16,
      beHangingSign: 10, // 以及 1.19.50 实验性玩法 下一个主要更新
    },
  },

};

function getCanvasWidthKey() {
  const edition = document.querySelector(".edition:checked")?.value;
  const signType = document.querySelector(".signType:checked")?.value;
  return edition + signType.charAt(0).toUpperCase() + signType.slice(1);
}

function generatePatternOptions() {
  const container = document.querySelector('#patternOptions');
  const currentChecked = container.querySelector('.patternSelect:checked')?.value;
  container.innerHTML = '';

  const canvasWidthKey = getCanvasWidthKey();

  // 添加预定义的模式选项
  let firstVisible = null;
  for (const [value, pattern] of Object.entries(patterns)) {
    // 如果canvasWidth为null或undefined，则跳过该选项
    if (pattern.canvasWidth[canvasWidthKey] === null || pattern.canvasWidth[canvasWidthKey] === undefined) {
      continue;
    }

    const label = document.createElement('label');
    label.className = 'radio-option';

    const input = document.createElement('input');
    input.type = 'radio';
    input.className = 'patternSelect';
    input.name = 'patternSelect';
    input.value = value;

    const symbolSpan = document.createElement('span');
    symbolSpan.className = 'char-symbol';
    symbolSpan.textContent = pattern.symbol;

    const textSpan = document.createElement('span');
    textSpan.textContent = pattern.name;

    label.appendChild(input);
    label.appendChild(symbolSpan);
    label.appendChild(textSpan);
    container.appendChild(label);

    if (!firstVisible) firstVisible = value;
  }

  // 添加自定义选项
  const customLabel = document.createElement('label');
  customLabel.className = 'radio-option';

  const customInput = document.createElement('input');
  customInput.type = 'radio';
  customInput.className = 'patternSelect';
  customInput.name = 'patternSelect';
  customInput.value = 'custom';

  const customTextSpan = document.createElement('span');
  customTextSpan.textContent = '自定义';

  customLabel.appendChild(customInput);
  customLabel.appendChild(customTextSpan);
  container.appendChild(customLabel);

  // 恢复之前选中的选项，如果不可见则选中第一个可见选项
  const toRestore = container.querySelector(`.patternSelect[value="${currentChecked}"]`);
  if (toRestore && currentChecked !== 'custom') {
    toRestore.checked = true;
  } else if (currentChecked === 'custom') {
    customInput.checked = true;
  } else {
    const firstRadio = container.querySelector('.patternSelect:not([value="custom"])');
    if (firstRadio) {
      firstRadio.checked = true;
      if (patterns[firstRadio.value]) {
        showPixelMapping(patterns[firstRadio.value].pixelMapping);
      }
    }
  }

  // 添加事件监听器
  container.querySelectorAll('.patternSelect').forEach(radio => {
    radio.addEventListener('click', function () {
      if (this.value !== 'custom' && patterns[this.value]) {
        showPixelMapping(patterns[this.value].pixelMapping);
      }
      showHidePatternCustomize();
    });
  });
}

function showHidePatternCustomize() {
  const section = document.querySelector('#patternSection');
  const customRadio = document.querySelector('.patternSelect[value="custom"]');
  section.classList.toggle('expanded', customRadio.checked);
}

function showPixelMapping(pixelMapping) {
  const patternWrapper = document.querySelector("#patternWrapper");
  const patternTemplate = document.querySelector("#patternTemplate");
  patternWrapper.innerHTML = "";
  pixelMapping.forEach((char, index) => {
    const charName = index.toString(2).padStart(4, "0");
    const dom = patternTemplate.content.cloneNode(true);
    dom.querySelector("code").textContent = `0b${charName}`;
    const dom_input = dom.querySelector("input");
    dom_input.id = `pattern_0b${charName}`;
    dom_input.value = char;
    dom_input.style.fontFamily = "'Minecraft AE', monospace";
    patternWrapper.appendChild(dom);
  });
}

function getPixelMapping() {
  const inputs = document.querySelectorAll("#patternWrapper input[name='pattern']");
  const result = [];
  inputs.forEach(input => {
    result.push(input.value);
  });
  return result;
}

function getCustomCanvasWidth() {
  return {
    jeSign: parseInt(document.querySelector("#custom-pixelWidth-je-sign").value) ?? 20,
    jeHangingSign: parseInt(document.querySelector("#custom-pixelWidth-je-hangingSign").value) ?? 12,
    beSign: parseInt(document.querySelector("#custom-pixelWidth-be-sign").value) ?? 20,
    beHangingSign: parseInt(document.querySelector("#custom-pixelWidth-be-hangingSign").value) ?? 12,
  };
}
