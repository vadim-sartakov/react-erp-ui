function intersectRect(a, b) {
  return (a.left <= b.right &&
      b.left <= a.right &&
      a.top <= b.bottom &&
      b.top <= a.bottom)
}

export default intersectRect;