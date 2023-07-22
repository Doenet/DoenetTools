export function printDoenetMLrange(doenetMLrange) {
  if (doenetMLrange.lineBegin === undefined) {
    return "";
  } else {
    return `line ${doenetMLrange.lineBegin}, character ${doenetMLrange.charBegin} through line ${doenetMLrange.lineEnd}, character ${doenetMLrange.charEnd}`;
  }
}

export function getLineCharRange(doenetMLrange, allNewlines) {
  let { begin, end } = getBeginEndFromDoenetMLRange(doenetMLrange);

  if (begin === undefined) {
    return {};
  }

  let { line: lineBegin, character: charBegin } = findLineCharInfo(
    begin,
    allNewlines,
  );
  let { line: lineEnd, character: charEnd } = findLineCharInfo(
    end,
    allNewlines,
  );

  return { lineBegin, charBegin, lineEnd, charEnd };
}

function getBeginEndFromDoenetMLRange(doenetMLrange) {
  let begin, end;
  if (doenetMLrange) {
    if (doenetMLrange.begin !== undefined) {
      begin = doenetMLrange.begin;
      end = doenetMLrange.end;
    } else if (doenetMLrange.selfCloseBegin !== undefined) {
      begin = doenetMLrange.selfCloseBegin;
      end = doenetMLrange.selfCloseEnd;
    } else if (doenetMLrange.openBegin !== undefined) {
      begin = doenetMLrange.openBegin;
      end = doenetMLrange.closeEnd;
    }
    doenetMLrange.begin = begin;
    doenetMLrange.end = end;
  }

  return { begin, end };
}

export function findAllNewlines(inText) {
  let allNewlines = [];
  for (let i = 0; i < inText.length; i++) {
    if (inText[i] == "\n") {
      allNewlines.push(i + 1);
    }
  }
  return allNewlines;
}

function findLineCharInfo(pos, allNewlines) {
  for (let i = 0; i < allNewlines.length; i++) {
    if (pos <= allNewlines[i]) {
      if (i === 0) {
        return { line: 1, character: pos };
      } else {
        return { line: i + 1, character: pos - allNewlines[i - 1] };
      }
    }
  }
  return {
    line: allNewlines.length + 1,
    character: pos - (allNewlines[allNewlines.length - 1] || 0),
  };
}
