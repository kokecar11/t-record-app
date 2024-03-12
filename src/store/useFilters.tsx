import { type StatusMarker } from '@prisma/client'
import { startOfToday } from 'date-fns'
import create from 'zustand'

type Filters = {
    filters: {
        status: StatusMarker | undefined, 
        selectDayStream: Date
    };
    setFilters: (date:Date) => void;
    setDate: (date:Date | undefined) => void;
    setStatus: (status:StatusMarker | undefined) => void;
};

const useFilters = create<Filters>((set) => ({
    filters: {status: undefined, selectDayStream: startOfToday()},
    setFilters: () => set((state) => ({ filters: state.filters })),
    setDate: (date) => set((state) => ({ filters: {...state.filters, selectDayStream: date ? date : startOfToday()}})),
    setStatus: (status) => set((state) => ({ filters: {...state.filters, status: status ? status : undefined}})),
}));

export default useFilters;

