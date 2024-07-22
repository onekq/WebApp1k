import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './suggestTravelInsurance';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should render suggested travel insurance options', async () => {
  fetchMock.get('/api/insurance', { insurance: ['InsureMyTrip', 'World Nomads'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination and travel dates'), { target: { value: 'USA, 2024-01-01' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Insurance')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('InsureMyTrip')).toBeInTheDocument();
}, 10000);

test('should show error if fetching travel insurance options fails', async () => {
  fetchMock.get('/api/insurance', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination and travel dates'), { target: { value: 'USA, 2024-01-01' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Insurance')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load insurance options')).toBeInTheDocument();
}, 10000);

