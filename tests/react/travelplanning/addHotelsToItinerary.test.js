import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './addHotelsToItinerary';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully adds hotels to an itinerary.', async () => {
  fetchMock.post('/api/add-hotel', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('hotel-input'), { target: { value: 'Hotel1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-hotel-button')); });

  expect(fetchMock.calls('/api/add-hotel', 'POST')).toHaveLength(1);
  expect(screen.getByTestId('hotel1')).toBeInTheDocument();
}, 10000);

test('fails to add hotels due to network error.', async () => {
  fetchMock.post('/api/add-hotel', { status: 500, body: { error: 'Network error' } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('hotel-input'), { target: { value: 'Hotel1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-hotel-button')); });

  expect(fetchMock.calls('/api/add-hotel', 'POST')).toHaveLength(1);
  expect(screen.getByText('Network error')).toBeInTheDocument();
}, 10000);

