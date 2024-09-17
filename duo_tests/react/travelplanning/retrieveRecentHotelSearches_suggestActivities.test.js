import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './retrieveRecentHotelSearches_suggestActivities';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('retrieveRecentHotelSearches - retrieves recent hotel searches successfully', async () => {
  fetchMock.get('/api/hotels/recent', {
    body: [{ id: 4, name: 'Recent Hotel' }],
    status: 200,
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('retrieve-recent-searches'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recent Hotel')).toBeInTheDocument();
}, 10000);

test('retrieveRecentHotelSearches - shows error message when retrieval fails', async () => {
  fetchMock.get('/api/hotels/recent', {
    body: { message: 'Retrieval Error' },
    status: 500,
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('retrieve-recent-searches'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Retrieval Error')).toBeInTheDocument();
}, 10000);

test('should render suggested activities at the destination', async () => {
  fetchMock.get('/api/activities', { activities: ['Hiking', 'Snorkeling'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination'), { target: { value: 'Hawaii' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Activities')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Hiking')).toBeInTheDocument();
}, 10000);

test('should show error if fetching suggested activities fails', async () => {
  fetchMock.get('/api/activities', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination'), { target: { value: 'Hawaii' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Activities')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load activities')).toBeInTheDocument();
}, 10000);