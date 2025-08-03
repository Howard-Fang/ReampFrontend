import { createContext, useContext, useState } from 'react';

const MediaSelectionContext = createContext();

export const MediaSelectionProvider = ({ children }) => {
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [selectedPlans, setSelectedPlans] = useState([]);

  return (
    <MediaSelectionContext.Provider value={{
      selectedPhotos,
      setSelectedPhotos,
      selectedVideos,
      setSelectedVideos,
      selectedPlans,
      setSelectedPlans
    }}>
      {children}
    </MediaSelectionContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useMediaSelection = () => useContext(MediaSelectionContext);
