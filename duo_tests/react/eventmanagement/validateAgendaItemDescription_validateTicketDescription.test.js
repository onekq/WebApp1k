import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './validateAgendaItemDescription_validateTicketDescription';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully validates agenda item description.', async () => {
  fetchMock.post('/api/validateAgendaItemDescription', { valid: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('agenda-description-input'), { target: { value: 'This is a valid description' } }); });
  await act(async () => { fireEvent.submit(screen.getByTestId('submit-description-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Description is valid')).toBeInTheDocument();
}, 10000);

test('Fails to validate long agenda item description.', async () => {
  fetchMock.post('/api/validateAgendaItemDescription', { error: 'Description is too long' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('agenda-description-input'), { target: { value: 'This description is way too long and exceeds the character limit set by the system.' } }); });
  await act(async () => { fireEvent.submit(screen.getByTestId('submit-description-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Description is too long')).toBeInTheDocument();
}, 10000);

test('ticket description within limit', async () => {
  fetchMock.post('/ticketDescription', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketDescription'), { target: { value: 'A valid description' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitButton')); });

  expect(fetchMock.calls('/ticketDescription').length).toEqual(1);
  expect(screen.getByText('Ticket description set')).toBeInTheDocument();
}, 10000);

test('ticket description exceeds limit', async () => {
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketDescription'), { target: { value: 'A'.repeat(300) } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitButton')); });

  expect(screen.getByText('Description exceeds character limit.')).toBeInTheDocument();
}, 10000);