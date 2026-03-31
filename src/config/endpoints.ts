export const API = {
  scheduleUrl: 'https://stacy.olympics.com/OG2024/data/SCH_StartList~comp=OG2024~disc=FBL~lang=ENG.json',
  eventsUrl:   'https://stacy.olympics.com/OG2024/data/SEL_Events~comp=OG2024~disc=FBL~lang=ENG.json',
  resultUrl:   (matchCode: string) =>
    `https://stacy.olympics.com/OG2024/data/RES_ByRSC_H2H~comp=OG2024~disc=FBL~rscResult=${matchCode}~lang=ENG.json`,
} as const;
