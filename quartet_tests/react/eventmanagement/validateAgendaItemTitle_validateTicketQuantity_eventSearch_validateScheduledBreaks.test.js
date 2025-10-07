import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './validateAgendaItemTitle_validateTicketQuantity_eventSearch_validateScheduledBreaks';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully validates agenda item title. (from validateAgendaItemTitle_validateTicketQuantity)', async () => {
  fetchMock.post('/api/validateAgendaItemTitle', { title: 'Valid Title' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('agenda-title-input'), { target: { value: 'Valid Title' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-agenda-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Title is valid')).toBeInTheDocument();
}, 10000);

test('Fails to validate missing agenda item title. (from validateAgendaItemTitle_validateTicketQuantity)', async () => {
  fetchMock.post('/api/validateAgendaItemTitle', { error: 'Title is required' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('agenda-title-input'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-agenda-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Title is required')).toBeInTheDocument();
}, 10000);

test('ticket quantity within event capacity (from validateAgendaItemTitle_validateTicketQuantity)', async () => {
  fetchMock.post('/ticketQuantity', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketQuantity'), { target: { value: '50' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitButton')); });

  expect(fetchMock.calls('/ticketQuantity').length).toEqual(1);
  expect(screen.getByText('Ticket quantity set')).toBeInTheDocument();
}, 10000);

test('ticket quantity exceeds event capacity (from validateAgendaItemTitle_validateTicketQuantity)', async () => {
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketQuantity'), { target: { value: '1000' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitButton')); });

  expect(screen.getByText('Quantity exceeds event capacity.')).toBeInTheDocument();
}, 10000);

test('Displays accurate search results for events based on filters (from eventSearch_validateScheduledBreaks)', async () => {
  fetchMock.get('/api/event/search?query=concert', { results: [{ name: 'Concert Event' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'concert' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Concert Event')).toBeInTheDocument();
}, 10000);

test('Displays error message when search results are unavailable (from eventSearch_validateScheduledBreaks)', async () => {
  fetchMock.get('/api/event/search?query=concert', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'concert' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('No event results found')).toBeInTheDocument();
}, 10000);

test('Successfully validates scheduled breaks. (from eventSearch_validateScheduledBreaks)', async () => {
  fetchMock.post('/api/validateScheduledBreaks', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.submit(screen.getByTestId('submit-break-schedule-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Breaks scheduled')).toBeInTheDocument();
}, 10000);

test('Fails to validate incorrect scheduled breaks. (from eventSearch_validateScheduledBreaks)', async () => {
  fetchMock.post('/api/validateScheduledBreaks', { error: 'Breaks are incorrectly scheduled' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.submit(screen.getByTestId('submit-break-schedule-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Breaks are incorrectly scheduled')).toBeInTheDocument();
}, 10000);

