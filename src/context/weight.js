import create from "zustand";
import { persist } from "zustand/middleware";

const useWeightState = create(
  persist(
    (set) => ({
      weights: null,  
      setWeights: (weights) => {
        console.log("Setting weights:", weights); 
        set({ weights });
      },
    }),
    {
      name: "weights-storage", 
    }
  )
);

export default useWeightState;
