import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import RateProduct from './rateProduct';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Rate Product successfully submits a rating.', async () => {
  fetchMock.post('/api/rate', { status: 200 });

  await act(async () => { render(<MemoryRouter><RateProduct /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('star-4')); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-rating-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Rating submitted')).toBeInTheDocument();
}, 10000);

test('Rate Product fails and displays error message.', async () => {
  fetchMock.post('/api/rate', { status: 500 });

  await act(async () => { render(<MemoryRouter><RateProduct /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('star-4')); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-rating-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to submit rating')).toBeInTheDocument();
}, 10000);