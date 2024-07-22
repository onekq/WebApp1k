import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import CMS from './addSitemap';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully generates an XML sitemap', async () => {
  fetchMock.post('/api/xml-sitemap', { status: 200 });

  await act(async () => { render(<MemoryRouter><CMS /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/generate xml sitemap/i)); });

  expect(fetchMock.calls('/api/xml-sitemap').length).toBe(1);
  expect(screen.getByText(/xml sitemap generated successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to generate an XML sitemap due to server error', async () => {
  fetchMock.post('/api/xml-sitemap', { status: 500 });

  await act(async () => { render(<MemoryRouter><CMS /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/generate xml sitemap/i)); });

  expect(fetchMock.calls('/api/xml-sitemap').length).toBe(1);
  expect(screen.getByText(/failed to generate xml sitemap/i)).toBeInTheDocument();
}, 10000);

