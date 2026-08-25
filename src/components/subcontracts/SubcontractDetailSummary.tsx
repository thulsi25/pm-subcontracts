import { useState } from 'react'
import {
  ModusWcBadge,
  ModusWcButton,
  ModusWcCard,
  ModusWcIcon,
  ModusWcTypography,
} from '@trimble-oss/moduswebcomponents-react'
import { PROJECT_DESCRIPTION, PROJECT_NUMBER } from '../../data/subcontractTypes'
import type { SubcontractRecord } from '../../data/subcontractTypes'
import {
  slStatusBadgeClass,
  slStatusBadgeColor,
  slStatusLabel,
} from '../../utils/subcontractStatusBadge'

function formatCurrency(value: number): string {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function SubcontractDetailSummary({
  record,
  onBack,
}: {
  record: SubcontractRecord
  onBack: () => void
}) {
  const [summaryExpanded, setSummaryExpanded] = useState(false)

  return (
    <div className="sl-detail-summary">
      <div className="sl-detail-summary-top">
        <ModusWcButton
          aria-label="Back to subcontracts list"
          color="tertiary"
          shape="square"
          size="sm"
          variant="borderless"
          onButtonClick={onBack}
        >
          <ModusWcIcon decorative name="arrow_back" size="sm" variant="outlined" />
        </ModusWcButton>
        <ModusWcTypography
          hierarchy="h1"
          size="2xl"
          weight="bold"
          customClass="sl-detail-title"
          label="PM Subcontract Data"
        />
      </div>

      <ModusWcCard bordered={false} customClass="sl-detail-summary-card" padding="compact">
        <div
          className="sl-detail-summary-collapse-host"
          data-expanded={summaryExpanded ? 'true' : 'false'}
        >
          <modus-wc-collapse
            bordered={false}
            chevron-position="right"
            custom-class="sl-detail-summary-collapse"
            expanded={summaryExpanded}
            onExpandedChange={(event: CustomEvent<{ expanded: boolean }>) => {
              setSummaryExpanded(event.detail.expanded)
            }}
          >
            <div slot="header" className="sl-detail-summary-strip">
              <div className="sl-detail-summary-item sl-detail-summary-item-project">
                <span className="sl-detail-summary-label">Project</span>
                <span className="sl-detail-summary-value">{PROJECT_NUMBER}</span>
              </div>
              <div className="sl-detail-summary-item sl-detail-summary-item-project-desc">
                <span className="sl-detail-summary-label">Project Description</span>
                <span className="sl-detail-summary-value">{PROJECT_DESCRIPTION}</span>
              </div>
              <div className="sl-detail-summary-item sl-detail-summary-item-subcontract">
                <span className="sl-detail-summary-label">Subcontract</span>
                <span className="sl-detail-summary-value">{record.subcontract}</span>
              </div>
              <div className="sl-detail-summary-item sl-detail-summary-item-subcontract-desc">
                <span className="sl-detail-summary-label">Subcontract Description</span>
                <span className="sl-detail-summary-value">{record.slDescription || '—'}</span>
              </div>
              <div className="sl-detail-summary-item sl-detail-summary-item-status">
                <span className="sl-detail-summary-label">Status</span>
                <ModusWcBadge
                  color={slStatusBadgeColor(record.slStatus)}
                  customClass={`sl-status-badge ${slStatusBadgeClass(record.slStatus)}`}
                  size="sm"
                  variant="outlined"
                >
                  {slStatusLabel(record.slStatus)}
                </ModusWcBadge>
              </div>
              <div
                className="sl-detail-summary-trailing"
                onClick={(event) => event.stopPropagation()}
                onKeyDown={(event) => event.stopPropagation()}
              >
                <div className="sl-detail-summary-actions">
                  <ModusWcButton
                    color="tertiary"
                    customClass="sl-detail-summary-history-btn"
                    size="sm"
                    variant="filled"
                    onButtonClick={() => {
                      /* View History — wired later */
                    }}
                  >
                    <ModusWcIcon decorative name="history" size="xs" variant="outlined" />
                    View History
                  </ModusWcButton>
                  <ModusWcButton
                    aria-expanded={summaryExpanded}
                    aria-label={summaryExpanded ? 'Collapse summary' : 'Expand summary'}
                    color="tertiary"
                    customClass="sl-detail-summary-toggle"
                    shape="square"
                    size="sm"
                    variant="borderless"
                    onButtonClick={() => setSummaryExpanded((expanded) => !expanded)}
                  >
                    <ModusWcIcon
                      decorative
                      customClass="sl-detail-summary-chevron"
                      name={summaryExpanded ? 'expand_less' : 'expand_more'}
                      size="sm"
                      variant="outlined"
                    />
                  </ModusWcButton>
                </div>
              </div>
            </div>

          <div
            slot="content"
            className="sl-detail-summary-expanded"
            hidden={!summaryExpanded}
            aria-hidden={!summaryExpanded}
          >
            <div className="sl-detail-summary-totals">
              <div className="sl-detail-summary-total-item sl-detail-summary-total-item-original">
                <span className="sl-detail-summary-label">Total Original</span>
                <span className="sl-detail-summary-value sl-detail-summary-value-numeric">
                  {formatCurrency(record.totalOrigSubct)}
                </span>
              </div>
              <div className="sl-detail-summary-total-item sl-detail-summary-total-item-current">
                <span className="sl-detail-summary-label">Total Current</span>
                <span className="sl-detail-summary-value sl-detail-summary-value-numeric">
                  {formatCurrency(record.totalCurrSubct)}
                </span>
              </div>
            </div>
          </div>
        </modus-wc-collapse>
        </div>
      </ModusWcCard>
    </div>
  )
}
