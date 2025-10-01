import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './eventSearch_validateSpeakerAssignment_validateTicketDuplication';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Displays accurate search results for events based on filters', async () => {
  fetchMock.get('/api/event/search?query=concert', { results: [{ name: 'Concert Event' }] });

  await act(async () => { render(<MemoryRouter><EventApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'concert' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Concert Event')).toBeInTheDocument();
}, 10000);

test('Displays error message when search results are unavailable', async () => {
  fetchMock.get('/api/event/search?query=concert', 404);

  await act(async () => { render(<MemoryRouter><EventApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'concert' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('No event results found')).toBeInTheDocument();
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

test('allows ticket duplication', async () => {
  fetchMock.post('/duplicateTicket', 200);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('duplicateTicketButton')); });

  expect(fetchMock.calls('/duplicateTicket').length).toEqual(1);
  expect(screen.getByText('Ticket duplicated')).toBeInTheDocument();
}, 10000);

test('fails to duplicate ticket', async () => {
  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('duplicateTicketButton')); });

  expect(screen.getByText('Unable to duplicate ticket.')).toBeInTheDocument();
}, 10000);
