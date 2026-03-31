import type { ApiMatchResult, ApiScheduleItem, EventsDict } from '../types/api';
import { PHASE_LABELS } from '../constants';
import { getGender, getPhase } from './matchCode';

function cityFromLocation(location: string): string {
  // "La Beaujoire Stadium, Nantes" → "Nantes"
  const parts = location.split(',');
  return parts.length > 1 ? parts[parts.length - 1].trim() : location;
}

function athleteNameByCode(code: string, result: ApiMatchResult): string {
  for (const item of result.items) {
    const found = item.teamAthletes?.find(
      (a) => a.athlete.code === code || a.participantCode === code,
    );
    if (found) return found.athlete.TVName ?? found.athlete.name;
  }
  return code;
}

function teamNameByCode(teamCode: string, result: ApiMatchResult): string {
  const item = result.items.find((i) => i.teamCode === teamCode);
  return item?.participant?.name ?? teamCode;
}

function buildLineup(item: ApiMatchResult['items'][number]) {
  const headCoach = item.teamCoaches?.find(
    (c) => c.function.functionCode === 'COACH',
  );
  const coach = headCoach?.coach
    ? `${headCoach.coach.givenName} ${headCoach.coach.familyName}`
    : null;

  const formation =
    item.eventUnitEntries?.find((e) => e.eue_code === 'FORMATION')?.eue_value ?? null;

  const starters = (item.teamAthletes ?? []).filter((a) =>
    a.eventUnitEntries?.some(
      (e) => e.eue_code === 'STARTER' && e.eue_value === 'Y',
    ),
  );

  const bench = (item.teamAthletes ?? []).filter(
    (a) =>
      !a.eventUnitEntries?.some(
        (e) => e.eue_code === 'STARTER' && e.eue_value === 'Y',
      ),
  );

  const mapAthlete = (a: (typeof item.teamAthletes)[number]) => {
    const position =
      a.eventUnitEntries?.find((e) => e.eue_code === 'POSITION' && e.eue_pos === '1')
        ?.eue_value ?? null;
    return {
      name: a.athlete.TVName ?? a.athlete.name,
      number: Number(a.bib) || null,
      position,
    };
  };

  return {
    team: item.participant?.name ?? '',
    formation,
    coach,
    startingXI: starters.map(mapAthlete),
    bench: bench.map(mapAthlete),
  };
}

export function buildExportJson(
  match: ApiScheduleItem,
  result: ApiMatchResult,
  events: EventsDict,
) {
  const homeItem = result.items.find((i) => i.sortOrder === 1);
  const awayItem = result.items.find((i) => i.sortOrder === 2);
  const totPeriod = result.periods?.find((p) => p.p_code === 'TOT');
  const h1Period  = result.periods?.find((p) => p.p_code === 'H1');

  const gender     = getGender(match.code) === 'M' ? "Men's" : "Women's";
  const phaseKey   = getPhase(match.code);
  const phaseLabel = phaseKey ? PHASE_LABELS[phaseKey] : '';
  const eventCode  = match.code.slice(0, 22);
  const event      = events[eventCode];

  // Scorers from playByPlay (SHOT/GOAL = open play, FRD/GOAL = free kick)
  const scorers = (result.playByPlay ?? []).flatMap((period) =>
    (period.actions ?? [])
      .filter((a) => (a.pbpa_Action === 'SHOT' || a.pbpa_Action === 'FRD') && a.pbpa_Result === 'GOAL')
      .map((a) => {
        const competitor = a.competitors?.[0];
        const scorer   = competitor?.athletes?.find((at) => at.pbpat_role === 'SCR');
        const assister = competitor?.athletes?.find((at) => at.pbpat_role === 'ASSIST');
        const minute   = a.pbpa_When ? parseInt(a.pbpa_When, 10) : null;
        const type     = a.pbpa_Action === 'FRD' ? 'free_kick' : 'open_play';
        return {
          team: teamNameByCode(competitor?.pbpc_code ?? '', result),
          player: scorer ? athleteNameByCode(scorer.pbpat_code, result) : null,
          minute,
          ...(assister ? { assist: athleteNameByCode(assister.pbpat_code, result) } : {}),
          type,
        };
      }),
  );

  return {
    competition: {
      name: event?.longDescription ?? 'Olympic Football',
      season: 'Paris 2024',
      round: `${gender} ${phaseLabel}`.trim(),
    },
    venue: {
      name: match.venue?.description ?? null,
      city: match.location ? cityFromLocation(match.location.description) : null,
    },
    kickoff: match.startDate,
    status: match.status.code === 'FINISHED' ? 'FT' : match.status.description,
    teams: {
      home: homeItem?.participant?.name ?? null,
      away: awayItem?.participant?.name ?? null,
    },
    score: {
      home: totPeriod ? Number(totPeriod.home.score) : null,
      away: totPeriod ? Number(totPeriod.away.score) : null,
      halfTime: {
        home: h1Period ? Number(h1Period.home.score) : null,
        away: h1Period ? Number(h1Period.away.score) : null,
      },
    },
    scorers,
    lineups: {
      home: homeItem ? buildLineup(homeItem) : null,
      away: awayItem ? buildLineup(awayItem) : null,
    },
  };
}

export function downloadJson(data: object, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
