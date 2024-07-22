import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import RetrieveSiteAnalytics from './retrieveOverallSiteAnalytics';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully retrieves overall site analytics', async () => {
  fetchMock.get('/api/getSiteAnalytics', { status: 200, body: { totalPosts: 100, totalViews: 1000 } });

  await act(async () => { render(<MemoryRouter><RetrieveSiteAnalytics /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Get Site Analytics')); });

  expect(fetchMock.calls('/api/getSiteAnalytics')).toHaveLength(1);
  expect(screen.getByText('Total Posts: 100')).toBeInTheDocument();
  expect(screen.getByText('Total Views: 1000')).toBeInTheDocument();
}, 10000);

test('fails to retrieve overall site analytics with an error message', async () => {
  fetchMock.get('/api/getSiteAnalytics', { status: 500, body: { message: 'Server Error' } });

  await act(async () => { render(<MemoryRouter><RetrieveSiteAnalytics /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Get Site Analytics')); });

  expect(fetchMock.calls('/api/getSiteAnalytics')).toHaveLength(1);
  expect(screen.getByText('Error retrieving site analytics')).toBeInTheDocument();
}, 10000);

