import imageData from './assets.json';
import tableData from './tables.json';
import study from './study.json';

type Asset = {
  file: string;
  width: number;
  height: number;
  previewWidth: number;
  previewHeight: number;
  source?: string;
};
type Table = {
  file: string;
  source: string;
  heading?: string[];
  rows?: (string | number | null)[][];
};
type Figure = {
  title: string;
  caption: string;
  fallback?: string;
  asset?: Asset;
};

export const assets: Record<string, Asset> = imageData;
export const tables: Record<string, Table> = tableData;
const bands = ['theta (4–8 Hz)', 'alpha (8–13 Hz)', 'low beta (13–20 Hz)', 'high beta (20–30 Hz)', 'gamma (30–60 Hz)'];
const colors = 'C1 is green, C2 pale green, C3 orange and C4 pink. C1–C4 denote successive quarters of each participant’s estimated span.';
const inference = 'The five rows (A–E) show theta (4–8 Hz), alpha (8–13 Hz), low beta (13–20 Hz), high beta (20–30 Hz) and gamma (30–60 Hz). Left, frontal (blue background) and parietal (lavender background) participant distributions shown as violins with median and interquartile range. Centre, adjusted pairwise p values, with frontal below the diagonal and parietal above it. Coloured cells indicate p < 0.05 after Benjamini–Hochberg FDR adjustment of paired Wilcoxon tests. Right, unsigned effect-size r matrices in the same arrangement. Darker green indicates larger effects. The conventional thresholds are r > 0.3 (medium) and r > 0.5 (large). ' + colors;
const overview = 'Panels show weighted modularity (Q, a), characteristic path length (CPL, b), clustering coefficient (CC, c), node strength (kᵢ, d) and Shannon graph complexity (Cᴳ, e). Each panel groups boxplots by frequency band and relative class. Frontal and parietal distributions are paired in blue and purple, respectively. Boxes summarize the interquartile range and median. The overview does not show significance or effect-size matrices.';
const figures: Record<string, Figure> = {
  f1: { title: 'The Corsi Block-Tapping task', caption: 'Snapshot of the digital Corsi Block-Tapping Test. The sequence proceeds from encoding of successive illuminated blocks to a short retention period and then to a response phase, when participants reproduce the order. Only stimulus-aligned encoding epochs entered the main EEG analysis.' },
  f2: { title: 'Relative versus absolute class assignment', caption: 'Illustrative Corsi span S = 8 with absolute sequence lengths L = 2–8. The proposed method (P, upper row for each L) uses four capacity-normalized classes across serial positions. The conventional method (C, lower rows) uses one length-based class per sequence, with grayscale indicating the sequence-length class. ' + colors },
  f3: { title: 'Shannon graph complexity in the older-adult cohort', caption: 'Shannon graph complexity (Cᴳ) across four relative classes in the older-adult cohort (N = 60), using clean epochs from correctly completed trials. ' + inference },
  f4: { title: 'Shannon graph complexity in the young-adult cohort', caption: 'Shannon graph complexity (Cᴳ) across four relative classes in the young-adult cohort (N = 21), using clean epochs from correctly completed trials. ' + inference },
  f5: { title: 'Graph-metric overview in the older-adult cohort', caption: 'Descriptive summary across successfully completed trials in the older-adult cohort (N = 60). ' + overview },
  f6: { title: 'Graph-metric overview in the young-adult cohort', caption: 'Descriptive summary across successfully completed trials in the young-adult cohort (N = 21). ' + overview },
  s9: { title: 'Clean-epoch heatmaps in the older-adult cohort', caption: 'Joint counts of retained clean epochs from successful and unsuccessful trials in the older-adult cohort. Panels C1–C4 represent relative classes. The horizontal axis is absolute sequence length L and the vertical axis is within-sequence serial position k. Each cell shows the number of epochs for that combination and uses the figure colour scale from light (low count) to dark blue (high count).' },
  s10: { title: 'Clean-epoch heatmaps in the young-adult cohort', caption: 'Joint counts of retained clean epochs from successful and unsuccessful trials in the young-adult cohort. Panels C1–C4 represent relative classes. The horizontal axis is absolute sequence length L and the vertical axis is within-sequence serial position k. Each cell shows the number of epochs for that combination and uses the figure colour scale from light (low count) to dark blue (high count).' },
  s16: { title: 'Bootstrap stability of theta-band AEC · Older-adult cohort', caption: 'Theta-band amplitude envelope correlation (AEC) in the older-adult cohort. Each circle denotes one participant’s median Spearman correlation between the reference average network and 1,000 bootstrap-averaged networks, calculated across 120 unique edges. Boxplots show class distributions with their medians and interquartile ranges. Diamond markers show values beyond the plotted whiskers. ' + colors },
  s17: { title: 'Shannon complexity before and after ICA · Older-adult cohort', caption: 'Violin distributions of participant-level Shannon graph complexity (Cᴳ) across relative classes, based on clean encoding epochs from successfully completed trials in the older-adult cohort (N = 60). Rows show theta, alpha, low beta, high beta and gamma. Columns are frontal (left) and parietal (right). Solid violins denote the original pipeline and hatching denotes independent component analysis (ICA) correction. White dots mark medians and dark vertical marks show interquartile ranges. ' + colors },
  s18: { title: 'Shannon complexity effect sizes before and after ICA · Older-adult cohort', caption: 'Paired Wilcoxon r for Shannon graph complexity by class, band and region in the older-adult cohort (N = 60), using epochs from successfully completed trials. Rows fix the reference class (CL1–CL4) and show its three comparisons, so a class pair appears in both directions. In each band, F and P mean frontal and parietal. Solid bars show the original preprocessing and hatched bars the ICA-corrected pipeline. Labels give the unsigned r values. All 60 distinct contrasts remained significant after FDR correction in each pipeline. ' + colors }
};

for (const [index, metric] of ['Node strength', 'Characteristic path length', 'Clustering coefficient', 'Weighted modularity'].entries()) {
  for (const [position, cohort] of [study.cohortLabels.older, study.cohortLabels.young].entries()) {
    const key = 's' + (2 * index + position + 1);
    figures[key] = {
      title: metric + ' · ' + cohort,
      caption: `${metric} by relative demand class in the ${cohort.toLowerCase()} during successfully completed trials. ${inference} Adjustment covers 300 tests within the cohort. Displayed p and r values are rounded.`,
      fallback: index < 3 ? 'f' + (position + 5) : undefined
    };
  }
}

for (const [index, band] of bands.entries()) {
  figures['s' + (index + 11)] = {
    title: 'Fixed-position sequence-length analysis · ' + band + ' · Older-adult cohort',
    caption: 'Shannon graph complexity (Cᴳ) for the older-adult cohort in ' + band + ' by absolute sequence length L, within fixed serial position k and relative class. Rows show k = 1–6. Frontal panels are left (blue background) and parietal panels are right (lavender). Points are participant means from clean encoding epochs. Boxplots display median and interquartile range. Vertical scales are shared within a row and can vary across rows. Sequence lengths were compared within each position and class by paired Wilcoxon tests. No comparison survived Benjamini–Hochberg FDR correction across the analysis (adjusted p ≥ 0.05). ' + colors
  };
}

for (const [key, figure] of Object.entries(figures)) figure.asset = assets[key];

export const tableNotes: Record<string, { title: string; caption: string }> = {
  'table-s1': { title: 'Clean epochs by class and outcome · Older-adult cohort', caption: 'Retained epochs by relative class and trial outcome. The percentage is the fraction of clean epochs in that row from successfully completed trials. Unclassified epochs have k > S.' },
  'table-s2': { title: 'Clean epochs by sequence length and class · Older-adult cohort', caption: 'Counts of retained classifiable epochs by sequence length L and C1–C4. Both trial outcomes are included.' },
  'table-s3': { title: 'Clean epochs by class and outcome · Young-adult cohort', caption: 'Retained epochs by relative class and trial outcome. The percentage is the fraction of clean epochs in that row from successfully completed trials. Unclassified epochs have k > S.' },
  'table-s4': { title: 'Clean epochs by sequence length and class · Young-adult cohort', caption: 'Counts of retained classifiable epochs by sequence length L and C1–C4. Both trial outcomes are included.' },
  'table-s5': { title: 'Epoch rejection before and after ICA · Older-adult cohort', caption: 'Older-adult cohort. Rates are rejected epochs divided by initially eligible epochs per participant and class. The table shows unweighted mean ± sample SD across 60 paired participants. The workbook includes all participant-level records.' },
  'table-s6': { title: 'ICLabel ocular and muscular components · Older-adult cohort', caption: 'Records from the older-adult cohort. Eye and Muscle components met the corresponding probability threshold of 0.80. Totals describe classifications and removals. An EEG recording may contain distinct components from both categories. The workbook also includes component-count distributions and individual recording details.' },
  'epochs-older': { title: 'Detailed epoch counts · Older-adult cohort', caption: 'Participant-level counts by span S, length L, serial position k, class and trial outcome.' },
  'epochs-young': { title: 'Detailed epoch counts · Young-adult cohort', caption: 'Participant-level counts by span S, length L, serial position k, class and trial outcome.' },
  'ica-contrasts': { title: 'Complete ICA contrast statistics', caption: 'Six pairwise contrasts across five frequency bands and both regions. Includes r and adjusted p for each pipeline.' }
};

export { figures };
export const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const route = (path = '') => base + '/' + path;
export const science = (file: string) => route('science/' + file);
export const original = (path: string) => study.repository + '/blob/' + study.revision + '/' + path.split('/').map(encodeURIComponent).join('/');
export const figureLabel = (key: string) => 'Figure ' + (key[0] === 'f' ? key.slice(1) : key.toUpperCase());
export const tableLabel = (key: string) => 'Table ' + key.slice('table-'.length).toUpperCase();
