"use client";

import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  Tick02Icon, 
  Cancel01Icon, 
  Edit02Icon, 
  ArrowRight01Icon, 
  File01Icon,
  Delete02Icon,
  Alert02Icon
} from "@hugeicons/core-free-icons";
import { getDocumentContent, getDocumentExtractedFields } from "@/lib/api/documents";
import { usePatientDocumentsStore } from "@/store/usePatientDocumentsStore";
import { DocumentExtractedData, ExtractedField, ExtractedItem, ReviewFieldPayload, ReviewItemPayload } from "@/types/document";
import { Toast } from "@/components/ui/Toast";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@/components/ui/Input";

export default function DocumentReviewPage({ params }: { params: Promise<{ code: string, documentId: string }> }) {
  const router = useRouter();
  const { code, documentId } = use(params);
  const { reviewExtractedItem, confirmExtractedData, deleteDocument } = usePatientDocumentsStore();
  
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<DocumentExtractedData | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isExtracting, setIsExtracting] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [toastMessage, setToastMessage] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Field states for editing
  // Keyed by field ID
  const [fieldDecisions, setFieldDecisions] = useState<Record<string, "approved" | "rejected" | "corrected">>({});
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  
  const [savingItems, setSavingItems] = useState<Record<string, boolean>>({});
  const [savedItems, setSavedItems] = useState<Record<string, boolean>>({});

  // Initialize and update state from fetched extractedData
  useEffect(() => {
    let url: string | null = null;
    
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        const blob = await getDocumentContent(documentId);
        setFileType(blob.type);
        url = URL.createObjectURL(blob);
        setBlobUrl(url);
      } catch (err) {
        console.error("Failed to load document content", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    const fetchExtracted = async () => {
      try {
        setIsExtracting(true);
        const res = await getDocumentExtractedFields(documentId);
        const data = ('success' in res && 'data' in res) ? res.data : res;
        const typedData = data as unknown as DocumentExtractedData;
        setExtractedData(typedData);
        
        // Initialize state
        const initialDecisions: Record<string, "approved" | "rejected" | "corrected"> = {};
        const initialValues: Record<string, string> = {};
        const initialSavedItems: Record<string, boolean> = {};
        
        if (typedData?.items) {
          typedData.items.forEach(item => {
            const isItemAlreadyReviewed = item.reviewStatus && ['reviewed', 'confirmed', 'approved'].includes(item.reviewStatus.toLowerCase());
            if (isItemAlreadyReviewed) {
              initialSavedItems[item.extractedItemId] = true;
            }

            item.fields.forEach(field => {
              initialDecisions[field.extractedFieldId] = "approved";
              initialValues[field.extractedFieldId] = field.correctedValue || field.extractedValue || "";
            });
          });
        }
        
        setFieldDecisions(initialDecisions);
        setFieldValues(initialValues);
        setSavedItems(initialSavedItems);
        
        const isDocReviewed = typedData?.reviewStatus && ['reviewed', 'confirmed', 'approved'].includes(typedData.reviewStatus.toLowerCase());
        const areAllItemsReviewed = typedData?.items && typedData.items.length > 0 && typedData.items.every(it => it.reviewStatus && ['reviewed', 'confirmed', 'approved'].includes(it.reviewStatus.toLowerCase()));

        if (isDocReviewed || areAllItemsReviewed) {
          setIsConfirmed(true);
        }
        
      } catch (err) {
        console.error("Failed to load extracted data", err);
      } finally {
        setIsExtracting(false);
      }
    };

    if (documentId) {
      fetchContent();
      fetchExtracted();
    }
    
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [documentId]);

  const markFieldUnsaved = (fieldId: string) => {
    if (!extractedData?.items) return;
    for (const item of extractedData.items) {
      if (item.fields.some(f => f.extractedFieldId === fieldId)) {
        if (savedItems[item.extractedItemId]) {
          setSavedItems(prev => ({ ...prev, [item.extractedItemId]: false }));
        }
        break;
      }
    }
  };

  const handleDecisionChange = (fieldId: string, decision: "approved" | "rejected" | "corrected") => {
    setFieldDecisions(prev => ({ ...prev, [fieldId]: decision }));
    markFieldUnsaved(fieldId);
  };

  const handleValueChange = (fieldId: string, value: string) => {
    setFieldValues(prev => ({ ...prev, [fieldId]: value }));
    setFieldDecisions(prev => ({ ...prev, [fieldId]: "corrected" }));
    markFieldUnsaved(fieldId);
  };

  const handleSaveItem = async (item: ExtractedItem) => {
    setSavingItems(prev => ({ ...prev, [item.extractedItemId]: true }));
    
    const fieldsPayload: ReviewFieldPayload[] = item.fields.map(field => {
      const decision = fieldDecisions[field.extractedFieldId] || "approved";
      
      let csharpDecision = "Approved";
      if (decision === "corrected") csharpDecision = "Corrected";
      if (decision === "rejected") csharpDecision = "Rejected";

      return {
        extractedFieldId: field.extractedFieldId,
        decision: csharpDecision as any,
        correctedValue: decision === "corrected" ? fieldValues[field.extractedFieldId] : undefined
      };
    });

    const payload: ReviewItemPayload = {
      extractedItemId: item.extractedItemId,
      fields: fieldsPayload
    };

    try {
      const success = await reviewExtractedItem(item.extractedItemId, payload);
      
      if (success !== false) {
        setToastMessage({ message: `Successfully saved ${item.itemType} review!`, type: "success" });
        setSavedItems(prev => ({ ...prev, [item.extractedItemId]: true }));
      } else {
        setToastMessage({ message: `Failed to save ${item.itemType} review.`, type: "error" });
      }
    } catch (e: any) {
      setToastMessage({ message: e?.response?.data?.message || `Failed to save ${item.itemType} review.`, type: "error" });
    }
    
    setSavingItems(prev => ({ ...prev, [item.extractedItemId]: false }));
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    const success = await deleteDocument(documentId);
    if (success) {
      router.push(`/doctor/patients/workspace/${code}/documents`);
    } else {
      setToastMessage({ message: "Failed to delete the document.", type: "error" });
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const handleConfirmAll = async () => {
    setIsConfirming(true);
    
    try {
      // Auto-save any items that haven't been explicitly saved yet
      if (extractedData?.items) {
        const unsavedItems = extractedData.items.filter(item => !savedItems[item.extractedItemId]);
        if (unsavedItems.length > 0) {
          for (const item of unsavedItems) {
            await handleSaveItem(item);
          }
        }
      }

      const response = await confirmExtractedData(documentId);
      if (response !== false) {
        const newlyConfirmed = response?.confirmedItemCount ?? 0;
        const alreadyConfirmed = response?.skippedAlreadyConfirmedItemCount ?? 0;
        const totalItems = extractedData?.items?.length || (newlyConfirmed + alreadyConfirmed);

        let msg = "All extracted items have been confirmed!";
        if (newlyConfirmed > 0 && alreadyConfirmed > 0) {
          msg = `Confirmed ${newlyConfirmed} item(s) (${alreadyConfirmed} were already confirmed).`;
        } else if (newlyConfirmed > 0) {
          msg = `Successfully confirmed ${newlyConfirmed} extracted item(s)!`;
        } else if (alreadyConfirmed > 0 || totalItems > 0) {
          msg = `All ${totalItems} extracted item(s) are already confirmed.`;
        }

        setToastMessage({ message: msg, type: "success" });
        setIsConfirmed(true);
        
        // Mark all items as saved
        if (extractedData?.items) {
          const allSaved: Record<string, boolean> = {};
          extractedData.items.forEach(it => { allSaved[it.extractedItemId] = true; });
          setSavedItems(allSaved);
        }
      } else {
        setToastMessage({ message: "Failed to confirm extracted data.", type: "error" });
      }
    } catch (e: any) {
      setToastMessage({ message: e?.response?.data?.message || "Failed to confirm extracted data.", type: "error" });
    } finally {
      setIsConfirming(false);
    }
  };

  const handleFinishReview = () => {
    router.push(`/doctor/patients/workspace/${code}/documents`);
  };

  const allItemsSaved = extractedData?.items && extractedData.items.length > 0 && extractedData.items.every(it => savedItems[it.extractedItemId]);

  return (
    <div className="max-w-[1400px] mx-auto pt-4 pb-12 animate-in fade-in duration-300 relative">
      <AnimatePresence>
        {toastMessage && (
          <Toast 
            message={toastMessage.message} 
            type={toastMessage.type} 
            onClose={() => setToastMessage(null)} 
          />
        )}

        {isDeleteModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
              onClick={() => !isDeleting && setIsDeleteModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden"
            >
              <div className="p-6 md:p-8 text-center">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <HugeiconsIcon icon={Alert02Icon} className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 font-heading">Delete Document?</h3>
                <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                  Are you sure you want to delete this document? This action cannot be undone and you will lose access to this file permanently.
                </p>
                <div className="flex items-center gap-3 w-full">
                  <Button
                    variant="outline"
                    className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold disabled:opacity-50"
                    onClick={() => setIsDeleteModalOpen(false)}
                    disabled={isDeleting}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold disabled:opacity-50"
                    onClick={confirmDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Deleting...</span>
                      </div>
                    ) : (
                      "Yes, Delete"
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-heading">Data Extraction Review</h1>
          <p className="text-slate-500">Please review the AI-extracted fields against the original document.</p>
        </div>
        
        <div className="flex items-center gap-3 flex-wrap">
          <Button 
            variant="outline" 
            className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-semibold flex items-center gap-2 disabled:opacity-50"
            onClick={handleDelete}
            disabled={isLoading || isDeleting}
          >
            {isDeleting ? (
              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <HugeiconsIcon icon={Delete02Icon} className="w-4 h-4" />
            )}
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>

          {!isConfirmed && !allItemsSaved ? (
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
              onClick={handleConfirmAll}
              disabled={isConfirming}
            >
              {isConfirming ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Confirming All...
                </>
              ) : (
                <>
                  <HugeiconsIcon icon={Tick02Icon} className="w-4 h-4" />
                  Confirm All Items
                </>
              )}
            </Button>
          ) : (
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl font-bold border border-emerald-200 shadow-sm">
              <HugeiconsIcon icon={Tick02Icon} className="w-4 h-4" />
              All Items Confirmed
            </div>
          )}

          <Button 
            onClick={handleFinishReview}
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold flex items-center gap-2 shadow-sm"
          >
            Finish Review
            <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Left Side: Document Preview */}
        <div className="border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden flex flex-col lg:sticky lg:top-6 h-[600px] lg:h-[800px]">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-700">Document Evidence</h3>
            {fileType && <span className="text-xs text-slate-400 font-mono uppercase">{fileType.split('/')[1] || fileType}</span>}
          </div>
          
          <div className="flex-1 bg-slate-100/50 flex items-center justify-center relative overflow-hidden">
            {isLoading ? (
              <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            ) : blobUrl ? (
              fileType?.includes("pdf") ? (
                <iframe src={blobUrl} className="w-full h-full border-0" title="Document Preview" />
              ) : fileType?.includes("image") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={blobUrl} alt="Preview" className="max-w-full max-h-full object-contain p-4" />
              ) : (
                <div className="text-center text-slate-500 p-8">
                  <HugeiconsIcon icon={File01Icon} className="w-12 h-12 mx-auto mb-2 text-slate-400" />
                  <p>Document type cannot be previewed.</p>
                </div>
              )
            ) : (
              <p className="text-slate-500">Failed to load preview.</p>
            )}
          </div>
        </div>

        {/* Right Side: Interactive Forms */}
        <div className="space-y-6">
          {isExtracting ? (
            <div className="border border-slate-200 rounded-2xl bg-white p-12 text-center shadow-sm">
              <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-500 font-medium">Loading extracted data...</p>
            </div>
          ) : extractedData?.items && extractedData.items.length > 0 ? (
            extractedData.items.map((item, itemIdx) => {
              const isItemSaved = isConfirmed || !!savedItems[item.extractedItemId];

              return (
                <div 
                  key={item.extractedItemId || itemIdx} 
                  className={`border rounded-2xl bg-white shadow-sm overflow-hidden transition-all duration-300 ${
                    isItemSaved 
                      ? 'border-emerald-200 bg-emerald-50/10 shadow-emerald-50' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  
                  {/* Item Header */}
                  <div className={`px-6 py-4 border-b flex items-center justify-between transition-colors ${
                    isItemSaved ? 'bg-emerald-50/60 border-emerald-100' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-center gap-3">
                      <h2 className="text-base font-bold text-slate-900 font-heading uppercase">
                        {item.itemType} <span className="text-slate-400 text-sm font-normal normal-case">(Item {item.sequenceNumber || itemIdx + 1})</span>
                      </h2>
                    </div>
                    {isItemSaved ? (
                      <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xs">
                        <HugeiconsIcon icon={Tick02Icon} className="w-3.5 h-3.5" />
                        Approved & Saved
                      </div>
                    ) : (
                      <div className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">
                        Pending Review
                      </div>
                    )}
                  </div>
                  
                  {/* Fields List */}
                  <div className="p-6 space-y-5">
                    {item.fields.map(field => {
                      const decision = fieldDecisions[field.extractedFieldId] || "approved";
                      const val = fieldValues[field.extractedFieldId] || "";
                      
                      const isRejected = decision === "rejected";
                      const isCorrected = decision === "corrected";
                      const isApproved = decision === "approved";

                      return (
                        <div 
                          key={field.extractedFieldId} 
                          className={`p-4 rounded-xl border transition-all duration-200 ${
                            isItemSaved
                              ? 'border-emerald-100 bg-emerald-50/30'
                              : isRejected 
                              ? 'border-red-200 bg-red-50/60 opacity-80' 
                              : isCorrected 
                              ? 'border-amber-300 bg-amber-50/60 ring-2 ring-amber-100' 
                              : 'border-slate-200 bg-slate-50/70 hover:bg-slate-50'
                          }`}
                        >
                          
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-2.5">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold text-slate-800 text-sm">{field.fieldName}</h4>
                                {isCorrected && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 uppercase">
                                    Modified
                                  </span>
                                )}
                                {isRejected && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800 uppercase">
                                    Rejected
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                  field.confidence > 0.8 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                  {Math.round(field.confidence * 100)}% Confident
                                </span>
                              </div>
                            </div>
                            
                            {/* Decision Toggles */}
                            <div className={`flex items-center gap-1 bg-white p-1 rounded-xl border shadow-xs shrink-0 ${isItemSaved ? 'opacity-60 border-slate-200' : 'border-slate-200'}`}>
                              <button
                                type="button"
                                disabled={isItemSaved}
                                onClick={() => handleDecisionChange(field.extractedFieldId, "approved")}
                                className={`p-2 rounded-lg transition-all ${
                                  isApproved && !isRejected && !isCorrected
                                    ? 'bg-emerald-600 text-white shadow-xs font-bold' 
                                    : 'text-slate-400 hover:bg-slate-50 hover:text-slate-700'
                                } ${isItemSaved ? 'cursor-default' : 'cursor-pointer'}`}
                                title="Approve Field"
                              >
                                <HugeiconsIcon icon={Tick02Icon} className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                disabled={isItemSaved}
                                onClick={() => handleDecisionChange(field.extractedFieldId, "corrected")}
                                className={`p-2 rounded-lg transition-all ${
                                  isCorrected 
                                    ? 'bg-amber-500 text-white shadow-xs font-bold' 
                                    : 'text-slate-400 hover:bg-slate-50 hover:text-slate-700'
                                } ${isItemSaved ? 'cursor-default' : 'cursor-pointer'}`}
                                title="Correct manually"
                              >
                                <HugeiconsIcon icon={Edit02Icon} className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                disabled={isItemSaved}
                                onClick={() => handleDecisionChange(field.extractedFieldId, "rejected")}
                                className={`p-2 rounded-lg transition-all ${
                                  isRejected 
                                    ? 'bg-red-600 text-white shadow-xs font-bold' 
                                    : 'text-slate-400 hover:bg-slate-50 hover:text-slate-700'
                                } ${isItemSaved ? 'cursor-default' : 'cursor-pointer'}`}
                                title="Reject completely"
                              >
                                <HugeiconsIcon icon={Cancel01Icon} className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Input Value */}
                          <div className={`${isRejected ? 'pointer-events-none opacity-40 line-through' : ''}`}>
                            <Input
                              value={val}
                              disabled={isItemSaved || isRejected}
                              onChange={(e) => handleValueChange(field.extractedFieldId, e.target.value)}
                              className={`bg-white transition-all font-medium ${
                                isCorrected ? 'border-amber-300 focus:border-amber-500' : ''
                              } ${isItemSaved ? 'bg-slate-50/50 text-slate-700' : ''}`}
                            />
                          </div>
                          
                          {/* Issues */}
                          {field.issues && field.issues.length > 0 && (
                            <div className="mt-3 text-xs text-red-700 bg-red-50 p-2.5 rounded-lg border border-red-100">
                              <span className="font-bold block mb-1">AI Flagged Issue:</span>
                              <ul className="list-disc list-inside space-y-0.5">
                                {field.issues.map((issue, i) => <li key={i}>{issue}</li>)}
                              </ul>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Save Button for Item */}
                  <div className="bg-slate-50/80 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
                    <p className="text-xs text-slate-400">
                      {isItemSaved ? "Item locked after review" : "Save individual item or click Confirm All above"}
                    </p>
                    <Button
                      className={`font-semibold transition-all ${
                        isItemSaved
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-none cursor-default'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                      onClick={() => !isItemSaved && handleSaveItem(item)}
                      disabled={isItemSaved || savingItems[item.extractedItemId]}
                    >
                      {savingItems[item.extractedItemId] ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Saving...
                        </div>
                      ) : isItemSaved ? (
                        <div className="flex items-center gap-1.5">
                          <HugeiconsIcon icon={Tick02Icon} className="w-4 h-4" />
                          Saved & Approved
                        </div>
                      ) : (
                        "Save Item Review"
                      )}
                    </Button>
                  </div>

                </div>
              );
            })
          ) : extractedData ? (
            <div className="border border-slate-200 rounded-2xl bg-white p-12 text-center shadow-sm">
              <p className="text-slate-500 font-medium">No extraction data found to review.</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
