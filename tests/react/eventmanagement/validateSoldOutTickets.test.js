import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './validateSoldOutTickets';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('marks tickets as sold out', async () => {
  fetchMock.post('/markSoldOut', 200);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('markSoldOutButton')); });

  expect(fetchMock.calls('/markSoldOut').length).toEqual(1);
  expect(screen.getByText('Tickets marked as sold out')).toBeInTheDocument();
}, 10000);

test('fails to mark tickets as sold out', async () => {
  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('markSoldOutButton')); });

  expect(screen.getByText('Unable to mark tickets as sold out.')).toBeInTheDocument();
}, 10000);

