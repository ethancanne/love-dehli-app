//set up Zustand state for edit menu open and close
import { EditData } from '@/types';
import { UseMutationResult } from '@tanstack/react-query';
import { create } from 'zustand';

interface UIState {
  editViewIsOpen: boolean;
  editData: EditData[];
  editTitle: string;
  editMutateFn: (() => UseMutationResult<any>) | undefined;
  editDataId: string;
  setEditMutateFn: (fn: () => UseMutationResult<any>) => void;
  setEditTitle: (title: string) => void;
  setEditDataId: (id: string) => void;
  setEditData: (data: (EditData | undefined)[]) => void;
  openEditView: () => void;
  closeEditView: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  editViewIsOpen: false,
  editData: [],
  editTitle: '',
  editDataId: '',
  editMutateFn: undefined,
  setEditTitle: (title: string) => set({ editTitle: title }),
  setEditMutateFn: (fn: () => UseMutationResult) => set({ editMutateFn: fn }),
  setEditData: (data: any) => set({ editData: data }),
  setEditDataId: (id: string) => set({ editDataId: id }),
  openEditView: () => set({ editViewIsOpen: true }),
  closeEditView: () => set({ editViewIsOpen: false }),
}));
