import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import CMS from './seoAuditReport';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully generates an SEO audit report', async () => {
  fetchMock.post('/api/seo-audit', { status: 200 });

  await act(async () => { render(<MemoryRouter><CMS /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/generate seo audit report/i)); });

  expect(fetchMock.calls('/api/seo-audit').length).toBe(1);
  expect(screen.getByText(/seo audit report generated successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to generate an SEO audit report due to server error', async () => {
  fetchMock.post('/api/seo-audit', { status: 500 });

  await act(async () => { render(<MemoryRouter><CMS /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/generate seo audit report/i)); });

  expect(fetchMock.calls('/api/seo-audit').length).toBe(1);
  expect(screen.getByText(/failed to generate seo audit report/i)).toBeInTheDocument();
}, 10000);

