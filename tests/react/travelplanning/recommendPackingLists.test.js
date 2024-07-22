import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './recommendPackingLists';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should render recommended packing lists based on destination and trip duration', async () => {
  fetchMock.get('/api/packing-lists', { packingList: ['Sunscreen', 'Swimwear'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination and duration'), { target: { value: 'Hawaii, 7 days' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Packing List')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Sunscreen')).toBeInTheDocument();
}, 10000);

test('should show error if fetching recommended packing lists fails', async () => {
  fetchMock.get('/api/packing-lists', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination and duration'), { target: { value: 'Hawaii, 7 days' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Packing List')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load packing lists')).toBeInTheDocument();
}, 10000);

