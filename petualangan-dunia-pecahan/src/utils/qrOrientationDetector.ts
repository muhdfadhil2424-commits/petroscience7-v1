import { InteractiveCardOrientation, ScanDetectionResult } from '../types/interactiveClass';

export interface Point2D {
  x: number;
  y: number;
}

export interface QRLocation {
  topLeftFinderPattern: Point2D;
  topRightFinderPattern: Point2D;
  bottomLeftFinderPattern: Point2D;
  topLeftCorner?: Point2D;
  topRightCorner?: Point2D;
  bottomRightCorner?: Point2D;
  bottomLeftCorner?: Point2D;
}

export interface OrientationAnalysis {
  orientation: InteractiveCardOrientation;
  angleDeg: number;
  directionLabel: string;
  arrowIcon: string;
  confidence: number;
}

/**
 * Calculates card answer orientation based on QR finder patterns.
 * 
 * Physical Card Structure:
 * - Top edge: ⬆️ A
 * - Right edge: ➡️ B
 * - Bottom edge: ⬇️ C
 * - Left edge: ⬅️ D
 * 
 * When student rotates the card so their chosen letter points UP (towards ceiling/camera top):
 * - If A is at top (unrotated): V_TR points Right (~0°) -> A
 * - If B is at top (rotated 90° CCW): V_TR points Up (~-90°) -> B
 * - If C is at top (upside down 180°): V_TR points Left (~180° / -180°) -> C
 * - If D is at top (rotated 90° CW): V_TR points Down (~+90°) -> D
 */
export function calculateQROrientation(
  location: QRLocation,
  isMirrored = false
): OrientationAnalysis {
  const tl = location.topLeftFinderPattern;
  const tr = location.topRightFinderPattern;

  let dx = tr.x - tl.x;
  let dy = tr.y - tl.y;

  // Mirror adjustment if user has horizontal camera flip active
  if (isMirrored) {
    dx = -dx;
  }

  // atan2 returns angle in radians (-PI to +PI)
  let angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;

  let orientation: InteractiveCardOrientation;
  let directionLabel: string;
  let arrowIcon: string;

  // Angular ranges with 45° thresholds
  if (angleDeg >= -45 && angleDeg <= 45) {
    orientation = 'A';
    directionLabel = 'A (Atas)';
    arrowIcon = '⬆️';
  } else if (angleDeg > -135 && angleDeg < -45) {
    orientation = 'B';
    directionLabel = 'B (Kanan)';
    arrowIcon = '➡️';
  } else if (angleDeg >= 45 && angleDeg <= 135) {
    orientation = 'D';
    directionLabel = 'D (Kiri)';
    arrowIcon = '⬅️';
  } else {
    // angleDeg > 135 or angleDeg < -135
    orientation = 'C';
    directionLabel = 'C (Bawah)';
    arrowIcon = '⬇️';
  }

  // Calculate distance between finder patterns for scale / confidence
  const dist = Math.sqrt(dx * dx + dy * dy);
  const confidence = Math.min(100, Math.max(30, Math.round((dist / 60) * 100)));

  return {
    orientation,
    angleDeg: Math.round(angleDeg * 10) / 10,
    directionLabel,
    arrowIcon,
    confidence,
  };
}

/**
 * Calculates bounding box from 4 corner points
 */
export function getQRBoundingBox(location: QRLocation): {
  x: number;
  y: number;
  width: number;
  height: number;
} {
  const pts = [
    location.topLeftCorner || location.topLeftFinderPattern,
    location.topRightCorner || location.topRightFinderPattern,
    location.bottomLeftCorner || location.bottomLeftFinderPattern,
    location.bottomRightCorner || location.topRightFinderPattern,
  ];

  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  return {
    x: Math.round(minX),
    y: Math.round(minY),
    width: Math.round(maxX - minX),
    height: Math.round(maxY - minY),
  };
}
