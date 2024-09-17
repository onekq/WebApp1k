import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './validateAgendaItemTitle_validateTicketQuantity';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully validates agenda item title.', async () => {
  fetchMock.post('/api/validateAgendaItemTitle', { title: 'Valid Title' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('agenda-title-input'), { target: { value: 'Valid Title' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-agenda-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Title is valid')).toBeInTheDocument();
}, 10000);

test('Fails to validate missing agenda item title.', async () => {
  fetchMock.post('/api/validateAgendaItemTitle', { error: 'Title is required' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('agenda-title-input'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-agenda-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Title is required')).toBeInTheDocument();
}, 10000);

test('ticket quantity within event capacity', async () => {
  fetchMock.post('/ticketQuantity', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketQuantity'), { target: { value: '50' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitButton')); });

  expect(fetchMock.calls('/ticketQuantity').length).toEqual(1);
  expect(screen.getByText('Ticket quantity set')).toBeInTheDocument();
}, 10000);

test('ticket quantity exceeds event capacity', async () => {
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketQuantity'), { target: { value: '1000' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitButton')); });

  expect(screen.getByText('Quantity exceeds event capacity.')).toBeInTheDocument();
}, 10000);