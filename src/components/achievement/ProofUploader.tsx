// ─────────────────────────────────────────────────────────────
// AchieveX — Proof Uploader (Step 3)
// Category+type+status-aware proof requirements with simulated
// upload, progress indicators, and geotag location evidence.
//
// TEAM LEAD MODE:
// When isTeamLead=true, proofs are split into two sections:
//   1. Common Team Proofs (uploaded once, shared by all members)
//   2. Your Individual Certificate (only the leader's own cert)
// ─────────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getProofRequirements, type ProofDef } from '../../data/achievementConfig';
import { SectionCard, InfoBanner } from './FormComponents';

interface UploadedFile {
  name: string;
  size: string;
  uri: string;
  type: 'pdf' | 'image';
}

interface ProofUploaderProps {
  categoryId: string;
  typeId: string;
  formData: Record<string, any>;
  hasCashPrize: boolean;
  isOffline: boolean;
  uploadedFiles: Record<string, UploadedFile | null>;
  errors: Record<string, string>;
  onFileChange: (proofId: string, file: UploadedFile | null) => void;
  isTeamLead?: boolean; // When true, split into Common Proofs + Individual Certificate sections
}

export default function ProofUploader({
  categoryId,
  typeId,
  formData,
  hasCashPrize,
  isOffline,
  uploadedFiles,
  errors,
  onFileChange,
  isTeamLead = false,
}: ProofUploaderProps) {
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [geotagStatus, setGeotagStatus] = useState<'none' | 'capturing' | 'success'>('none');

  // Get category+type+status-aware proof requirements
  const requirements = getProofRequirements(categoryId, typeId, formData);

  // Build active requirements — append cash prize and geotag if needed
  const activeRequirements: ProofDef[] = [...requirements];

  if (hasCashPrize) {
    activeRequirements.push({
      id: 'cashPrizeProof',
      label: 'Cash Prize Official Proof',
      required: true,
    });
  }

  if (isOffline) {
    activeRequirements.push({
      id: 'geotaggedPhoto',
      label: 'Geotagged Photo (Event Evidence)',
      required: true,
    });
  }

  // Auto-simulate geotag capture for offline events
  useEffect(() => {
    if (isOffline && geotagStatus === 'none') {
      setGeotagStatus('capturing');
      const timer = setTimeout(() => {
        setGeotagStatus('success');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isOffline]);

  const simulateUpload = (reqId: string) => {
    setUploading((prev) => ({ ...prev, [reqId]: true }));
    setTimeout(() => {
      setUploading((prev) => ({ ...prev, [reqId]: false }));
      const isPdf = reqId.includes('cert') || reqId.includes('Cert') || reqId.includes('letter') || reqId.includes('Letter') || reqId.includes('proof') || reqId.includes('Proof');
      onFileChange(reqId, {
        name: isPdf ? `${reqId}_document.pdf` : `${reqId}_photo.png`,
        size: isPdf ? '2.4 MB' : '1.8 MB',
        uri: 'mock-uri',
        type: isPdf ? 'pdf' : 'image',
      });
    }, 1200);
  };

  const handleDelete = (reqId: string) => {
    onFileChange(reqId, null);
  };

  // Renders a single proof upload slot — reused for both sections
  const renderProofSlot = (
    req: { id: string; label: string; required?: boolean },
    file: UploadedFile | null | undefined,
    isUp: boolean | undefined,
    error: string | undefined
  ) => (
    <SectionCard key={req.id} title={req.label}>
      {!file && !isUp ? (
        <View>
          <TouchableOpacity
            style={[styles.uploadBox, error ? styles.uploadBoxError : null]}
            activeOpacity={0.7}
            onPress={() => simulateUpload(req.id)}
          >
            <View style={styles.uploadIconCircle}>
              <Ionicons
                name={req.required ? 'document-text-outline' : 'cloud-upload-outline'}
                size={28}
                color="#2563EB"
              />
            </View>
            <Text style={styles.uploadTitle}>Tap to select or browse files</Text>
            <Text style={styles.uploadFormat}>
              Supports PDF, JPG, PNG up to 5MB
              {req.required ? '' : ' (Optional)'}
            </Text>
          </TouchableOpacity>
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
      ) : isUp ? (
        <View style={styles.uploadProgressBox}>
          <ActivityIndicator size="small" color="#2563EB" />
          <Text style={styles.progressText}>Uploading file...</Text>
        </View>
      ) : (
        <View style={styles.fileCard}>
          <View style={styles.fileIconCircle}>
            <Ionicons
              name={file?.type === 'pdf' ? 'document-outline' : 'image-outline'}
              size={22}
              color="#2563EB"
            />
          </View>
          <View style={styles.fileInfo}>
            <Text style={styles.fileName} numberOfLines={1}>{file?.name}</Text>
            <Text style={styles.fileSize}>{file?.size}</Text>
          </View>
          <View style={styles.successBadge}>
            <Ionicons name="checkmark-circle" size={18} color="#16A34A" />
          </View>
          <TouchableOpacity style={styles.deleteBtn} activeOpacity={0.7} onPress={() => handleDelete(req.id)}>
            <Ionicons name="trash-outline" size={18} color="#DC2626" />
          </TouchableOpacity>
        </View>
      )}

      {/* Simulated Location Geotag capture block */}
      {req.id === 'geotaggedPhoto' && (
        <View style={styles.locationContainer}>
          {geotagStatus === 'capturing' && (
            <View style={styles.locationRow}>
              <ActivityIndicator size="small" color="#2563EB" style={{ marginRight: 8 }} />
              <Text style={styles.locationProgressText}>Capturing GPS coordinates...</Text>
            </View>
          )}
          {geotagStatus === 'success' && (
            <View style={styles.locationRow}>
              <Ionicons name="location" size={16} color="#16A34A" style={{ marginRight: 6 }} />
              <Text style={styles.locationSuccessText}>
                📍 Location captured: Nandha Engineering College (11.2842° N, 77.5962° E)
              </Text>
            </View>
          )}
        </View>
      )}
    </SectionCard>
  );

  return (
    <View>
      <View style={styles.titleBlock}>
        <Text style={styles.pageTitle}>
          {isTeamLead ? 'Upload Team & Individual Proofs' : 'Upload Achievement Proof'}
        </Text>
        <Text style={styles.pageSubtitle}>
          {isTeamLead
            ? 'Upload the shared team proofs once, then upload your own individual certificate.'
            : 'Provide official documents and event evidence for verification.'}
        </Text>
      </View>

      {/* ── TEAM LEAD: Common Team Proofs Section ── */}
      {isTeamLead && (
        <View>
          {/* Section header */}
          <View style={styles.teamSectionHeader}>
            <View style={styles.teamSectionIconWrap}>
              <Ionicons name="people" size={14} color="#4F46E5" />
            </View>
            <Text style={styles.teamSectionLabel}>COMMON TEAM PROOFS</Text>
          </View>
          <InfoBanner
            type="info"
            icon="shield-checkmark-outline"
            message="These documents apply to your whole team. Upload them ONCE — your team members will not need to re-upload these."
          />
          <View style={{ height: 12 }} />
        </View>
      )}

      {/* Render common proofs (or all proofs for individual) */}
      {activeRequirements.map((req) => {
        const file = uploadedFiles[req.id];
        const isUp = uploading[req.id];
        const error = errors[req.id];
        return renderProofSlot(req, file, isUp, error);
      })}

      {/* ── TEAM LEAD: Individual Certificate Section ── */}
      {isTeamLead && (
        <View style={{ marginTop: 8 }}>
          {/* Divider */}
          <View style={styles.sectionDivider} />

          {/* Section header */}
          <View style={styles.teamSectionHeader}>
            <View style={[styles.teamSectionIconWrap, { backgroundColor: '#DCFCE7' }]}>
              <Ionicons name="person" size={14} color="#16A34A" />
            </View>
            <Text style={[styles.teamSectionLabel, { color: '#16A34A' }]}>YOUR INDIVIDUAL CERTIFICATE</Text>
          </View>
          <InfoBanner
            type="info"
            icon="document-text-outline"
            message="Upload your own individual certificate. Each team member will upload their own separately after you submit."
          />
          <View style={{ height: 12 }} />

          {/* Individual certificate upload slot */}
          {renderProofSlot(
            { id: 'individualCertificate', label: 'Your Individual Certificate', required: true },
            uploadedFiles['individualCertificate'],
            uploading['individualCertificate'],
            errors['individualCertificate']
          )}
        </View>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  titleBlock: {
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  uploadBox: {
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    borderRadius: 14,
    backgroundColor: '#FAF8F5',
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadBoxError: {
    borderColor: '#DC2626',
    backgroundColor: '#FEF2F2',
  },
  uploadIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  uploadTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  uploadFormat: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  uploadProgressBox: {
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    marginLeft: 10,
  },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    padding: 12,
  },
  fileIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  fileInfo: {
    flex: 1,
    marginRight: 8,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  fileSize: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
    fontWeight: '600',
  },
  successBadge: {
    marginRight: 10,
  },
  deleteBtn: {
    padding: 8,
  },
  locationContainer: {
    marginTop: 12,
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationProgressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  locationSuccessText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E40AF',
  },
  errorText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '500',
    marginTop: 6,
  },
  // ── Team Lead Mode styles ──
  teamSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 4,
  },
  teamSectionIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  teamSectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4F46E5',
    letterSpacing: 0.6,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 20,
  },
});
