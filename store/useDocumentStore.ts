import { create } from "zustand";

export type DocumentItem = {
  id: string;
  title: string;
};

export const useDocumentStore = create<{
  documents: DocumentItem[];
  setDocuments: (documents: DocumentItem[]) => void;
}>((set) => ({
  documents: [],
  setDocuments(documents) {
    set({ documents });
  },
}));
