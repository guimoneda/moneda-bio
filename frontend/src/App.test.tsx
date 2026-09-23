import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import App from './App';
import { clearResourceCache } from './hooks/useResource';

const JOBS = [
  {
    id: 1,
    title: 'Senior QA Engineer',
    company: 'Acme',
    description: '<p>Built the regression suite.</p>',
    more_details: '<p>Details.</p>',
    technologies: ['Selenium', 'Python', 'Docker', 'Jenkins'],
    start_date: '2021-03-01',
    end_date: null,
    is_current: true,
    duration: '4 yrs',
  },
  {
    id: 2,
    title: 'QA Analyst',
    company: 'Globex',
    description: '<p>Manual and automated coverage.</p>',
    technologies: ['Robot Framework'],
    start_date: '2018-01-01',
    end_date: '2021-02-01',
    duration: '3 yrs, 1 mo',
  },
];

const routeFetch = (url: string) => {
  if (url.includes('/api/jobs/')) return JOBS;
  return [];
};

beforeEach(() => {
  clearResourceCache();
  jest.spyOn(global, 'fetch').mockImplementation((input: RequestInfo | URL) =>
    Promise.resolve({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: () => Promise.resolve(routeFetch(String(input))),
    } as Response)
  );
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders the hero with a single accessible heading', async () => {
  render(<App />);
  const heading = await screen.findByRole('heading', { level: 1 });
  expect(heading).toHaveTextContent(/Guilherme/);
  expect(heading).toHaveTextContent(/Moneda/);
});

test("the h1's accessible name carries the full name and role", async () => {
  render(<App />);
  // Matches on the accessible NAME rather than textContent, since the headline
  // is assembled from per-character spans hidden from assistive technology.
  //
  // This guards the name itself — that splitting the headline into glyphs never
  // leaves the h1 announcing something partial. It does not pin the mechanism:
  // both a visually-hidden text node and an `aria-label` compute the same name
  // here and in Chromium. SplitText uses the text node because ARIA prohibits
  // `aria-label` on generic roles, so its support is not guaranteed elsewhere.
  const heading = await screen.findByRole('heading', {
    level: 1,
    name: /Guilherme\s+Moneda.*Technical delivery and incident response/i,
  });
  expect(heading).toBeInTheDocument();
});

test('primary calls to action point at the experience page and mailbox', async () => {
  render(<App />);
  await screen.findByTestId('job-index');
  expect(screen.getByRole('link', { name: /View My Work/i })).toHaveAttribute('href', '/jobs');
  expect(screen.getByRole('link', { name: /Contact Me/i })).toHaveAttribute(
    'href',
    'mailto:contact@guimoneda.com'
  );
});

test('the home page lists the most recent roles, newest first', async () => {
  render(<App />);
  const index = await screen.findByTestId('job-index');
  const rows = await within(index).findAllByTestId('job-row');
  expect(rows).toHaveLength(2);
  expect(rows[0]).toHaveTextContent('Senior QA Engineer');
  expect(rows[1]).toHaveTextContent('QA Analyst');
});

test('derived hero figures come from the API rather than hard-coded copy', async () => {
  render(<App />);
  // Two roles, five distinct technologies across them.
  await waitFor(() => expect(screen.getByText('Roles held').closest('div')).toHaveTextContent('2'));
  expect(screen.getByText('Technologies').closest('div')).toHaveTextContent('5');
});

test('surfaces a readable error instead of an empty page when the API fails', async () => {
  (global.fetch as jest.Mock).mockImplementation(() =>
    Promise.resolve({ ok: false, status: 503, statusText: 'Service Unavailable' } as Response)
  );

  render(<App />);
  const alert = await screen.findByTestId('job-index-error');
  expect(alert).toHaveTextContent(/could not be loaded/i);
});

test('social links open safely in a new tab', async () => {
  render(<App />);
  await screen.findByTestId('job-index');
  const github = screen.getByRole('link', { name: /GitHub/i });
  expect(github).toHaveAttribute('href', 'https://github.com/guimoneda/');
  expect(github).toHaveAttribute('rel', 'noopener noreferrer');
  expect(github).toHaveAttribute('target', '_blank');
});
