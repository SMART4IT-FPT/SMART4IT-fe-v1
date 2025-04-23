import {create} from "zustand";
import { persist } from "zustand/middleware";

const useWeightState = create(
  persist(
    (set) => ({
      weights: null,
      llmName: null, // ✅ thêm field mới
      setWeights: (weights) => {
        console.log("Setting weights:", weights);
        set({ weights });
      },
      setLlmName: (llmName) => {
        console.log("Setting llmName:", llmName);
        set({ llmName });
      },
    }),
    {
      name: "weights-storage",
    }
  )
);

export default useWeightState;
