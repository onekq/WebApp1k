import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './validateItineraryConflicts';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully validates itinerary conflicts.', async () => {
  fetchMock.post('/api/validate-conflicts', { status: 200, body: { conflicts: [] } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('validate-conflicts-button')); });

  expect(fetchMock.calls('/api/validate-conflicts', 'POST')).toHaveLength(1);
  expect(screen.getByText('No conflicts')).toBeInTheDocument();
}, 10000);

test('fails to validate itinerary conflicts due to conflicts.', async () => {
  fetchMock.post('/api/validate-conflicts', { status: 400, body: { conflicts: ['Conflict1'] } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('validate-conflicts-button')); });

  expect(fetchMock.calls('/api/validate-conflicts', 'POST')).toHaveLength(1);
  expect(screen.getByText('Conflict1')).toBeInTheDocument();
}, 10000);

