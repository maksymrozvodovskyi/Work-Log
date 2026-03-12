export function formatUserName(fullName: string) {
  const parts = fullName.split(" ");

  const firstName = parts[0];
  const lastName = parts[1];

  const firstLetter = firstName[0].toUpperCase();
  const lastLetter = lastName[0].toUpperCase();

  return `${firstLetter}${lastLetter}`;
}

export function formatTimelineBarName(fullName: string) {
  const [firstName = "", lastName = ""] = fullName.trim().split(/\s+/);

  if (!firstName) {
    return "";
  }

  if (!lastName) {
    return firstName;
  }

  return `${firstName.charAt(0).toUpperCase()}. ${lastName}`;
}
