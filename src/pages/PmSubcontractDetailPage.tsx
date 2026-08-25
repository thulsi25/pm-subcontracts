import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ModusWcAlert,
  ModusWcButton,
  ModusWcCard,
  ModusWcIcon,
  ModusWcTypography,
} from '@trimble-oss/moduswebcomponents-react'
import { SubcontractDetailSummary } from '../components/subcontracts/SubcontractDetailSummary'
import { CollapsePaneIcon } from '../components/subcontracts/CollapsePaneIcon'
import { SubcontractDetailToolbar } from '../components/subcontracts/SubcontractDetailToolbar'
import {
  SubcontractDistributionTab,
  type DistributionView,
} from '../components/subcontracts/SubcontractDistributionTab'
import { SubcontractInformationTab } from '../components/subcontracts/SubcontractInformationTab'
import {
  createNewSubcontractRecord,
  deleteSubcontractRecord,
  getSubcontractById,
  loadSubcontractRecords,
  saveSubcontractRecord,
} from '../data/subcontractStore'
import type { SubcontractRecord } from '../data/subcontractTypes'
import {
  getRequiredFieldCompletion,
  INFORMATION_TAB_REQUIRED_FIELDS,
} from '../utils/subcontractTabCompletion'

type DetailTab = 'information' | 'distribution'

const DETAIL_TABS: { id: DetailTab; label: string }[] = [
  { id: 'information', label: 'Information' },
  { id: 'distribution', label: 'Distribution' },
]

function getTabRequiredCompletion(tab: DetailTab, record: SubcontractRecord) {
  if (tab === 'information') {
    return getRequiredFieldCompletion(INFORMATION_TAB_REQUIRED_FIELDS, record)
  }
  return { filled: 0, total: 0 }
}

export function PmSubcontractDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<DetailTab>('information')
  const [navExpanded, setNavExpanded] = useState(true)
  const [record, setRecord] = useState<SubcontractRecord | null>(null)
  const [recordIds, setRecordIds] = useState<string[]>(() =>
    loadSubcontractRecords().map((item) => item.id),
  )
  const [toastMessage, setToastMessage] = useState('')
  const [validationError, setValidationError] = useState('')
  const [distributionView, setDistributionView] = useState<DistributionView>('grid')

  const showToast = useCallback((message: string) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(''), 3000)
  }, [])

  useEffect(() => {
    if (!id) {
      navigate('/pm-subcontracts')
      return
    }

    const existing = getSubcontractById(id)
    if (!existing) {
      navigate('/pm-subcontracts')
      return
    }

    setRecord({ ...existing })
    setRecordIds(loadSubcontractRecords().map((item) => item.id))
    setActiveTab('information')
    setValidationError('')
    setDistributionView('grid')
  }, [id, navigate])

  const currentIndex = useMemo(
    () => (record ? recordIds.indexOf(record.id) : -1),
    [record, recordIds],
  )

  const tabRequiredCompletion = useMemo(() => {
    if (!record) {
      return {
        information: { filled: 0, total: INFORMATION_TAB_REQUIRED_FIELDS.length },
        distribution: { filled: 0, total: 0 },
      } satisfies Record<DetailTab, { filled: number; total: number }>
    }

    return Object.fromEntries(
      DETAIL_TABS.map((tab) => [tab.id, getTabRequiredCompletion(tab.id, record)]),
    ) as Record<DetailTab, { filled: number; total: number }>
  }, [record])

  const updateRecord = useCallback((patch: Partial<SubcontractRecord>) => {
    setRecord((prev) => (prev ? { ...prev, ...patch } : prev))
    setValidationError('')
  }, [])

  const goToRecord = useCallback(
    (nextId: string) => {
      navigate(`/pm-subcontracts/${nextId}`)
    },
    [navigate],
  )

  const handlePrevious = useCallback(() => {
    if (currentIndex <= 0) return
    goToRecord(recordIds[currentIndex - 1])
  }, [currentIndex, goToRecord, recordIds])

  const handleNext = useCallback(() => {
    if (currentIndex < 0 || currentIndex >= recordIds.length - 1) return
    goToRecord(recordIds[currentIndex + 1])
  }, [currentIndex, goToRecord, recordIds])

  const handleDelete = useCallback(() => {
    if (!record) return
    deleteSubcontractRecord(record.id)
    navigate('/pm-subcontracts')
  }, [navigate, record])

  const handleCreate = useCallback(() => {
    const draft = createNewSubcontractRecord()
    saveSubcontractRecord(draft)
    navigate(`/pm-subcontracts/${draft.id}`)
  }, [navigate])

  const handleSave = useCallback(() => {
    if (!record) return

    if (!record.vendor.trim()) {
      setValidationError('Vendor is required.')
      setActiveTab('information')
      return
    }

    saveSubcontractRecord(record)
    showToast('Subcontract saved successfully.')
  }, [record, showToast])

  if (!record) {
    return null
  }

  const isDistributionAdd = activeTab === 'distribution' && distributionView === 'add'
  const distributionCount = record.distribution.length
  const contentTitle =
    activeTab === 'information'
      ? 'Information'
      : isDistributionAdd
        ? 'Add New Distribution'
        : `${distributionCount} Distribution${distributionCount === 1 ? '' : 's'}`

  return (
    <div className="page-main sl-page-detail">
      <SubcontractDetailSummary
        record={record}
        onBack={() => navigate('/pm-subcontracts')}
      />

      <SubcontractDetailToolbar
        canDelete
        disabled={isDistributionAdd}
        currentIndex={Math.max(currentIndex, 0)}
        totalCount={recordIds.length}
        onCreate={handleCreate}
        onDelete={handleDelete}
        onEmail={() => {
          /* Send email */
        }}
        onFieldProperties={() => {
          /* Field properties */
        }}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onDistribution={() => {
          /* Distribution */
        }}
      />

      <ModusWcCard bordered={false} customClass="sl-detail-card" padding="compact">
        <div
          className={`sl-detail-layout${navExpanded ? '' : ' sl-detail-layout-nav-collapsed'}`}
        >
          <nav
            id="subcontract-detail-nav"
            aria-label="Subcontract sections"
            className="sl-detail-nav"
            hidden={!navExpanded}
          >
            {DETAIL_TABS.map((tab) => {
              const completion = tabRequiredCompletion[tab.id]
              return (
                <button
                  key={tab.id}
                  className={`sl-detail-nav-item${activeTab === tab.id ? ' sl-detail-nav-item-active' : ''}`}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="sl-detail-nav-item-label">{tab.label}</span>
                  {completion.total > 0 ? (
                    <span
                      aria-label={`${completion.filled} of ${completion.total} required fields completed`}
                      className="sl-detail-nav-badge"
                    >
                      {completion.filled} / {completion.total}
                    </span>
                  ) : null}
                </button>
              )
            })}
          </nav>

          <div className="sl-detail-content">
            <div
              className={`sl-detail-content-header${
                activeTab === 'distribution' ? ' sl-detail-content-header-tight' : ''
              }`}
            >
              <ModusWcButton
                aria-controls="subcontract-detail-nav"
                aria-expanded={navExpanded}
                aria-label={navExpanded ? 'Collapse section navigation' : 'Expand section navigation'}
                color="tertiary"
                customClass="sl-detail-nav-toggle"
                shape="square"
                size="sm"
                variant="borderless"
                onButtonClick={() => setNavExpanded((expanded) => !expanded)}
              >
                <CollapsePaneIcon expanded={navExpanded} />
              </ModusWcButton>
              {isDistributionAdd ? (
                <ModusWcButton
                  aria-label="Back to distributions"
                  color="tertiary"
                  shape="square"
                  size="sm"
                  variant="borderless"
                  onButtonClick={() => setDistributionView('grid')}
                >
                  <ModusWcIcon decorative name="arrow_back" size="sm" variant="outlined" />
                </ModusWcButton>
              ) : null}

              <ModusWcTypography
                hierarchy="h2"
                size="md"
                weight="semibold"
                customClass="sl-detail-content-title"
                label={contentTitle}
              />

              {activeTab === 'distribution' && !isDistributionAdd ? (
                <div className="sl-detail-content-actions">
                  <ModusWcButton color="tertiary" size="sm" variant="outlined">
                    Export to Excel
                  </ModusWcButton>
                  <ModusWcButton
                    color="primary"
                    size="sm"
                    variant="outlined"
                    onButtonClick={() => setDistributionView('add')}
                  >
                    Add New Distribution
                  </ModusWcButton>
                </div>
              ) : null}
            </div>

            <div className="sl-detail-content-body">
              {validationError ? (
                <p className="sl-validation-error" role="alert">
                  {validationError}
                </p>
              ) : null}

              <div
                hidden={activeTab !== 'information'}
                aria-hidden={activeTab !== 'information'}
                role="tabpanel"
                aria-label="Information"
              >
                <SubcontractInformationTab record={record} onChange={updateRecord} />
              </div>
              <div
                hidden={activeTab !== 'distribution'}
                aria-hidden={activeTab !== 'distribution'}
                role="tabpanel"
                aria-label="Distribution"
              >
                <SubcontractDistributionTab
                  record={record}
                  view={distributionView}
                  onChange={(distribution) => updateRecord({ distribution })}
                  onCommitted={() => {
                    setDistributionView('grid')
                    showToast('Distribution firms added successfully.')
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </ModusWcCard>

      <div className="sl-detail-footer">
        <ModusWcButton
          color="primary"
          disabled={isDistributionAdd}
          size="md"
          variant="filled"
          onButtonClick={handleSave}
        >
          Save Changes
        </ModusWcButton>
      </div>

      {toastMessage ? (
        <ModusWcAlert
          alertDescription={toastMessage}
          customClass="pm-interface-success-toast"
          dismissible
          icon="check_circle"
          role="status"
          variant="success"
          onDismissClick={() => setToastMessage('')}
        />
      ) : null}
    </div>
  )
}
