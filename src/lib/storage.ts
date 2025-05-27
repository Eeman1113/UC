
export interface JournalEntry {
  date: string;
  mood: number;
  symptoms: number;
  notes?: string;
}

export interface JournalData {
  entries: Record<string, JournalEntry>;
  streak: number;
}

const STORAGE_KEY = 'wellness-journal-data';

export const getJournalData = (): JournalData => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading from localStorage:', error);
  }
  
  return {
    entries: {},
    streak: 0
  };
};

export const saveJournalData = (data: JournalData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const getTodayEntry = (): JournalEntry | null => {
  const data = getJournalData();
  const today = new Date().toISOString().split('T')[0];
  return data.entries[today] || null;
};

export const saveEntry = (entry: JournalEntry): void => {
  const data = getJournalData();
  const today = new Date().toISOString().split('T')[0];
  
  // If this is a new entry for today, increment streak
  if (!data.entries[today]) {
    data.streak += 1;
  }
  
  data.entries[today] = { ...entry, date: today };
  saveJournalData(data);
};

export const getEntriesForMonth = (year: number, month: number): Record<string, JournalEntry> => {
  const data = getJournalData();
  const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
  
  return Object.fromEntries(
    Object.entries(data.entries).filter(([date]) => date.startsWith(monthStr))
  );
};
