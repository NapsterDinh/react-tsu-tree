export const formatTime = (seconds: number) => {
  const h = seconds / 3600;
  const min = (seconds - h * 3600) / 60;
  const s = seconds - min * 60 - h * 3600;

  const secondFormat = s / 10 < 1 ? `0${s}` : `${s}`;
  const minFormat = min / 10 < 1 ? `0${min}` : `${min}`;
  const hoursFormat = h / 10 < 1 ? `0${h}` : `${h}`;

  if (h === 0 && min === 0) {
    return `00:${secondFormat}`;
  } else if (h === 0 && min !== 0) {
    return `${minFormat}:${secondFormat}`;
  } else {
    return `${hoursFormat}:${minFormat}:${secondFormat}`;
  }
};
