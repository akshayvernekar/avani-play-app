import Phaser from 'phaser';
import { GeneratedPuzzle, PieceData } from './PuzzleConfig';

export class PuzzleGenerator {
  /**
   * Cuts an image into jigsaw puzzle pieces dynamically and adds textures to the Phaser scene.
   */
  public static generatePuzzle(
    scene: Phaser.Scene,
    sourceImageKey: string,
    puzzleId: string,
    rows: number,
    cols: number,
    targetWidth: number = 420
  ): GeneratedPuzzle {
    // Obtain source texture from Phaser texture manager
    const sourceTexture = scene.textures.get(sourceImageKey);
    const imageSource = sourceTexture.getSourceImage() as HTMLImageElement | HTMLCanvasElement;

    // Calculate aspect ratio and dimensions
    const origWidth = imageSource.width || 500;
    const origHeight = imageSource.height || 500;
    const aspectRatio = origHeight / origWidth;

    const fullWidth = targetWidth;
    const fullHeight = targetWidth * aspectRatio;

    const cellW = fullWidth / cols;
    const cellH = fullHeight / rows;

    const tabSize = Math.min(cellW, cellH) * 0.22;
    const padding = tabSize * 1.6; // Safety margins for tabs

    // Create scaling offscreen canvas for source image
    const sourceCanvas = document.createElement('canvas');
    sourceCanvas.width = fullWidth;
    sourceCanvas.height = fullHeight;
    const sCtx = sourceCanvas.getContext('2d')!;
    sCtx.drawImage(imageSource, 0, 0, fullWidth, fullHeight);

    // Generate random tab directions for internal edges
    const horizTabs: number[][] = Array.from({ length: rows - 1 }, () =>
      Array.from({ length: cols }, () => (Math.random() < 0.5 ? 1 : -1))
    );
    const vertTabs: number[][] = Array.from({ length: rows }, () =>
      Array.from({ length: cols - 1 }, () => (Math.random() < 0.5 ? 1 : -1))
    );

    // Create ghost cutout texture (wooden board with carved piece outlines)
    const ghostTextureKey = `ghost_${puzzleId}`;
    if (scene.textures.exists(ghostTextureKey)) {
      scene.textures.remove(ghostTextureKey);
    }

    const ghostCanvas = document.createElement('canvas');
    ghostCanvas.width = fullWidth;
    ghostCanvas.height = fullHeight;
    const gCtx = ghostCanvas.getContext('2d')!;

    // 1. Draw warm wooden board background
    gCtx.fillStyle = '#E8C89B';
    gCtx.fillRect(0, 0, fullWidth, fullHeight);

    // Add subtle wood grain lines
    gCtx.strokeStyle = 'rgba(160, 110, 60, 0.15)';
    gCtx.lineWidth = 3;
    for (let y = 10; y < fullHeight; y += 18) {
      gCtx.beginPath();
      gCtx.moveTo(0, y);
      gCtx.bezierCurveTo(fullWidth * 0.3, y + 6, fullWidth * 0.7, y - 6, fullWidth, y);
      gCtx.stroke();
    }

    // 2. Draw ghost image at 25% opacity
    gCtx.globalAlpha = 0.28;
    gCtx.drawImage(sourceCanvas, 0, 0);
    gCtx.globalAlpha = 1.0;

    // 3. Draw carved jigsaw piece outlines onto the wooden board
    gCtx.save();
    gCtx.strokeStyle = '#5D3A1A'; // Dark carved wooden groove
    gCtx.lineWidth = 4;
    gCtx.lineCap = 'round';
    gCtx.lineJoin = 'round';

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x0 = c * cellW;
        const y0 = r * cellH;
        const x1 = (c + 1) * cellW;
        const y1 = (r + 1) * cellH;

        const topTab = r === 0 ? 0 : -horizTabs[r - 1][c];
        const rightTab = c === cols - 1 ? 0 : vertTabs[r][c];
        const bottomTab = r === rows - 1 ? 0 : horizTabs[r][c];
        const leftTab = c === 0 ? 0 : -vertTabs[r][c - 1];

        gCtx.beginPath();
        gCtx.moveTo(x0, y0);
        this.drawJigsawEdge(gCtx, x0, y0, x1, y0, topTab, tabSize);
        this.drawJigsawEdge(gCtx, x1, y0, x1, y1, rightTab, tabSize);
        this.drawJigsawEdge(gCtx, x1, y1, x0, y1, bottomTab, tabSize);
        this.drawJigsawEdge(gCtx, x0, y1, x0, y0, leftTab, tabSize);
        gCtx.closePath();
        gCtx.stroke();
      }
    }

    // Outer wooden frame border highlight
    gCtx.strokeStyle = '#3E240B';
    gCtx.lineWidth = 8;
    gCtx.strokeRect(4, 4, fullWidth - 8, fullHeight - 8);

    gCtx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    gCtx.lineWidth = 3;
    gCtx.strokeRect(10, 10, fullWidth - 20, fullHeight - 20);
    gCtx.restore();

    scene.textures.addCanvas(ghostTextureKey, ghostCanvas);

    const pieces: PieceData[] = [];

    // Cut each piece
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const pieceCanvas = document.createElement('canvas');
        const pWidth = cellW + padding * 2;
        const pHeight = cellH + padding * 2;
        pieceCanvas.width = pWidth;
        pieceCanvas.height = pHeight;

        const ctx = pieceCanvas.getContext('2d')!;

        const topTab = r === 0 ? 0 : -horizTabs[r - 1][c];
        const rightTab = c === cols - 1 ? 0 : vertTabs[r][c];
        const bottomTab = r === rows - 1 ? 0 : horizTabs[r][c];
        const leftTab = c === 0 ? 0 : -vertTabs[r][c - 1];

        ctx.save();
        ctx.beginPath();

        const x0 = padding;
        const y0 = padding;
        const x1 = padding + cellW;
        const y1 = padding + cellH;

        ctx.moveTo(x0, y0);

        this.drawJigsawEdge(ctx, x0, y0, x1, y0, topTab, tabSize);
        this.drawJigsawEdge(ctx, x1, y0, x1, y1, rightTab, tabSize);
        this.drawJigsawEdge(ctx, x1, y1, x0, y1, bottomTab, tabSize);
        this.drawJigsawEdge(ctx, x0, y1, x0, y0, leftTab, tabSize);

        ctx.closePath();
        ctx.clip();

        const srcX = c * cellW - padding;
        const srcY = r * cellH - padding;
        ctx.drawImage(sourceCanvas, srcX, srcY, pWidth, pHeight, 0, 0, pWidth, pHeight);

        // 3D Wooden Bevel Border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 5;
        ctx.stroke();

        ctx.strokeStyle = '#3E240B';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.restore();

        const textureKey = `piece_${puzzleId}_${r}_${c}`;
        if (scene.textures.exists(textureKey)) {
          scene.textures.remove(textureKey);
        }
        scene.textures.addCanvas(textureKey, pieceCanvas);

        const targetX = c * cellW + cellW / 2;
        const targetY = r * cellH + cellH / 2;

        pieces.push({
          id: `${r}_${c}`,
          textureKey,
          row: r,
          col: c,
          targetX,
          targetY,
          width: pWidth,
          height: pHeight,
          padding
        });
      }
    }

    return {
      puzzleId,
      rows,
      cols,
      fullWidth,
      fullHeight,
      pieces,
      ghostTextureKey
    };
  }

  private static drawJigsawEdge(
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    tabDir: number,
    tabSize: number
  ) {
    if (tabDir === 0) {
      ctx.lineTo(x2, y2);
      return;
    }

    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.hypot(dx, dy);

    const ux = dx / length;
    const uy = dy / length;

    const nx = -uy * tabDir;
    const ny = ux * tabDir;

    const p = (distU: number, distN: number) => {
      return {
        x: x1 + ux * distU + nx * distN,
        y: y1 + uy * distU + ny * distN
      };
    };

    const l1 = length * 0.35;
    const l2 = length * 0.40;
    const l3 = length * 0.45;
    const lMid = length * 0.50;
    const l4 = length * 0.55;
    const l5 = length * 0.60;
    const l6 = length * 0.65;

    const hLow = tabSize * 0.2;
    const hHigh = tabSize;

    const pt1 = p(l1, 0);
    const pt2 = p(l2, hLow);
    const pt3 = p(l3, hHigh);
    const ptMid = p(lMid, hHigh * 1.15);
    const pt4 = p(l4, hHigh);
    const pt5 = p(l5, hLow);
    const pt6 = p(l6, 0);

    ctx.lineTo(pt1.x, pt1.y);
    ctx.bezierCurveTo(pt2.x, pt2.y, pt3.x, pt3.y, ptMid.x, ptMid.y);
    ctx.bezierCurveTo(pt4.x, pt4.y, pt5.x, pt5.y, pt6.x, pt6.y);
    ctx.lineTo(x2, y2);
  }
}
