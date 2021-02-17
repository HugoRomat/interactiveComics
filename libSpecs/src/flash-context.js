import React, { useState } from 'react';

export const FlashContext = React.createContext();

export const FlashProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  return (
    <FlashContext.Provider value={{ messages, setMessages }}>
      {children}
    </FlashContext.Provider>
  );
};