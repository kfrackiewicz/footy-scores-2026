import { useState } from 'react';
import { PHASE_LABELS, DEFAULT_FILTERS } from '../types/filters';
import type { Filters, Gender, Phase } from '../types/filters';
import { toggleItem } from '../utils/helpers';

interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
}

export default function FiltersBar({ filters, onChange }: Props) {
  const [phaseOpen, setPhaseOpen] = useState(false);

  const toggleGender = (g: Gender) =>
    onChange({ ...filters, genders: toggleItem(filters.genders, g) });

  const togglePhase = (p: Phase) =>
    onChange({ ...filters, phases: toggleItem(filters.phases, p) });

  const allPhases = Object.keys(PHASE_LABELS) as Phase[];
  const allPhasesSelected = filters.phases.length === allPhases.length;

  const toggleAllPhases = () =>
    onChange({ ...filters, phases: allPhasesSelected ? [] : [...allPhases] });

  const activePhaseCount = filters.phases.length;
  const phaseLabel =
    allPhasesSelected
      ? 'All stages'
      : activePhaseCount === 0
      ? 'No stage'
      : `${activePhaseCount} stage${activePhaseCount > 1 ? 's' : ''}`;

  return (
    <div className="filters">
      {/* Gender toggle */}
      <div className="filter-group">
        {(['M', 'W'] as Gender[]).map((g) => (
          <button
            key={g}
            className={`filter-chip${filters.genders.includes(g) ? ' filter-chip--active' : ''}`}
            onClick={() => toggleGender(g)}
          >
            {g === 'M' ? "Men's" : "Women's"}
          </button>
        ))}
      </div>

      {/* Phase dropdown */}
      <div className="filter-dropdown">
        <button
          className="filter-dropdown-trigger"
          onClick={() => setPhaseOpen((o) => !o)}
        >
          {phaseLabel} <span className="filter-dropdown-arrow">{phaseOpen ? '▲' : '▼'}</span>
        </button>

        {phaseOpen && (
          <div className="filter-dropdown-menu">
            <button className="filter-dropdown-item filter-dropdown-item--all" onClick={toggleAllPhases}>
              <span className={`filter-checkbox${allPhasesSelected ? ' filter-checkbox--checked' : ''}`} />
              All stages
            </button>
            <div className="filter-dropdown-divider" />
            {allPhases.map((p) => (
              <button key={p} className="filter-dropdown-item" onClick={() => togglePhase(p)}>
                <span className={`filter-checkbox${filters.phases.includes(p) ? ' filter-checkbox--checked' : ''}`} />
                {PHASE_LABELS[p]}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
