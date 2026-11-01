import { useContext } from 'react';
import UniversityContext from '../context/UniversityContext';

export function useUniversity() {
  const context = useContext(UniversityContext);
  if (!context) {
    throw new Error('useUniversity must be used within a UniversityProvider');
  }
  return context;
}

export default useUniversity;
