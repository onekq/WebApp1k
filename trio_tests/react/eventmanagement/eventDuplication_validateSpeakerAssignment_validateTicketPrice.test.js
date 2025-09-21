import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './eventDuplication_validateSpeakerAssignment_validateTicketPrice';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Displays success message upon event duplication', async () => {
  fetchMock.post('/api/event/duplicate', { success: true });

  await act(async () => { render(<MemoryRouter><EventApp /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('duplicate-event-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Event duplicated successfully')).toBeInTheDocument();
}, 10000);

test('Displays error message upon failing to duplicate event', async () => {
  fetchMock.post('/api/event/duplicate', 400);

  await act(async () => { render(<MemoryRouter><EventApp /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('duplicate-event-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to duplicate the event')).toBeInTheDocument();
}, 10000);

test('Successfully validates speaker assignment.', async () => {
  fetchMock.post('/api/validateSpeakerAssignment', { assigned: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('speaker-select'), { target: { value: 'John Doe' } }); });
  await act(async () => { fireEvent.submit(screen.getByTestId('submit-speaker-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Speaker assigned')).toBeInTheDocument();
}, 10000);

test('Fails to validate missing speaker assignment.', async () => {
  fetchMock.post('/api/validateSpeakerAssignment', { error: 'Speaker is required' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('speaker-select'), { target: { value: '' } }); });
  await act(async () => { fireEvent.submit(screen.getByTestId('submit-speaker-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Speaker is required')).toBeInTheDocument();
}, 10000);

test('sets ticket price successfully', async () => {
  fetchMock.post('/ticketPrice', 200);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketPrice'), { target: { value: '25' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitButton')); });

  expect(fetchMock.calls('/ticketPrice').length).toEqual(1);
  expect(screen.getByText('Ticket price set')).toBeInTheDocument();
}, 10000);

test('fails to set ticket price', async () => {
  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketPrice'), { target: { value: '-10' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitButton')); });

  expect(screen.getByText('Ticket price must be positive.')).toBeInTheDocument();
}, 10000);
