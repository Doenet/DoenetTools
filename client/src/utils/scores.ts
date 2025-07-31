import { download, generateCsv, mkConfig } from "export-to-csv";

type CsvScore = {
  firstNames: string | null;
  lastNames: string;
  email: string | null;
  assignmentName: string;
  score: number;
};

export function downloadScoresToCsv(title: string, scores: CsvScore[]) {
  const csvConfig = mkConfig({
    useKeysAsHeaders: true,
    filename: title,
  });

  const data = scores.map((s) => ({
    "First name": s.firstNames ?? "",
    "Last name": s.lastNames,
    Email: s.email ?? "",
    Assignment: s.assignmentName,
    Score: s.score,
  }));

  const csv = generateCsv(csvConfig)(data);
  download(csvConfig)(csv);
}
