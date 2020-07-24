export const getDateRange = (tStart, tEnd) => {
  // find out if start date is within forecast range
  let start = Date.parse(tStart)
  let end = Date.parse(tEnd)
  const newD = new Date()
  const now = Date.parse(newD)
  const day = 86400000
  const last = day*15
  let diff = now + last

  // if start date is outside range, set start to previous year
  if (start > diff) {
    let year = day*366
    let y5 = day*365
    let dates = start - year
    dates = new Date(dates)
    let isos = dates.toISOString().substr(0,10)
    let datee = start - y5
    datee = new Date(datee)
    let isoe = datee.toISOString().substr(0,10)
    let range = {
      isos: isos,
      isoe: isoe
    }
    return range

  // if start date is within range, set start/end range offset
  } else {
    const sDiff = start - now
    let sOffset = Math.trunc(sDiff / day) + 1
    let eDiff = end - now
    let eOffset = Math.trunc(eDiff / day) + 1
    if (sOffset > 15) { sOffset= false }
    let range = {
      sOffset: sOffset,
      eOffset: eOffset
    }
    return range
  }
}
