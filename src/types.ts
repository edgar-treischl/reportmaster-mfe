export interface AuthState {
  isAuthenticated: boolean;
  apiKey: string | null;
}

export interface FormData {
  snr: string;
  audience: 'all' | 'aus' | 'elt' | 'leh' | 'sus' | 'ubb';
  ganztag: boolean;
  stype: 'beru_bq' | 'beru_fb' | 'beru_ws' | 'gm' | 'gs' | 'gy' | 'ms' | 'rs' | 'zspf_bq' | 'zspf_fz';
}

export interface SchoolData {
  name: string;
  plots: PlotMeta[];
  plotData?: Map<string, PlotDataWithMeta>;
}

export interface PlotMeta {
  id: string;
  label: string;
}

export interface PlotData {
  id: string;
  label: string;
  groups: import('./iqb').ChartGroup[];
}

export interface ExampleDataItem {
  vars: string;
  vals: string;
  label_short: string;
  anz: number;
  p: number;
  label_n: string;
  set: string;
  plot_name: string;
}

export interface PlotDataWithMeta {
  groups: import('./iqb').ChartGroup[];
  header1: string;
  header2: string;
  set: string;
}

export interface AppState {
  formData: FormData;
  schoolData: SchoolData | null;
  selectedPlot: string | null;
  isLoading: boolean;
  isGeneratingReport: boolean;
  reportAvailable: boolean;
}

export const AUDIENCE_OPTIONS = [
  { value: 'all', label: 'Alle' },
  { value: 'aus', label: 'Ausbilder' },
  { value: 'elt', label: 'Eltern' },
  { value: 'leh', label: 'Lehrkräfte' },
  { value: 'sus', label: 'SuS' },
  { value: 'ubb', label: 'UBB' },
] as const;

export const GANZTAG_OPTIONS = [
  { value: true, label: 'Ganztag' },
  { value: false, label: 'Kein Ganztag' },
] as const;

export const STYPE_OPTIONS = [
  { value: 'beru_bq', label: 'Beru BQ' },
  { value: 'beru_fb', label: 'Beru FB' },
  { value: 'beru_ws', label: 'Beru WS' },
  { value: 'gm', label: 'Grund und Mittelschule' },
  { value: 'gs', label: 'Grundschule' },
  { value: 'gy', label: 'Gymnasium' },
  { value: 'ms', label: 'Mittelschule' },
  { value: 'rs', label: 'Realschule' },
  { value: 'zspf_bq', label: 'Zspf BQ' },
  { value: 'zspf_fz', label: 'Zspf FZ' },
] as const;
