import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './eventSearch_validateScheduledBreaks';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Displays accurate search results for events based on filters', async () => {
  fetchMock.get('/api/event/search?query=concert', { results: [{ name: 'Concert Event' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'concert' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Concert Event')).toBeInTheDocument();
}, 10000);

test('Displays error message when search results are unavailable', async () => {
  fetchMock.get('/api/event/search?query=concert', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'concert' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('No event results found')).toBeInTheDocument();
}, 10000);

test('Successfully validates scheduled breaks.', async () => {
  fetchMock.post('/api/validateScheduledBreaks', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.submit(screen.getByTestId('submit-break-schedule-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Breaks scheduled')).toBeInTheDocument();
}, 10000);

test('Fails to validate incorrect scheduled breaks.', async () => {
  fetchMock.post('/api/validateScheduledBreaks', { error: 'Breaks are incorrectly scheduled' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.submit(screen.getByTestId('submit-break-schedule-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Breaks are incorrectly scheduled')).toBeInTheDocument();
}, 10000);