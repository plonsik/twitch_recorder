import {createCanvas, CanvasRenderingContext2D} from 'canvas';
import {AttachmentBuilder} from 'discord.js';

const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
  let lines: string[] = [];
  let words = text.split(' ');
  let line = '';

  for (let n = 0; n < words.length; n++) {
    let testLine = line + words[n] + ' ';
    let metrics = ctx.measureText(testLine);
    let testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      lines.push(line.trim());
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line.trim());
  return lines;
};

export const generateTwitchChatImage = async (
  username: string,
  message: string,
): Promise<AttachmentBuilder> => {
  const margin = 10;
  const lineHeight = 30;
  const baseCanvasWidth = 700;

  const ctxTest = createCanvas(1, 1).getContext('2d');
  ctxTest.font = '24px Arial';
  const prefix = `${username}: `;
  const prefixWidth = ctxTest.measureText(prefix).width;

  const messageMaxWidth = baseCanvasWidth - prefixWidth - 2 * margin;
  const wrappedLines = wrapText(ctxTest, message, messageMaxWidth);

  const canvasHeight = lineHeight * wrappedLines.length;
  const canvas = createCanvas(baseCanvasWidth, canvasHeight);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#18181B';
  ctx.fillRect(0, 0, baseCanvasWidth, canvasHeight);

  ctx.font = '24px Arial';
  ctx.fillStyle = 'white';

  const totalContentHeight = wrappedLines.length * lineHeight;
  const verticalStartPosition = (canvasHeight - totalContentHeight) / 2;

  ctx.fillText(prefix + wrappedLines[0], margin, verticalStartPosition + 24);

  for (let i = 1; i < wrappedLines.length; i++) {
    ctx.fillText(
      wrappedLines[i],
      prefixWidth + margin,
      verticalStartPosition + 24 + i * lineHeight,
    );
  }

  const buffer = canvas.toBuffer('image/png');
  return new AttachmentBuilder(buffer, {name: `${username}.png`});
};
