export const generateRandomId = (randomLength: number = 8): string => {
  const randomLetters = Array.from({ length: randomLength }, () => {
    const randomChar = Math.floor(Math.random() * 52);
    return randomChar < 26 ? String.fromCharCode(65 + randomChar) : String.fromCharCode(97 + randomChar - 26);
  }).join("");
  return randomLetters;
};

export const cleanString = (inputString: string): string => {
  const cleanedString = inputString.replace(/[^a-zA-Z0-9\s]/g, "");
  return cleanedString;
};
