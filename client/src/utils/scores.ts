import { download, generateCsv, mkConfig } from "export-to-csv";

type CsvScore = {
  firstNames: string | null;
  lastNames: string;
  email: string;
  studentId: string;
  assignmentScores: {
    // Key: the name of the assignment
    // Value: the score for that assignment
    [key: string]: number | null;
  };
};

export function downloadScoresToCsv(title: string, scores: CsvScore[]) {
  const csvConfig = mkConfig({
    useKeysAsHeaders: true,
    filename: title,
  });

  const data = scores.map((score) => {
    const { firstNames, lastNames, email, studentId, assignmentScores } = score;
    const formattedScores: Record<string, number | ""> = {};
    for (const [name, score] of Object.entries(assignmentScores)) {
      if (score === null) {
        formattedScores[name] = "";
      } else {
        formattedScores[name] = score;
      }
    }

    return {
      "First name": firstNames,
      "Last name": lastNames,
      Email: email,
      "Student ID": studentId,
      ...formattedScores,
    };
  });

  const csv = generateCsv(csvConfig)(data);
  download(csvConfig)(csv);
}
