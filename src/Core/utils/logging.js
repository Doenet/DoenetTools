export function printDoenetMLrange(doenetMLrange) {
  if (doenetMLrange.lineBegin === undefined) {
    return "";
  } else {
    return `line ${doenetMLrange.lineBegin}, character ${doenetMLrange.charBegin} through line ${doenetMLrange.lineEnd}, character ${doenetMLrange.charEnd}`;
  }
}

export function getLineColumnRange(doenetMLrange, allNewlines) {
  let { indBegin, indEnd } = getBeginEndFromDoenetMLRange(doenetMLrange);

  if (indBegin === undefined) {
    return {};
  }

  let { line: lineBegin, character: charBegin } = findLineColumnInfo(
    indBegin,
    allNewlines,
  );
  let { line: lineEnd, character: charEnd } = findLineColumnInfo(
    indEnd,
    allNewlines,
  );

  return { lineBegin, charBegin, lineEnd, charEnd };
}

function getBeginEndFromDoenetMLRange(doenetMLrange) {
  let indBegin, indEnd;
  if (doenetMLrange) {
    if (doenetMLrange.selfCloseBegin !== undefined) {
      indBegin = doenetMLrange.selfCloseBegin;
      indEnd = doenetMLrange.selfCloseEnd;
    } else if (doenetMLrange.openBegin !== undefined) {
      indBegin = doenetMLrange.openBegin;
      indEnd = doenetMLrange.closeEnd;
    } else if (doenetMLrange.begin !== undefined) {
      indBegin = doenetMLrange.begin;
      indEnd = doenetMLrange.end;
    }
  }

  return { indBegin, indEnd };
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

export function findLineColumnInfo(pos, allNewlines) {
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
    character: pos - allNewlines[allNewlines.length - 1],
  };
}
