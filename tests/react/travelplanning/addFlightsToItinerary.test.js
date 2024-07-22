import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './addFlightsToItinerary';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully adds flights to an itinerary.', async () => {
  fetchMock.post('/api/add-flight', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('flight-input'), { target: { value: 'Flight1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-flight-button')); });

  expect(fetchMock.calls('/api/add-flight', 'POST')).toHaveLength(1);
  expect(screen.getByTestId('flight1')).toBeInTheDocument();
}, 10000);

test('fails to add flights due to network error.', async () => {
  fetchMock.post('/api/add-flight', { status: 500, body: { error: 'Network error' } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('flight-input'), { target: { value: 'Flight1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-flight-button')); });

  expect(fetchMock.calls('/api/add-flight', 'POST')).toHaveLength(1);
  expect(screen.getByText('Network error')).toBeInTheDocument();
}, 10000);

