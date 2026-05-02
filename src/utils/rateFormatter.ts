export function getMetalDisplay(label: string, metal: "Gold" | "Silver") {
  if (metal === "Gold") {
    const karat = label.replace(/gold/gi, "").trim().replace(/\s+/g, " ");

    return {
      title: karat || label,
      suffix: "GOLD",
    };
  }

  const silverLabel = label
    .replace(/silver/gi, "")
    .trim()
    .replace(/\s+/g, " ");

  return {
    title: "SILVER",
    suffix: silverLabel || "PURE",
  };
}
