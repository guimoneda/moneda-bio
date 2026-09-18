/** `2019-04-01` → `2019`. Dates are displayed as years; months are noise in an index. */
export const year = (iso?: string | null): string => (iso ? iso.slice(0, 4) : '');

/** `2019-04-01` → `APR 2019`, for the detail views where precision earns its space. */
export const monthYear = (iso?: string | null): string => {
  if (!iso) return '';
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase();
};

/** `4` → `04`. Index numbers are the spine of the layout, so they are always two digits. */
export const pad = (n: number): string => String(n).padStart(2, '0');

export const range = (start?: string | null, end?: string | null): string =>
  `${year(start)} — ${end ? year(end) : 'PRESENT'}`;
