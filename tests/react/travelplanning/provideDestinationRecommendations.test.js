import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './provideDestinationRecommendations';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should render destination recommendations based on user preferences', async () => {
  fetchMock.get('/api/recommendations', { destinations: ['Paris', 'London', 'Tokyo'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter preferences'), { target: { value: 'beach' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Recommendations')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Paris')).toBeInTheDocument();
}, 10000);

test('should show error if fetching destination recommendations fails', async () => {
  fetchMock.get('/api/recommendations', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter preferences'), { target: { value: 'beach' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Recommendations')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load recommendations')).toBeInTheDocument();
}, 10000);

