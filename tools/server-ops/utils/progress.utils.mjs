// Progress Bar and Formatting Functions
import { formatBytes, formatSpeed, formatTime } from '../utils/format.utils.mjs';

export function createProgressBar(progress, length = 30) {
  const normalizedProgress = Math.max(0, Math.min(1, progress));
  const filled = Math.max(0, Math.round(normalizedProgress * length));
  const empty = Math.max(0, length - filled);
  return `[${'='.repeat(filled)}${' '.repeat(empty)}]`;
}

export function formatProgressStats({ progress, transferredSize, totalSize, speed, eta, completedParts, totalParts }) {
  const stats = [
    `${createProgressBar(progress)} ${(progress * 100).toFixed(1)}%`,
    `${formatBytes(transferredSize)}/${formatBytes(totalSize)}`,
    `Speed: ${formatSpeed(speed)}`,
    `ETA: ${formatTime(eta)}`,
    `Parts: ${completedParts}/${totalParts}`,
  ];
  return stats.join(' | ');
}
