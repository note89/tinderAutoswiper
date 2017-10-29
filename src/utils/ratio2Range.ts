export const ratio2Range = (ratioStart: number) => (ratioEnd: number) => (
  ratio: number
) => Math.floor(ratioStart + ratio * (ratioEnd - ratioStart));
