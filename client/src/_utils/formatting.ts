export function formatBytes(bytes: number) {
  const marker = 1024; // Change to 1000 if required
  const decimal = 1; // Change as required
  const kiloBytes = marker;
  const megaBytes = marker * marker;
  const gigaBytes = marker * marker * marker;
  const teraBytes = marker * marker * marker * marker;

  if (bytes < kiloBytes) return bytes + " Bytes";
  else if (bytes < megaBytes)
    return (bytes / kiloBytes).toFixed(decimal) + " KB";
  else if (bytes < gigaBytes)
    return (bytes / megaBytes).toFixed(decimal) + " MB";
  else if (bytes < teraBytes)
    return (bytes / gigaBytes).toFixed(decimal) + " GB";
  else return (bytes / teraBytes).toFixed(decimal) + " TB";
}
