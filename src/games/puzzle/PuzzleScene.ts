import Phaser from 'phaser';
import { PuzzleItem } from '../../data/puzzles';
import { PuzzleGenerator } from './PuzzleGenerator';
import { GeneratedPuzzle, PieceData } from './PuzzleConfig';
import { audioManager } from '../../audio/AudioManager';

interface PieceMeta {
  piece: PieceData;
  locked: boolean;
  targetX: number;
  targetY: number;
  homeX: number;
  homeY: number;
}

export class PuzzleScene extends Phaser.Scene {
  private puzzleData?: PuzzleItem;
  private generatedPuzzle?: GeneratedPuzzle;
  private piecesMap: Map<Phaser.GameObjects.Sprite, PieceMeta> = new Map();
  private lockedCount: number = 0;
  private isCompleted: boolean = false;

  constructor() {
    super({ key: 'PuzzleScene' });
  }

  public init(data: { puzzleData?: PuzzleItem }) {
    if (data && data.puzzleData) {
      this.puzzleData = data.puzzleData;
    }
    this.piecesMap.clear();
    this.lockedCount = 0;
    this.isCompleted = false;
  }

  public create() {
    if (!this.puzzleData) {
      return;
    }

    this.loadAndBuild();
  }

  private loadAndBuild() {
    if (!this.puzzleData) return;

    const sourceKey = `source_${this.puzzleData.id}`;
    const bgKey = `bg_${this.puzzleData.background}`;

    const needSource = !this.textures.exists(sourceKey);
    const needBg = !this.textures.exists(bgKey);

    if (needSource || needBg) {
      if (needSource) {
        if (this.puzzleData.image.endsWith('.svg')) {
          this.load.svg(sourceKey, this.puzzleData.image, { width: 500, height: 500 });
        } else {
          this.load.image(sourceKey, this.puzzleData.image);
        }
      }

      if (needBg) {
        if (this.puzzleData.bgImage.endsWith('.svg')) {
          this.load.svg(bgKey, this.puzzleData.bgImage, { width: 800, height: 1200 });
        } else {
          this.load.image(bgKey, this.puzzleData.bgImage);
        }
      }

      this.load.once('complete', () => {
        this.buildPuzzleBoard();
      });

      this.load.start();
    } else {
      this.buildPuzzleBoard();
    }
  }

  private buildPuzzleBoard() {
    if (!this.puzzleData) return;

    const { width, height } = this.scale;
    const isPortrait = height > width;

    // 1. Render Responsive Background
    const bgKey = `bg_${this.puzzleData.background}`;
    if (this.textures.exists(bgKey)) {
      const bg = this.add.image(width / 2, height / 2, bgKey);
      const scaleX = width / bg.width;
      const scaleY = height / bg.height;
      const bgScale = Math.max(scaleX, scaleY);
      bg.setScale(bgScale);
    } else {
      this.cameras.main.setBackgroundColor('#0288D1');
    }

    if (this.puzzleData.background === 'underwater') {
      this.createUnderwaterBubbles(width, height);
    }

    // 2. Generate Larger Puzzle Board (320px - 340px) for high visibility
    const boardTargetWidth = isPortrait
      ? Math.min(width * 0.72, height * 0.40, 320)
      : Math.min(width * 0.46, height * 0.62, 340);

    const sourceKey = `source_${this.puzzleData.id}`;
    this.generatedPuzzle = PuzzleGenerator.generatePuzzle(
      this,
      sourceKey,
      this.puzzleData.id,
      this.puzzleData.rows,
      this.puzzleData.columns,
      boardTargetWidth
    );

    // 3. Render Ghost Puzzle Board in Center
    const boardCenterX = width / 2;
    const boardCenterY = isPortrait ? height * 0.44 : height * 0.50;

    const ghostBoard = this.add.image(boardCenterX, boardCenterY, this.generatedPuzzle.ghostTextureKey);
    ghostBoard.setDepth(10);

    const boardTopLeftX = boardCenterX - this.generatedPuzzle.fullWidth / 2;
    const boardTopLeftY = boardCenterY - this.generatedPuzzle.fullHeight / 2;

    // 4. Calculate Non-Overlapping Perimeter Scatter Positions
    const firstPiece = this.generatedPuzzle.pieces[0];
    const avgPieceW = firstPiece ? firstPiece.width : 120;
    const avgPieceH = firstPiece ? firstPiece.height : 120;

    const scatterPositions = this.calculateNonOverlappingPositions(
      width,
      height,
      boardCenterX,
      boardCenterY,
      this.generatedPuzzle.fullWidth,
      this.generatedPuzzle.fullHeight,
      avgPieceW,
      avgPieceH,
      this.generatedPuzzle.pieces.length
    );

    // Shuffle piece assignment to scatter slots
    const shuffledIndices = Array.from({ length: scatterPositions.length }, (_, i) => i);
    Phaser.Utils.Array.Shuffle(shuffledIndices);

    // 5. Instantiate Draggable Pieces at Non-Overlapping Slots
    this.generatedPuzzle.pieces.forEach((pieceData, index) => {
      const targetWorldX = boardTopLeftX + pieceData.targetX;
      const targetWorldY = boardTopLeftY + pieceData.targetY;

      const slotPos = scatterPositions[shuffledIndices[index]];

      const sprite = this.add.sprite(slotPos.x, slotPos.y, pieceData.textureKey);
      sprite.setDepth(50);
      sprite.setInteractive({ draggable: true, useHandCursor: true });

      if (slotPos.scale && slotPos.scale !== 1.0) {
        sprite.setScale(slotPos.scale);
      }

      this.piecesMap.set(sprite, {
        piece: pieceData,
        locked: false,
        targetX: targetWorldX,
        targetY: targetWorldY,
        homeX: slotPos.x,
        homeY: slotPos.y
      });
    });

    // 6. Setup Drag & Drop Handlers
    this.setupDragEvents();

    // Spoken vocabulary word
    audioManager.speak(this.puzzleData.vocabulary);
  }

  private setupDragEvents() {
    this.input.on('dragstart', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Sprite) => {
      const data = this.piecesMap.get(gameObject);
      if (!data || data.locked) return;

      audioManager.playPickup();

      // Lift piece
      const currentScale = gameObject.scaleX || 1.0;
      gameObject.setScale(currentScale * 1.08);
      gameObject.setDepth(1000);
    });

    this.input.on('drag', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Sprite, dragX: number, dragY: number) => {
      const data = this.piecesMap.get(gameObject);
      if (!data || data.locked) return;

      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.input.on('dragend', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Sprite) => {
      const data = this.piecesMap.get(gameObject);
      if (!data || data.locked) return;

      const dist = Phaser.Math.Distance.Between(gameObject.x, gameObject.y, data.targetX, data.targetY);

      // Magnetic Snap Radius (90 pixels tolerance for 2-year-olds)
      const snapRadius = 90;

      if (dist <= snapRadius) {
        // Correct Placement! Lock & Snap into target slot
        data.locked = true;
        this.lockedCount++;

        this.tweens.add({
          targets: gameObject,
          x: data.targetX,
          y: data.targetY,
          scaleX: 1.0,
          scaleY: 1.0,
          duration: 180,
          ease: 'Back.easeOut',
          onComplete: () => {
            gameObject.setDepth(100);
            gameObject.disableInteractive();
            audioManager.playSnap();
            this.spawnSnapSparkles(data.targetX, data.targetY);

            if (this.generatedPuzzle && this.lockedCount === this.generatedPuzzle.pieces.length && !this.isCompleted) {
              this.handlePuzzleComplete();
            }
          }
        });
      } else {
        // Misplacement / Release away from target:
        // Smoothly animate back to original home slot position!
        this.tweens.add({
          targets: gameObject,
          x: data.homeX,
          y: data.homeY,
          scaleX: 1.0,
          scaleY: 1.0,
          duration: 260,
          ease: 'Quad.easeOut',
          onComplete: () => {
            gameObject.setDepth(50);
          }
        });
      }
    });
  }

  /**
   * Calculates perimeter positions that strictly guarantee ZERO overlap with board or adjacent pieces
   */
  private calculateNonOverlappingPositions(
    screenWidth: number,
    screenHeight: number,
    boardX: number,
    boardY: number,
    boardW: number,
    boardH: number,
    pieceW: number,
    pieceH: number,
    count: number
  ): { x: number; y: number; scale?: number }[] {
    const positions: { x: number; y: number; scale?: number }[] = [];
    const isPortrait = screenHeight > screenWidth;

    const boardTop = boardY - boardH / 2;
    const boardBottom = boardY + boardH / 2;
    const boardLeft = boardX - boardW / 2;
    const boardRight = boardX + boardW / 2;

    const halfPW = pieceW / 2;
    const halfPH = pieceH / 2;
    const gap = 16;

    if (!isPortrait) {
      // LANDSCAPE MODE (e.g. 800x400)
      const leftMarginCenter = Math.max(halfPW + 10, (boardLeft - 10) / 2);
      const rightMarginCenter = Math.min(screenWidth - halfPW - 10, boardRight + (screenWidth - boardRight) / 2);

      let scale = 1.0;
      if (leftMarginCenter - halfPW < 5 || boardLeft - (leftMarginCenter + halfPW) < 5) {
        scale = 0.88;
      }

      const effectivePH = halfPH * 2 * scale;
      const yOffset = effectivePH / 2 + gap / 2;

      if (count === 4) {
        // 4 Pieces: 2 Left, 2 Right
        positions.push(
          { x: leftMarginCenter, y: boardY - yOffset, scale },
          { x: leftMarginCenter, y: boardY + yOffset, scale },
          { x: rightMarginCenter, y: boardY - yOffset, scale },
          { x: rightMarginCenter, y: boardY + yOffset, scale }
        );
      } else {
        // 6 Pieces: 2 Left, 2 Center (Top/Bottom), 2 Right
        const topY = Math.max(effectivePH / 2 + 10, boardTop - effectivePH / 2 - gap);
        const bottomY = Math.min(screenHeight - effectivePH / 2 - 10, boardBottom + effectivePH / 2 + gap);

        positions.push(
          { x: leftMarginCenter, y: boardY - yOffset, scale },
          { x: leftMarginCenter, y: boardY + yOffset, scale },
          { x: boardX, y: topY, scale },
          { x: boardX, y: bottomY, scale },
          { x: rightMarginCenter, y: boardY - yOffset, scale },
          { x: rightMarginCenter, y: boardY + yOffset, scale }
        );
      }
    } else {
      // PORTRAIT MODE (e.g. 390x840)
      let scale = 1.0;
      const topY = Math.max(halfPH + 70, boardTop - halfPH - gap);
      const bottomY = Math.min(screenHeight - halfPH - 60, boardBottom + halfPH + gap);

      if (count === 4) {
        // 4 Pieces: 2 Top, 2 Bottom
        positions.push(
          { x: screenWidth * 0.28, y: topY, scale },
          { x: screenWidth * 0.72, y: topY, scale },
          { x: screenWidth * 0.28, y: bottomY, scale },
          { x: screenWidth * 0.72, y: bottomY, scale }
        );
      } else {
        // 6 Pieces: 3 Top, 3 Bottom
        positions.push(
          { x: screenWidth * 0.20, y: topY, scale: 0.95 },
          { x: screenWidth * 0.50, y: topY, scale: 0.95 },
          { x: screenWidth * 0.80, y: topY, scale: 0.95 },
          { x: screenWidth * 0.20, y: bottomY, scale: 0.95 },
          { x: screenWidth * 0.50, y: bottomY, scale: 0.95 },
          { x: screenWidth * 0.80, y: bottomY, scale: 0.95 }
        );
      }
    }

    return positions;
  }

  private spawnSnapSparkles(x: number, y: number) {
    for (let i = 0; i < 8; i++) {
      const star = this.add.star(x, y, 5, 6, 12, 0xFFEB3B);
      star.setDepth(2000);
      const angle = (Math.PI * 2 * i) / 8;
      const speed = Phaser.Math.Between(40, 90);

      this.tweens.add({
        targets: star,
        x: x + Math.cos(angle) * speed,
        y: y + Math.sin(angle) * speed,
        alpha: 0,
        scale: 0.2,
        duration: 450,
        ease: 'Power2',
        onComplete: () => star.destroy()
      });
    }
  }

  private handlePuzzleComplete() {
    this.isCompleted = true;
    if (!this.puzzleData) return;

    audioManager.playCelebration();
    setTimeout(() => {
      if (this.puzzleData) {
        audioManager.speak(`${this.puzzleData.vocabulary}! Great job!`);
        audioManager.playObjectSound(this.puzzleData.soundEffectName);
      }
    }, 400);

    this.tweens.add({
      targets: Array.from(this.piecesMap.keys()),
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 300,
      yoyo: true,
      repeat: 1,
      ease: 'Sine.easeInOut'
    });

    setTimeout(() => {
      this.game.events.emit('puzzle-complete', this.puzzleData);
    }, 1200);
  }

  private createUnderwaterBubbles(width: number, height: number) {
    for (let i = 0; i < 12; i++) {
      const bubble = this.add.circle(
        Phaser.Math.Between(40, width - 40),
        Phaser.Math.Between(height, height + 400),
        Phaser.Math.Between(6, 18),
        0xFFFFFF,
        0.35
      );
      bubble.setDepth(5);

      this.tweens.add({
        targets: bubble,
        y: -50,
        x: `+=${Phaser.Math.Between(-40, 40)}`,
        duration: Phaser.Math.Between(4000, 8000),
        repeat: -1,
        delay: Phaser.Math.Between(0, 3000),
        ease: 'Linear'
      });
    }
  }
}
