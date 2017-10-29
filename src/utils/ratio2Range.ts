export const ratio2Range = (ratioStart: number) => (ratioEnd: number) => (
  ratio: number
) => Math.floor(ratioEnd * (1 - ratio) + ratioStart * ratio);
