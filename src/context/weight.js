import create from "zustand";
import { persist } from "zustand/middleware";

const useWeightState = create(
  persist(
    (set) => ({
      weights: null,  // Ban đầu weights là null
      setWeights: (weights) => {
        console.log("Setting weights:", weights); // Log trước khi set
        set({ weights });
      },
    }),
    {
      name: "weights-storage", // Tên key lưu trữ trong localStorage
    }
  )
);

export default useWeightState;
