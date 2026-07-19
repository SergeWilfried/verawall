import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

const TitleSetterContext = createContext<((title: string) => void) | null>(null);
const TitleValueContext = createContext<string>('Overview');

export function ConsoleTitleProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState('Overview');
  return (
    <TitleSetterContext.Provider value={setTitle}>
      <TitleValueContext.Provider value={title}>{children}</TitleValueContext.Provider>
    </TitleSetterContext.Provider>
  );
}

export function useConsoleTitleValue() {
  return useContext(TitleValueContext);
}

export function useConsoleTitle(title: string) {
  const setTitle = useContext(TitleSetterContext);
  useEffect(() => {
    setTitle?.(title);
  }, [setTitle, title]);
}
