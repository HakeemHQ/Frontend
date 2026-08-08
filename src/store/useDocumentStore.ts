export const useDocumentStore = {
  documents: [],
  setDocuments(documents: unknown[]) {
    this.documents = documents;
  },
};
