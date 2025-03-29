//set up Zustand state for edit menu open and close
import { EditData } from '@/types';
import { UseMutationResult } from '@tanstack/react-query';
import { create } from 'zustand';

interface UIState {
  editViewOptions: {
    editViewIsOpen?: boolean;
    editData?: EditData[];
    editTitle?: string;
    editMutateFn?: () => UseMutationResult<any>;
    editDataId?: string;
  };
  setEditViewOptions: (editViewOptions: {
    editViewIsOpen?: boolean;
    editData?: EditData[];
    editTitle?: string;
    editMutateFn?: () => UseMutationResult<any>;
    editDataId?: string;
  }) => void;

  search: string;
  setSearch: (search: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  editViewOptions: {
    editViewIsOpen: false,
    editData: [],
    editTitle: '',
    editMutateFn: undefined,
    editDataId: '',
  },

  search: '',

  setEditViewOptions: (editViewOptions) =>
    set({ editViewOptions: { ...editViewOptions } }),

  setSearch: (search) => set({ search }),
}));
