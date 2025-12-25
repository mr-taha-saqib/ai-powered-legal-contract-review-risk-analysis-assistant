'use client';

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from '@react-pdf/renderer';
import { ClauseData, RiskLevel, CLAUSE_TYPE_NAMES, RISK_COLORS } from '@/types';
import { formatDate, DISCLAIMER_TEXT } from '@/lib/utils';

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#1a365d',
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: '#1a365d',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#666666',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  metaItem: {
    fontSize: 10,
    color: '#666666',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#333333',
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  summary: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 4,
  },
  summaryText: {
    fontSize: 11,
    color: '#333333',
    lineHeight: 1.6,
  },
  riskBreakdown: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 15,
  },
  riskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  riskDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  riskLabel: {
    fontSize: 10,
    color: '#666666',
  },
  clause: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  clauseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  clauseType: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#333333',
  },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3,
  },
  riskBadgeText: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
  },
  clauseBody: {
    padding: 12,
  },
  clauseSection: {
    marginBottom: 10,
  },
  clauseSectionLabel: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#666666',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  originalText: {
    fontSize: 10,
    color: '#555555',
    fontStyle: 'italic',
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderLeftWidth: 3,
  },
  explanation: {
    fontSize: 10,
    color: '#333333',
    padding: 8,
    backgroundColor: '#e8f4fd',
    borderRadius: 3,
  },
  reasonsList: {
    paddingLeft: 10,
  },
  reasonItem: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  bullet: {
    width: 15,
    fontSize: 10,
  },
  reasonText: {
    fontSize: 10,
    color: '#555555',
    flex: 1,
  },
  footer: {
    marginTop: 30,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  disclaimer: {
    backgroundColor: '#fff3cd',
    padding: 12,
    borderRadius: 4,
    marginBottom: 15,
  },
  disclaimerText: {
    fontSize: 9,
    color: '#856404',
    lineHeight: 1.5,
  },
  footerMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 9,
    color: '#999999',
  },
  pageNumber: {
    position: 'absolute',
    bottom: 20,
    right: 40,
    fontSize: 9,
    color: '#999999',
  },
});

interface PdfReportProps {
  contractName: string;
  analysisDate: string;
  overallRiskLevel: RiskLevel;
  summary: string;
  clauses: ClauseData[];
}

function getRiskBadgeStyle(level: RiskLevel) {
  const colors = RISK_COLORS[level];
  return {
    backgroundColor: colors.bg,
    color: colors.text,
  };
}

function getRiskBorderColor(level: RiskLevel): string {
  return RISK_COLORS[level].border;
}

// PDF Document Component
function PdfDocument({
  contractName,
  analysisDate,
  overallRiskLevel,
  summary,
  clauses,
}: PdfReportProps) {
  const riskCounts = clauses.reduce(
    (acc, clause) => {
      acc[clause.riskLevel]++;
      return acc;
    },
    { high: 0, medium: 0, low: 0 } as Record<RiskLevel, number>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Contract Analysis Report</Text>
          <Text style={styles.subtitle}>{contractName}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaItem}>
              Analysis Date: {formatDate(analysisDate)}
            </Text>
            <View style={[styles.riskBadge, { backgroundColor: RISK_COLORS[overallRiskLevel].bg }]}>
              <Text style={[styles.riskBadgeText, { color: RISK_COLORS[overallRiskLevel].text }]}>
                Overall Risk: {overallRiskLevel.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        {/* Executive Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Executive Summary</Text>
          <View style={styles.summary}>
            <Text style={styles.summaryText}>{summary}</Text>
            <View style={styles.riskBreakdown}>
              <View style={styles.riskItem}>
                <View style={[styles.riskDot, { backgroundColor: '#dc3545' }]} />
                <Text style={styles.riskLabel}>{riskCounts.high} High Risk</Text>
              </View>
              <View style={styles.riskItem}>
                <View style={[styles.riskDot, { backgroundColor: '#ffc107' }]} />
                <Text style={styles.riskLabel}>{riskCounts.medium} Medium Risk</Text>
              </View>
              <View style={styles.riskItem}>
                <View style={[styles.riskDot, { backgroundColor: '#28a745' }]} />
                <Text style={styles.riskLabel}>{riskCounts.low} Low Risk</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Clause Analysis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Clause Analysis</Text>
          {clauses.map((clause, index) => (
            <View key={index} style={styles.clause} wrap={false}>
              <View style={styles.clauseHeader}>
                <Text style={styles.clauseType}>
                  {CLAUSE_TYPE_NAMES[clause.type]}
                </Text>
                <View style={[styles.riskBadge, getRiskBadgeStyle(clause.riskLevel)]}>
                  <Text style={[styles.riskBadgeText, { color: RISK_COLORS[clause.riskLevel].text }]}>
                    {clause.riskLevel.toUpperCase()}
                  </Text>
                </View>
              </View>
              <View style={styles.clauseBody}>
                <View style={styles.clauseSection}>
                  <Text style={styles.clauseSectionLabel}>Contract Text</Text>
                  <Text style={[styles.originalText, { borderLeftColor: getRiskBorderColor(clause.riskLevel) }]}>
                    &quot;{clause.originalText}&quot;
                  </Text>
                </View>
                <View style={styles.clauseSection}>
                  <Text style={styles.clauseSectionLabel}>Plain Language Explanation</Text>
                  <Text style={styles.explanation}>{clause.plainLanguageExplanation}</Text>
                </View>
                <View style={styles.clauseSection}>
                  <Text style={styles.clauseSectionLabel}>Risk Factors</Text>
                  <View style={styles.reasonsList}>
                    {clause.riskReasons.map((reason, i) => (
                      <View key={i} style={styles.reasonItem}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.reasonText}>{reason}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.disclaimer}>
            <Text style={styles.disclaimerText}>{DISCLAIMER_TEXT.standard}</Text>
          </View>
          <View style={styles.footerMeta}>
            <Text>Generated: {new Date().toLocaleString()}</Text>
            <Text>Powered by Contract Analyzer</Text>
          </View>
        </View>

        {/* Page Numbers */}
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  );
}

// Export function to generate and download PDF
export async function generatePdfReport(props: PdfReportProps): Promise<void> {
  const blob = await pdf(<PdfDocument {...props} />).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `contract-analysis-${props.contractName.replace(/\.[^/.]+$/, '')}-${new Date().toISOString().split('T')[0]}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default PdfDocument;
