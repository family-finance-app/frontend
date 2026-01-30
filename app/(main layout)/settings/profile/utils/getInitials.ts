export function getInitials(name?: string, email?: string) {
  if (name) {
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    const first = words[0].charAt(0).toUpperCase();
    const last = words[words.length - 1].charAt(0).toUpperCase();
    return first + last;
  }

  if (email) {
    return email.charAt(0).toUpperCase();
  }

  return '';
}

export function displayName(name: string) {
  const parts = name.trim().split(/\s+/) ?? [];
  if (parts.length <= 1) {
    return name;
  }
  const firstName = parts[0];
  const lastInitial = parts[parts.length - 1]?.[0] ?? '';
  return `${firstName} ${lastInitial}.`;
}
