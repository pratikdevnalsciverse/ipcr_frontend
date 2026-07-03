import React, { createContext, useReducer, ReactNode } from "react";

export interface Sample {
  well_number: number;
  sample_id: string;
  patient_id: string;
}

export interface ExperimentDataState {
  ExperimentID: string;
  CartridgeId: string;
  SampleType: string;
  ExperimentDisease: string;
  ExperimentProtocol: string;
  ExperimentIsRunning: boolean;
  ExperimentPcrPercentage: number;
  EstimatedTime: number;
  Samples: Sample[];
}

export type ExperimentDataAction =
  | { type: "Experiment1Started" }
  | { type: "Experiment1Completed" }
  | { type: "set_CartridgeId"; payload: string }
  | { type: "set_SampleType"; payload: string }
  | { type: "set_Samples"; payload: Partial<Sample> & { well_number: number } }
  | { type: "RESET" };

const initialState: ExperimentDataState = {
  ExperimentID: "",
  CartridgeId: "",
  SampleType: "",
  ExperimentDisease: "",
  ExperimentProtocol: "",
  ExperimentIsRunning: false,
  ExperimentPcrPercentage: 0,
  EstimatedTime: 1200,
  Samples: Array.from({ length: 16 }, (_, i) => ({
    well_number: i + 1,
    sample_id: "",
    patient_id: "",
  })),
};

function updateWell(array: Sample[], obj: Partial<Sample> & { well_number: number }) {
  return array.map((item) =>
    item.well_number === obj.well_number ? { ...item, ...obj } : item
  );
}

const reducer = (state: ExperimentDataState, action: ExperimentDataAction): ExperimentDataState => {
  switch (action.type) {
    case "Experiment1Started":
      return state;
    case "Experiment1Completed":
      return state;
    case "set_CartridgeId":
      return { ...state, CartridgeId: action.payload };
    case "set_SampleType":
      return { ...state, SampleType: action.payload };
    case "set_Samples":
      return { ...state, Samples: updateWell(state.Samples, action.payload) };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

export const ExperimentDataContext = createContext<{
  ExperimentData: ExperimentDataState;
  dispatchExperimentData: React.Dispatch<ExperimentDataAction>;
}>({
  ExperimentData: initialState,
  dispatchExperimentData: () => {},
});

export const ExperimentDataContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [ExperimentData, dispatchExperimentData] = useReducer(reducer, initialState);

  return (
    <ExperimentDataContext.Provider value={{ ExperimentData, dispatchExperimentData }}>
      {children}
    </ExperimentDataContext.Provider>
  );
};
