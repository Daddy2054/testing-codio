const checkTriangle = (tSide1raw, tSide2raw, tSide3raw) => {
    const tSide1 = Number.parseInt(tSide1raw, 10);
    const tSide2 = Number.parseInt(tSide2raw, 10);
    const tSide3 = Number.parseInt(tSide3raw, 10);
  if ((tSide1 + tSide2) > tSide3 && (tSide1 + tSide3) > tSide2 && (tSide3 + tSide2) > tSide1) {
    return "Triangle exists";
  } else {
    return "Triangle does not exist";
  }
}
module.exports = checkTriangle;
