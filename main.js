const pixelScale = 8;

const fontsToLoad = [
  'Chill Bitmap 7px',
  '精品點陣體7×7 1.71',
  'QuanPixel 8px',
  'Fusion Pixel 8px Proportional',
  'Fusion Pixel 8px Monospaced',
  'GuanZhi 8px',
  '美績點陣體',
  '美績點陣體 - 明',
  'Public Pixel',
  '袖珍像素体',
  'EmptyFallback',
];

fontsToLoad.forEach(fontName => {
  document.fonts.load(`8px '${fontName}'`);
});
document.fonts.load(`1024px 'EmptyFallback'`);

let selectedFont = 'Chill Bitmap 7px';
let autoUpdate = false;

const fontSelect = document.querySelector('#fontSelect');
const fontSelectText = document.querySelector('#fontSelectText');
const fontSelectTrigger = fontSelect.querySelector('.custom-select-trigger');
const fontSelectDropdown = fontSelect.querySelector('.custom-select-dropdown');
const fontCustomInput = document.querySelector('#fontCustomInput');
const fontOptions = fontSelect.querySelectorAll('.custom-select-option');

fontSelectText.style.fontFamily = `'${selectedFont}', monospace`;
document.querySelector("#textInput").style.fontFamily = `'${selectedFont}'`;
document.querySelector("#highlightOverlay").style.fontFamily = `'${selectedFont}'`;

fontSelectTrigger.addEventListener('click', (e) => {
  e.stopPropagation();
  fontSelect.classList.toggle('open');
});

fontOptions.forEach(option => {
  option.addEventListener('click', () => {
    selectedFont = option.dataset.value;
    fontSelectText.textContent = option.dataset.value;
    fontSelectText.style.fontFamily = `'${option.dataset.value}', monospace`;
    fontOptions.forEach(o => o.classList.remove('active'));
    option.classList.add('active');
    fontSelect.classList.remove('open');
    document.querySelector("#textInput").style.fontFamily = `'${selectedFont}'`;
    document.querySelector("#highlightOverlay").style.fontFamily = `'${selectedFont}'`;
  });
});

fontCustomInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && fontCustomInput.value.trim()) {
    applyCustomFont();
  }
});

fontCustomInput.addEventListener('blur', () => {
  if (fontCustomInput.value.trim()) {
    applyCustomFont();
  }
});

function applyCustomFont() {
  selectedFont = fontCustomInput.value.trim();
  fontSelectText.textContent = selectedFont;
  fontSelectText.style.fontFamily = `'${selectedFont}', monospace`;
  fontOptions.forEach(o => o.classList.remove('active'));
  fontSelect.classList.remove('open');
  document.querySelector("#textInput").style.fontFamily = `'${selectedFont}'`;
  document.querySelector("#highlightOverlay").style.fontFamily = `'${selectedFont}'`;
  fontCustomInput.value = '';
}

fontCustomInput.addEventListener('click', (e) => e.stopPropagation());

let mouseDownTarget = null;

document.addEventListener('mousedown', (e) => {
  mouseDownTarget = e.target;
});

document.addEventListener('click', (e) => {
  if (mouseDownTarget && fontSelect.contains(mouseDownTarget)) {
    mouseDownTarget = null;
    return;
  }
  mouseDownTarget = null;
  fontSelect.classList.remove('open');
});

fontSelectDropdown.addEventListener('click', (e) => e.stopPropagation());



async function main() {
  if (!document.fonts.check(`8px '${selectedFont}'`)) {
    showToast('字体加载中...');
    await document.fonts.load(`8px '${selectedFont}'`);
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
      existingToast.remove();
    }
  }

  const inputText = document.querySelector("#textInput").innerText;
  const signType = document.querySelector(".signType:checked").value;
  const edition = document.querySelector(".edition:checked")?.value;
  const patternName = document.querySelector(".patternSelect:checked")?.value;
  const pixelMapping = patternName === 'custom' ? getPixelMapping() : patterns[patternName].pixelMapping;

  const cw = patternName === 'custom' ? getCustomCanvasWidth() : patterns[patternName].canvasWidth;
  const canvasWidth = signType === "hangingSign"
    ? (edition === "be" ? cw.beHangingSign : cw.jeHangingSign)
    : (edition === "be" ? cw.beSign : cw.jeSign);

  const overWidthChars = getOverWidthChars(inputText, canvasWidth, selectedFont);
  const unsupportedChars = getUnsupportedChars(inputText, selectedFont);
  if (overWidthChars.size > 0) showToast('部分字符超出宽度，已跳过');
  if (unsupportedChars.size > 0) showToast('部分字符不在字体中，已跳过');
  const highlightChars = new Set([...overWidthChars, ...unsupportedChars]);
  const canvases = text2canvases(inputText, canvasWidth, selectedFont, getFontParams(selectedFont), highlightChars);
  const signs = canvases2signs(canvases, selectedFont, pixelMapping);

  const signsWrapper = document.querySelector("#signsWrapper");
  const canvasWrapper = document.querySelector("#canvasWrapper");

  renderCanvases(canvases, canvasWrapper);
  renderSigns(signs, signsWrapper, signType, patternName);
  syncHighlight(highlightChars);
}

// 微调界面
const fontParams = {};

function getFontParams(fontName) {
  if (!fontParams[fontName]) {
    fontParams[fontName] = { offsetX: 0, offsetY: 0, threshold: 127 };
  }
  return fontParams[fontName];
}

let adjustMode = false;


function toggleAdjust() {
  adjustMode = !adjustMode;
  const panel = document.querySelector('#adjustPanel');
  panel.style.display = adjustMode ? 'block' : 'none';
  if (adjustMode) updateAdjustDisplay(selectedFont);
}

function updateAdjustDisplay(fontName) {
  if (!adjustMode) return;
  const p = getFontParams(fontName);
  document.querySelector('#adjustOffsetX').value = p.offsetX.toFixed(2);
  document.querySelector('#adjustOffsetY').value = p.offsetY.toFixed(2);
  document.querySelector('#adjustThreshold').value = p.threshold;
}

function resetParams(fontName) {
  fontParams[fontName] = { offsetX: 0, offsetY: 0, threshold: 127 };
  updateAdjustDisplay(fontName);
  if (autoUpdate) main();
}



document.addEventListener('DOMContentLoaded', () => {
  generatePatternOptions();
  document.querySelector('#adjustReset').addEventListener('click', () => resetParams(selectedFont));
  document.querySelector('#adjustToggle').addEventListener('click', toggleAdjust);
  document.querySelector('#adjustThreshold').addEventListener('input', () => {
    const p = getFontParams(selectedFont);
    p.threshold = parseInt(document.querySelector('#adjustThreshold').value) ?? 127;
    if (autoUpdate) main();
  });
  document.querySelector('#adjustOffsetX').addEventListener('input', () => {
    const p = getFontParams(selectedFont);
    p.offsetX = parseFloat(document.querySelector('#adjustOffsetX').value) ?? 0;
    if (autoUpdate) main();
  });
  document.querySelector('#adjustOffsetY').addEventListener('input', () => {
    const p = getFontParams(selectedFont);
    p.offsetY = parseFloat(document.querySelector('#adjustOffsetY').value) ?? 0;
    if (autoUpdate) main();
  });
  document.querySelectorAll('input[name="autoUpdate"]').forEach(radio => {
    radio.addEventListener('change', () => {
      autoUpdate = radio.value === 'on';
    });
  });

  // 自动更新绘制触发器
  document.querySelectorAll('.edition').forEach(radio => {
    radio.addEventListener('change', () => {
      generatePatternOptions();
      if (autoUpdate) main();
    });
  });
  document.querySelectorAll('.signType').forEach(radio => {
    radio.addEventListener('change', () => {
      generatePatternOptions();
      if (autoUpdate) main();
    });
  });
  document.querySelector('#textInput').addEventListener('input', () => {
    syncHighlight();
    if (autoUpdate) main();
  });
  fontOptions.forEach(option => {
    option.addEventListener('click', () => {
      if (autoUpdate) main();
    });
  });
  // 字符模式选项的事件监听器已在generatePatternOptions中添加

  document.querySelector('#patternWrapper').addEventListener('input', () => {
    if (autoUpdate) main();
  });

  document.querySelectorAll('.canvas-width-row input[type="number"]').forEach(input => {
    const clamp = () => {
      const val = parseInt(input.value);
      if (!isNaN(val)) {
        input.value = Math.max(0, Math.round(val / 2) * 2);
      }
    };
    input.addEventListener('input', () => {
      if (autoUpdate) { clamp(); main(); }
    });
    input.addEventListener('blur', () => {
      clamp();
      if (autoUpdate) main();
    });
  });

  document.querySelectorAll('.adjust-input').forEach(input => {
    const clamp = () => {
      const val = parseFloat(input.value);
      if (!isNaN(val)) {
        input.value = Math.max(parseFloat(input.min), Math.min(parseFloat(input.max), val));
      }
    };
    input.addEventListener('input', () => {
      if (autoUpdate) { clamp(); main(); }
    });
    input.addEventListener('blur', () => {
      clamp();
      if (autoUpdate) main();
    });
  });
});

function text2canvases(text, canvasWidth, fontName, params, highlightChars) {
  let canvases = [];
  const paragraphs = text.replace(/\r/g, '').split('\n');

  for (const para of paragraphs) {
    let textArray = Array.from(para);
    while (textArray.length) {
      let canvas = document.createElement("canvas");
      canvas.className = "previewCanvas";
      canvas.height = 8 * pixelScale;
      canvas.width = canvasWidth * pixelScale;
      let ctx = canvas.getContext("2d");
      ctx.imageSmoothingEnabled = false;
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#000";
      ctx.font = `${8 * pixelScale}px '${fontName}'`;
      ctx.textBaseline = 'top';

      let widthUsed = 0;
      let widthCharNext = 0;
      do {
        let Char = textArray.shift();
        if (highlightChars.has(Char)) {
          if (!textArray.length) break;
          widthCharNext = ctx.measureText(textArray[0]).width;
          continue;
        }
        let charWidth = ctx.measureText(Char).width;
        ctx.fillText(Char, Math.round(widthUsed) + params.offsetX * canvas.height, params.offsetY * canvas.height);
        widthUsed += charWidth;
        if (!textArray.length) break;
        widthCharNext = ctx.measureText(textArray[0]).width;
      } while (widthUsed + widthCharNext <= canvas.width);

      if (widthUsed === 0) continue;
      canvases.push(canvas);
    }
  }
  return canvases;
}


function getUnsupportedChars(text, fontName) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  ctx.font = `1024px '${fontName}', 'EmptyFallback'`;

  const unsupported = new Set();
  const unique = [...new Set(text.replace(/[\r\n]/g, ''))];
  for (const char of unique) {
    if (char === '\n') continue;
    const m = ctx.measureText(char);
    const isEmptyFallback =
      m.fontBoundingBoxAscent === 1024 &&
      m.fontBoundingBoxDescent === 0 &&
      m.actualBoundingBoxLeft === 1024 &&
      m.actualBoundingBoxRight === 0 &&
      m.actualBoundingBoxAscent === 0 &&
      m.actualBoundingBoxDescent === 1024 &&
      m.width === 1024;
    console.log(`[font-check] "${char}" U+${char.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')} ` +
      `fontBB(${m.fontBoundingBoxAscent},${m.fontBoundingBoxDescent}) ` +
      `actualBB(L=${m.actualBoundingBoxLeft},R=${m.actualBoundingBoxRight},A=${m.actualBoundingBoxAscent},D=${m.actualBoundingBoxDescent}) ` +
      `w=${m.width} → ${isEmptyFallback ? 'UNSUPPORTED' : 'ok'}`);
    if (isEmptyFallback) {
      unsupported.add(char);
    }
  }
  return unsupported;
}

function getOverWidthChars(text, availableWidth, fontName) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  ctx.font = `8px '${fontName}'`;

  const overWidth = new Set();
  const unique = [...new Set(text.replace(/[\r\n]/g, ''))];
  for (const char of unique) {
    if (char === '\n') continue;
    const charWidth = ctx.measureText(char).width;
    if (charWidth > availableWidth) {
      overWidth.add(char);
    }
  }
  return overWidth;
}


function syncHighlight(highlightChars) {
  const div = document.querySelector("#textInput");
  const overlay = document.querySelector("#highlightOverlay");
  if (!div || !overlay) return;

  if (!highlightChars) {
    const text = div.innerText;
    const signType = document.querySelector(".signType:checked")?.value;
    const edition = document.querySelector(".edition:checked")?.value;
    const patternName = document.querySelector(".patternSelect:checked")?.value;
    const cw = patternName === 'custom' ? getCustomCanvasWidth() : patterns[patternName].canvasWidth;
    const canvasWidth = signType === "hangingSign"
      ? (edition === "be" ? cw.beHangingSign : cw.jeHangingSign)
      : (edition === "be" ? cw.beSign : cw.jeSign);
    const overWidthChars = getOverWidthChars(text, canvasWidth, selectedFont);
    const unsupportedChars = getUnsupportedChars(text, selectedFont);
    highlightChars = new Set([...overWidthChars, ...unsupportedChars]);
  }
  const text = div.innerText;

  let html = '';
  for (const char of text) {
    if (char === '\n') {
      html += '<br>';
    } else if (highlightChars.has(char)) {
      html += `<span class="highlight-char">${char === '&' ? '&amp;' : char === '<' ? '&lt;' : char === '>' ? '&gt;' : char}</span>`;
    } else {
      html += char === '&' ? '&amp;' : char === '<' ? '&lt;' : char === '>' ? '&gt;' : char;
    }
  }
  overlay.innerHTML = html;
}

function canvases2signs(canvases, fontName, pixelMapping) {
  let signs = [];
  const threshold = getFontParams(fontName).threshold;
  const scale = pixelScale;

  canvases.forEach(canvas => {
    let ctx = canvas.getContext("2d");
    let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    const targetRows = canvas.height / scale;
    const targetCols = canvas.width / scale;
    let canvasData = Array.from(new Array(targetRows), () => new Array(targetCols));

    for (let row = 0; row < targetRows; row++) {
      for (let col = 0; col < targetCols; col++) {
        let rSum = 0, gSum = 0, bSum = 0, count = 0;
        for (let sy = row * scale; sy < (row + 1) * scale; sy++) {
          for (let sx = col * scale; sx < (col + 1) * scale; sx++) {
            let i = (sy * canvas.width + sx) * 4;
            rSum += imgData[i];
            gSum += imgData[i + 1];
            bSum += imgData[i + 2];
            count++;
          }
        }
        let avg = (rSum + gSum + bSum) / (3 * count);
        canvasData[row][col] = avg < threshold ? 1 : 0;
      }
    }

    let sign = Array.from(new Array(targetRows / 2), () => new Array(targetCols / 2));
    for (let y = 1; y < targetRows; y += 2) {
      for (let x = 1; x < targetCols; x += 2) {
        let p1 = canvasData[y - 1][x - 1],
          p2 = canvasData[y - 1][x],
          p3 = canvasData[y][x - 1],
          p4 = canvasData[y][x];
        sign[(y - 1) / 2][(x - 1) / 2] = pixelMapping[(p1 << 3) | (p2 << 2) | (p3 << 1) | p4];
      }
    }
    sign = sign.map(e => e.join(""));
    signs.push(sign);
  });
  return signs;
}

function renderCanvases(canvases, wrapper) {
  wrapper.innerHTML = "";
  canvases.forEach(canvas => {
    wrapper.appendChild(canvas);
  });
}

function renderSigns(signs, wrapper, signType, patternName) {
  wrapper.innerHTML = "";

  const edition = document.querySelector(".edition:checked")?.value;

  signs.forEach(sign => {
    let signElement = document.createElement("div");
    signElement.className = "sign";
    if (signType === "hangingSign") {
      signElement.classList.add("sign-hanging");
    }


    sign.forEach(signLineText => {
      let signLineElement = document.createElement("pre");
      signLineElement.className = "signLine";
      signLineElement.style.fontFamily = '"Minecraft AE", monospace';
      signLineElement.innerText = signLineText;
      signElement.appendChild(signLineElement);

      let copyButton = document.createElement("button");
      copyButton.className = "lineCopyButton";
      copyButton.innerText = "复制";
      copyButton.title = "复制";
      copyButton.addEventListener("click", () => {
        try {
          let text = signLineText;
          // if ((text.match(/[◙◛◚]/g) || []).length >= 11) {
          //   text = text.replace(/ $/, '');
          // }
          copyToClipboard(text);
        } catch (err) {
          window.alert("复制失败: " + err);
        }
      });
      signElement.appendChild(copyButton);
    });

    let copyAllButton = document.createElement("button");
    copyAllButton.innerText = "复制全部";
    copyAllButton.addEventListener("click", () => {
      try {
        copyToClipboard(sign.join("\n"));
      } catch (err) {
        window.alert("复制失败: " + err);
      }
    });
    signElement.appendChild(copyAllButton);

    wrapper.appendChild(signElement);
  });
}

function showToast(message) {
  let container = document.querySelector('#toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('showing');
  });

  setTimeout(() => {
    toast.classList.remove('showing');
    toast.classList.add('hiding');
    toast.addEventListener('transitionend', () => {
      toast.remove();
    }, { once: true });
  }, 3000);
}

function copyToClipboard(text) {
  const clipboard = navigator.clipboard;
  if (clipboard) {
    clipboard.writeText(text).then(() => {
      showToast('已复制到剪贴板');
    }).catch(() => {
      execCommandCopyToClipboard();
    });
  }
  else {
    execCommandCopyToClipboard();
  }

  function execCommandCopyToClipboard() {
    let textArea = document.createElement("textArea");
    textArea.className = "clipboard-helper";
    textArea.setAttribute("readonly", "readonly");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("Copy");
    textArea.remove();
    showToast('已复制到剪贴板');
  }
}