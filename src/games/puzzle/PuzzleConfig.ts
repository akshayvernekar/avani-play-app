export interface PieceData {
  id: string;
  textureKey: string;
  row: number;
  col: number;
  targetX: number;
  targetY: number;
  width: number;
  height: number;
  padding: number;
}

export interface GeneratedPuzzle {
  puzzleId: string;
  rows: number;
  cols: number;
  fullWidth: number;
  fullHeight: number;
  pieces: PieceData[];
  ghostTextureKey: string;
}
