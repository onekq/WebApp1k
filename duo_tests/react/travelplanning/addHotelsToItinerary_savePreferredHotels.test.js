import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addHotelsToItinerary_savePreferredHotels';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully adds hotels to an itinerary.', async () => {
  fetchMock.post('/api/add-hotel', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('hotel-input'), { target: { value: 'Hotel1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-hotel-button')); });

  expect(fetchMock.calls('/api/add-hotel', 'POST')).toHaveLength(1);
  expect(screen.getByTestId('hotel1')).toBeInTheDocument();
}, 10000);

test('fails to add hotels due to network error.', async () => {
  fetchMock.post('/api/add-hotel', { status: 500, body: { error: 'Network error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('hotel-input'), { target: { value: 'Hotel1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-hotel-button')); });

  expect(fetchMock.calls('/api/add-hotel', 'POST')).toHaveLength(1);
  expect(screen.getByText('Network error')).toBeInTheDocument();
}, 10000);

test('savePreferredHotels - saves preferred hotels to a wishlist successfully', async () => {
  fetchMock.post('/api/hotels/1/wishlist', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('save-wishlist-1'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Hotel saved to wishlist')).toBeInTheDocument();
}, 10000);

test('savePreferredHotels - shows error message when saving to wishlist fails', async () => {
  fetchMock.post('/api/hotels/1/wishlist', {
    body: { message: 'Save Failed' },
    status: 500,
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('save-wishlist-1'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Save Failed')).toBeInTheDocument();
}, 10000);