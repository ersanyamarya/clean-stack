export const formatBytes = (bytes: number) => {
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 B';
  const i = parseInt(String(Math.floor(Math.log(bytes) / Math.log(1024))));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
};
export const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${hours}h ${minutes}m ${secs}s`;
};

export const createProgressBarWithLabel = (label: string, progress: number, total = 100) => {
  const filledLength = Math.round((total * progress) / total);
  const emptyLength = total - filledLength;
  const filledBar = '█'.repeat(filledLength);
  const emptyBar = '░'.repeat(emptyLength);
  const percentage = ((progress / total) * 100).toFixed(2);

  return `${label}: [${filledBar}${emptyBar}] ${percentage}%`;
};

export const formatProgressStats = (label: string, progress: number, completedSize: number, totalSize: number, speed: number, eta: number) => {
  const progressBar = createProgressBarWithLabel(label, progress);
  const formattedSpeed = formatBytes(speed);
  const formattedEta = formatTime(eta);

  return `${progressBar} | Completed: ${formatBytes(completedSize)} / ${formatBytes(totalSize)} | Speed: ${formattedSpeed}/s | ETA: ${formattedEta}`;
};
