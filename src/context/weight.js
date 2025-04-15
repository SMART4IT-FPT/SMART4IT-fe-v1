import create from "zustand";
import { persist } from "zustand/middleware";

const useWeightState = create((set) => ({
    weights: null,  // Ban đầu weights là null
    setWeights: (weights) => {
      console.log("Setting weights:", weights); // Log trước khi set
      set({ weights });
    },
  }));
  
  export default useWeightState;
  