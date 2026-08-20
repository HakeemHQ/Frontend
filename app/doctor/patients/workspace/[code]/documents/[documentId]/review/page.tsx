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
import { getDocumentContent, getDocumentExtractedFields, detectDocumentMimeType } from "@/lib/api/documents";
import { usePatientDocumentsStore } from "@/store/usePatientDocumentsStore";
import { DocumentExtractedData, ExtractedField, ExtractedItem, ReviewFieldPayload, ReviewItemPayload } from "@/types/document";
import { Toast } from "@/components/ui/Toast";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@/components/ui/Input";

import { useLanguage } from "@/localization/LanguageContext";

export default function DocumentReviewPage({ params }: { params: Promise<{ code: string, documentId: string }> }) {
  const { t } = useLanguage();
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
        const rawBlob = await getDocumentContent(documentId);
        const { mimeType, blob } = await detectDocumentMimeType(rawBlob);
        setFileType(mimeType);
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
        
        // Handle ApiResponse wrapper or raw data
        const rawData = ('success' in res && 'data' in res) ? res.data : res;
        const typedData = rawData as unknown as DocumentExtractedData;
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
              const fieldDecision = (field.decision || '').toLowerCase();
              initialDecisions[field.extractedFieldId] = (fieldDecision === "corrected" || fieldDecision === "rejected" || fieldDecision === "approved") 
                ? fieldDecision 
                : "approved";

              initialValues[field.extractedFieldId] = field.confirmedValue || field.correctedValue || field.extractedValue || field.originalExtractedValue || "";
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
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [documentId]);

  const handleDecisionChange = (fieldId: string, decision: "approved" | "rejected" | "corrected") => {
    setFieldDecisions(prev => ({
      ...prev,
      [fieldId]: decision
    }));
  };

  const handleValueChange = (fieldId: string, val: string) => {
    setFieldValues(prev => ({
      ...prev,
      [fieldId]: val
    }));
    // If the user starts typing/editing a value, mark its decision as 'corrected'
    setFieldDecisions(prev => ({
      ...prev,
      [fieldId]: "corrected"
    }));
  };

  const handleSaveItem = async (item: ExtractedItem) => {
    try {
      setSavingItems(prev => ({ ...prev, [item.extractedItemId]: true }));
      
      const payload: ReviewItemPayload = {
        extractedItemId: item.extractedItemId,
        fields: item.fields.map(field => {
          const rawDecision = fieldDecisions[field.extractedFieldId] || "approved";
          const lowerDecision = rawDecision.toLowerCase() as "approved" | "rejected" | "corrected";
          
          return {
            extractedFieldId: field.extractedFieldId,
            decision: lowerDecision,
            correctedValue: lowerDecision === "corrected" ? (fieldValues[field.extractedFieldId] || field.extractedValue) : undefined
          };
        })
      };

      const res = await reviewExtractedItem(item.extractedItemId, payload);
      if (res) {
        setSavedItems(prev => ({ ...prev, [item.extractedItemId]: true }));
        setToastMessage({
          message: `${item.itemType} ${t('doctor.documents.approvedAndSaved')}`,
          type: "success"
        });
      }
    } catch (err: any) {
      console.error("Failed to save item review", err);
      setToastMessage({
        message: err.message || t('ui.somethingWentWrong'),
        type: "error"
      });
    } finally {
      setSavingItems(prev => ({ ...prev, [item.extractedItemId]: false }));
    }
  };

  const handleConfirmAll = async () => {
    if (!extractedData?.items || extractedData.items.length === 0) return;
    
    try {
      setIsConfirming(true);

      // Auto-save any unsaved items first
      const unsavedItems = extractedData.items.filter(it => !savedItems[it.extractedItemId]);
      for (const item of unsavedItems) {
        await handleSaveItem(item);
      }

      const res = await confirmExtractedData(documentId);
      if (res !== null) {
        setIsConfirmed(true);
        setToastMessage({
          message: t('doctor.documents.allItemsConfirmed'),
          type: "success"
        });
      }
    } catch (err: any) {
      console.error("Failed to confirm all items", err);
      setToastMessage({
        message: err.message || t('ui.somethingWentWrong'),
        type: "error"
      });
    } finally {
      setIsConfirming(false);
    }
  };

  const handleFinishReview = () => {
    router.push(`/doctor/patients/workspace/${code}/documents`);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteDocument(documentId);
      setIsDeleteModalOpen(false);
      router.push(`/doctor/patients/workspace/${code}/documents`);
    } catch (err: any) {
      console.error("Failed to delete document", err);
      setIsDeleteModalOpen(false);
      setToastMessage({
        message: err?.response?.data?.message || err.message || t('doctor.documents.uploadFailed'),
        type: "error"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const allItemsSaved = extractedData?.items && extractedData.items.length > 0 && extractedData.items.every(it => savedItems[it.extractedItemId]);

  return (
    <div className="max-w-6xl mx-auto pt-4 pb-12 space-y-6 animate-in fade-in duration-300 relative">
      <AnimatePresence>
        {toastMessage && (
          <Toast 
            message={toastMessage.message} 
            type={toastMessage.type} 
            onClose={() => setToastMessage(null)} 
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isDeleting && setIsDeleteModalOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 transition-opacity"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl p-6 md:p-8 shadow-2xl z-50 border border-slate-100"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-4 border border-red-100 shadow-xs">
                  <HugeiconsIcon icon={Alert02Icon} className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 font-heading">
                  {t('doctor.documents.deleteConfirmTitle')}
                </h3>
                <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                  {t('doctor.documents.deleteConfirmDesc')}
                </p>
                <div className="flex items-center gap-3 w-full">
                  <Button
                    variant="outline"
                    className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                    onClick={() => setIsDeleteModalOpen(false)}
                    disabled={isDeleting}
                  >
                    {t('doctor.profile.cancel')}
                  </Button>
                  <Button
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold shadow-xs"
                    onClick={confirmDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>{t('doctor.documents.deleting')}</span>
                      </div>
                    ) : (
                      t('doctor.documents.yesDelete')
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
          <h1 className="text-3xl font-bold text-slate-900 font-heading">
            {t('doctor.documents.reviewTitle')}
          </h1>
          <p className="text-slate-500">
            {t('doctor.documents.reviewSubtitle')}
          </p>
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
            {isDeleting ? t('doctor.documents.deleting') : t('doctor.documents.delete')}
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
                  {t('doctor.documents.confirmingAll')}
                </>
              ) : (
                <>
                  <HugeiconsIcon icon={Tick02Icon} className="w-4 h-4" />
                  {t('doctor.documents.confirmAllItems')}
                </>
              )}
            </Button>
          ) : (
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl font-bold border border-emerald-200 shadow-sm">
              <HugeiconsIcon icon={Tick02Icon} className="w-4 h-4" />
              {t('doctor.documents.allItemsConfirmed')}
            </div>
          )}

          <Button 
            onClick={handleFinishReview}
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold flex items-center gap-2 shadow-sm"
          >
            {t('doctor.documents.finishReview')}
            <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4 rtl:rotate-180" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Left Side: Document Preview */}
        <div className="border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden flex flex-col lg:sticky lg:top-6 h-[600px] lg:h-[800px]">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-700">{t('doctor.documents.documentEvidence')}</h3>
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
                  <p>{t('doctor.documents.previewNotAvailable')}</p>
                </div>
              )
            ) : (
              <p className="text-slate-500">{t('doctor.documents.previewNotAvailable')}</p>
            )}
          </div>
        </div>

        {/* Right Side: Interactive Forms */}
        <div className="space-y-6">
          {isExtracting ? (
            <div className="border border-slate-200 rounded-2xl bg-white p-12 text-center shadow-sm">
              <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-500 font-medium">{t('doctor.documents.loadingDocuments')}</p>
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
                        {item.itemType} <span className="text-slate-400 text-sm font-normal normal-case">({t('doctor.documents.item')} {item.sequenceNumber || itemIdx + 1})</span>
                      </h2>
                    </div>
                    {isItemSaved ? (
                      <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xs">
                        <HugeiconsIcon icon={Tick02Icon} className="w-3.5 h-3.5" />
                        {t('doctor.documents.approvedAndSaved')}
                      </div>
                    ) : (
                      <div className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">
                        {t('doctor.documents.pendingReview')}
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
                                    {t('doctor.documents.modified')}
                                  </span>
                                )}
                                {isRejected && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800 uppercase">
                                    {t('doctor.documents.rejected')}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                  field.confidence > 0.8 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                  {Math.round(field.confidence * 100)}% {t('doctor.documents.confident')}
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
                                title={t('doctor.documents.approveField')}
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
                                title={t('doctor.documents.correctManually')}
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
                                title={t('doctor.documents.rejectCompletely')}
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
                          {field.issues && field.issues.length > 0 && !isCorrected && (
                            <div className="mt-3 text-xs text-red-700 bg-red-50 p-2.5 rounded-lg border border-red-100">
                              <span className="font-bold block mb-1">{t('doctor.documents.aiFlaggedIssue')}:</span>
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
                      {isItemSaved ? t('doctor.documents.itemLocked') : t('doctor.documents.saveItemHint')}
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
                          {t('doctor.documents.savingItem')}
                        </div>
                      ) : isItemSaved ? (
                        <div className="flex items-center gap-1.5">
                          <HugeiconsIcon icon={Tick02Icon} className="w-4 h-4" />
                          {t('doctor.documents.approvedAndSaved')}
                        </div>
                      ) : (
                        t('doctor.documents.saveItem')
                      )}
                    </Button>
                  </div>

                </div>
              );
            })
          ) : extractedData ? (
            <div className="border border-slate-200 rounded-2xl bg-white p-12 text-center shadow-sm">
              <p className="text-slate-500 font-medium">{t('doctor.documents.noResultsDesc')}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
