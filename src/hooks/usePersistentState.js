// AI-assisted: see docs/AI_LOG.md #2 se le solicita a la IA que busque el error en el código y lo corrija. Se le pide que no cambie la estructura del código, solo que corrija el error.

import { useState, useEffect, useCallback } from 'react';
import { getData, saveData } from '../services/asyncStorage';


export default function usePersistentState(key, initialValue) {
  const [value, setValue] = useState(initialValue);
  const [ready, setReady] = useState(false);


  useEffect(() => {
    let active = true; 

    getData(key)
      .then((stored) => {
        if (active && stored !== null) {
          setValue(stored); 
        }
      })
      .finally(() => {
        if (active) {
          setReady(true);
        }
      });


    return () => {
      active = false;
    };
  }, [key]);


  const update = useCallback(
    async (newValue) => {
      setValue(newValue);
      await saveData(key, newValue);
    },
    [key]
  );

  return { value, update, ready };
}